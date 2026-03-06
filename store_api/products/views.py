import json
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from .models import Product
from .serializers import ProductDetailSerializer, ProductSerializer

from .repositories import ProductRepository, CategoryRepository
from .services import ProductService, CategoryService

product_repository = ProductRepository()
product_service = ProductService(product_repository)

category_repository = CategoryRepository()
category_service = CategoryService(category_repository)

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
    
    product_details = product_service.get_by_id(game_id)

    if not product_details:
        return Response(
            {"success": False, "message": "Product not found"},
            status=404
        )
    
    serializer = ProductDetailSerializer(product_details, context={'request': request})
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_product(request):
    if request.method != 'POST':
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
    new_name = data.get("name")
    new_category = data.get("category")
    new_description = data.get("description")
    new_developer = data.get("developer")
    new_release_date = data.get("release_date")
    new_image = data.get("image")


    if not game_id:
        return Response(
            {"success": False, "message": "Missing required fields"},
            status=400
        )
    
    product = product_service.get_by_id(game_id)
    
    if product is None:
        return Response(
            {"success": False, "message": "Game not found"},
            status=404
        )

    updated_product = product_service.update_product(
    id_in=game_id,
    new_name=new_name,
    new_category=new_category,
    new_description=new_description,
    new_developer=new_developer,
    new_release_date=new_release_date,
    new_image=new_image
)
    
    if not updated_product:
        return Response(
            {"success": False, "message": "Product not updated"},
            status=404
        )
    
    serializer = ProductDetailSerializer(updated_product, context={'request': request})
    return Response(serializer.data)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_product(request):
    if request.method != 'POST':
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

    if not game_id:
        return Response(
            {"success": False, "message": "Missing required fields"},
            status=400
        )
    
    product = product_service.get_by_id(game_id)
    
    if product is None:
        return Response(
            {"success": False, "message": "Game not found"},
            status=404
        )

    ans = product_service.delete_product(game_id)
    
    if ans == None:
        return Response(
            {"success": False, "message": "Product not deleted"},
            status=400
        )
    
    return Response(
        {"success": True, "message": "Product deleted successfully"},
        status=200
    )

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_category(request):
    if request.method != 'POST':
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
    
    name = data.get("name")

    if not name:
        return Response(
            {"success": False, "message": "Missing required fields"},
            status=400
        )
    
    category = category_service.add_category(name)

    if not category:
        return Response(
            {"success": False, "message": "Category not added"},
            status=400
        )
    
    return Response(
        {"success": True, "message": "Category added successfully"},
        status=200
    )