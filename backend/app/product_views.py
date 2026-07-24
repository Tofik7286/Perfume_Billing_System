import logging
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Product, InvoiceItem
from .product_serializers import ProductSerializer

logger = logging.getLogger(__name__)

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product_name']
    ordering_fields = ['product_name', 'price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.select_related('created_by').all()
        is_active_param = self.request.query_params.get('is_active', None)
        if is_active_param is not None:
            if is_active_param.lower() in ['true', '1']:
                queryset = queryset.filter(is_active=True)
            elif is_active_param.lower() in ['false', '0']:
                queryset = queryset.filter(is_active=False)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user)
        logger.info(f"Product '{serializer.validated_data.get('product_name')}' created by {user}")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if InvoiceItem.objects.filter(product=instance).exists():
            logger.warning(f"Prevented deletion of product ID {instance.id} associated with existing invoices.")
            return Response(
                {"detail": "Cannot delete product because it is associated with existing invoices. Deactivate it instead."},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        logger.info(f"Product ID {instance.id} successfully deleted by {request.user}")
        return Response(status=status.HTTP_204_NO_CONTENT)
