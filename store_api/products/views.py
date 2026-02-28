import json
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from .models import Product
from .serializers import ProductDetailSerializer, ProductSerializer

from .repositories import ProductRepository

product_repository = ProductRepository()

class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_products(request):
    if request.method != 'GET':
        return Response(
            {"success": False, "message": "Method not allowed"},
            status=405
        )
    
    products = product_repository.get_all_products()
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_product_details(request):
    if request.method != 'GET':
        return Response(
            {"success": False, "message": "Method not allowed"},
            status=405
        )
    
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return Response(
            {"success": False, "message": "Invalid JSON"},
            status=400
        )
    
    game_id = data.get("id")

    print(game_id)
    
    product_details = product_repository.get_by_id(game_id)

    if not product_details:
        return Response(
            {"success": False, "message": "Product not found"},
            status=404
        )
    
    serializer = ProductDetailSerializer(product_details, context={'request': request})
    return Response(serializer.data)