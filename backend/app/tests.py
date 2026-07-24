from decimal import Decimal
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from app.models import Product, Party, Invoice, InvoiceItem

class UserAuthenticationTests(APITestCase):
    def setUp(self):
        self.username = 'testuser'
        self.password = 'testpassword123'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
            email='testuser@example.com',
            first_name='Test',
            last_name='User'
        )
        self.login_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')
        self.me_url = reverse('user_profile')

    def test_login_success(self):
        response = self.client.post(self.login_url, {
            'username': self.username,
            'password': self.password
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], self.username)

    def test_login_invalid_credentials(self):
        response = self.client.post(self.login_url, {
            'username': self.username,
            'password': 'wrongpassword'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_missing_fields(self):
        response = self.client.post(self.login_url, {
            'username': self.username
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_token_refresh_success(self):
        login_response = self.client.post(self.login_url, {
            'username': self.username,
            'password': self.password
        }, format='json')

        refresh_token = login_response.data['refresh']

        response = self.client.post(self.refresh_url, {
            'refresh': refresh_token
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_token_refresh_invalid(self):
        response = self.client.post(self.refresh_url, {
            'refresh': 'invalid_token_string'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_profile_authenticated(self):
        login_response = self.client.post(self.login_url, {
            'username': self.username,
            'password': self.password
        }, format='json')

        access_token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.username)
        self.assertEqual(response.data['email'], 'testuser@example.com')

    def test_get_user_profile_unauthenticated(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProductAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='producttestuser',
            password='testpassword123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.product1 = Product.objects.create(
            product_name='Royal Oud 100ml',
            price=Decimal('1250.00'),
            is_active=True,
            created_by=self.user
        )
        self.product2 = Product.objects.create(
            product_name='Velvet Rose 50ml',
            price=Decimal('850.00'),
            is_active=False,
            created_by=self.user
        )
        self.list_url = '/api/v1/products/'
        self.detail_url = f'/api/v1/products/{self.product1.id}/'

    def test_list_products_authenticated(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_products_unauthenticated(self):
        self.client.logout()
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_product_success(self):
        payload = {
            'product_name': 'Amber Noir 100ml',
            'price': '1500.00',
            'is_active': True
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['product_name'], 'Amber Noir 100ml')
        self.assertEqual(Decimal(response.data['price']), Decimal('1500.00'))
        self.assertEqual(response.data['created_by_username'], 'producttestuser')

    def test_create_product_unauthenticated(self):
        self.client.logout()
        payload = {
            'product_name': 'Amber Noir 100ml',
            'price': '1500.00'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_product_validation_empty_name(self):
        payload = {
            'product_name': '   ',
            'price': '500.00'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('product_name', response.data)

    def test_create_product_validation_negative_price(self):
        payload = {
            'product_name': 'Valid Name',
            'price': '-100.00'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('price', response.data)

    def test_create_product_duplicate_name_case_insensitive(self):
        payload = {
            'product_name': 'royal oud 100ml',
            'price': '999.00'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('product_name', response.data)

    def test_retrieve_product_success(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['product_name'], 'Royal Oud 100ml')

    def test_update_product_success(self):
        payload = {
            'product_name': 'Royal Oud 100ml (Intense)',
            'price': '1350.00',
            'is_active': True
        }
        response = self.client.put(self.detail_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['product_name'], 'Royal Oud 100ml (Intense)')
        self.assertEqual(Decimal(response.data['price']), Decimal('1350.00'))

    def test_delete_product_unreferenced_success(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.product1.id).exists())

    def test_delete_product_linked_to_invoice_item_fails(self):
        party = Party.objects.create(party_name='Test Party', mobile_number='9876543210')
        invoice = Invoice.objects.create(
            invoice_number='INV-001',
            party=party,
            invoice_date='2026-07-24',
            grand_total=Decimal('1250.00')
        )
        InvoiceItem.objects.create(
            invoice=invoice,
            product=self.product1,
            product_name_snapshot='Royal Oud 100ml',
            quantity=1,
            price=Decimal('1250.00'),
            amount=Decimal('1250.00')
        )

        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Cannot delete product', response.data['detail'])
        self.assertTrue(Product.objects.filter(id=self.product1.id).exists())

    def test_search_filtering(self):
        response = self.client.get(f'{self.list_url}?search=Velvet')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['product_name'], 'Velvet Rose 50ml')

    def test_is_active_filtering(self):
        response = self.client.get(f'{self.list_url}?is_active=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['product_name'], 'Royal Oud 100ml')

    def test_create_product_exceeding_max_length(self):
        long_name = 'A' * 256
        payload = {
            'product_name': long_name,
            'price': '500.00'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('product_name', response.data)

    def test_create_product_xss_safety(self):
        xss_name = "<script>alert('xss')</script> Jasmine Perfume"
        payload = {
            'product_name': xss_name,
            'price': '600.00'
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['product_name'], xss_name)
