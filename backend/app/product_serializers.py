from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source='created_by.username', default=None)

    class Meta:
        model = Product
        fields = [
            'id',
            'product_name',
            'price',
            'is_active',
            'created_by',
            'created_by_username',
            'created_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at']

    def validate_product_name(self, value):
        name = value.strip()
        if not name:
            raise serializers.ValidationError("Product name cannot be empty.")
        
        query = Product.objects.filter(product_name__iexact=name)
        if self.instance:
            query = query.exclude(pk=self.instance.pk)
        
        if query.exists():
            raise serializers.ValidationError("Product with this name already exists.")
        
        return name

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price must be greater than or equal to 0.00.")
        return value
