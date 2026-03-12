from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    genre = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = ['id', 'title', 'genre', 'image']

class ProductDetailSerializer(serializers.ModelSerializer):
    genre = serializers.StringRelatedField()
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Product
        fields = '__all__'