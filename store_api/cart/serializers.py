from rest_framework import serializers
from .models import CartItem, Order, OrderItem
from products.models import Product


class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=8, decimal_places=2, read_only=True)
    item_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_title', 'product_image', 'quantity', 'price', 'item_total']

    def get_price(self, obj):
        return float(obj.product.price)

    def get_item_total(self, obj):
        return float(obj.product.price) * obj.quantity

    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image and request:
            return request.build_absolute_uri(obj.product.image.url)
        return None


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_title', 'quantity', 'price_at_purchase']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'status', 'total_price', 'items']