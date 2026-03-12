import json, base64, uuid
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import generics
from .models import Product
from .serializers import CategorySerializer, ProductDetailSerializer, ProductSerializer
from django.core.files.base import ContentFile


from .repositories import ProductRepository, CategoryRepository
from .services import ProductService, CategoryService

category_repository = CategoryRepository()
category_service = CategoryService(category_repository)

product_repository = ProductRepository()
product_service = ProductService(product_repository,category_repository)


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
    serializer = ProductDetailSerializer(products, many=True, context={'request': request}) # Changed from ProductSerializer to ProductDetailSerializer thx - Cyel
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
    new_name = data.get("title")
    new_category = data.get("genre")
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

    image_file = None

    if new_image and new_image.startswith('data:image'):
        format, imgstr = new_image.split(';base64,')
        ext = format.split('/')[-1]
        image_file = ContentFile(base64.b64decode(imgstr), name=f'{uuid.uuid4()}.{ext}')


    updated_product = product_service.update_product(
    id_in=game_id,
    new_name=new_name,
    new_category=new_category,
    new_description=new_description,
    new_developer=new_developer,
    new_release_date=new_release_date,
    new_image=image_file
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

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_product(request):
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
    
    title = data.get("title")
    genre = data.get("genre")
    description = data.get("description")
    developer = data.get("developer")
    release_date = data.get("release_date")
    quantity=data.get("quantity")
    image_data = data.get("image")

    if not title or not genre or not description or not developer or not release_date or not image_data:
        return Response(
            {"success": False, "message": "Missing required fields"},
            status=400
        )
    
    if product_service.get_by_name(title):
        return Response(
            {"success": False, "message": "Product already exists"},
            status=400
        )
    
    image_file = None

    if image_data and image_data.startswith('data:image'):
        format, imgstr = image_data.split(';base64,')
        ext = format.split('/')[-1]
        image_file = ContentFile(base64.b64decode(imgstr), name=f'{uuid.uuid4()}.{ext}')


    product = product_service.add_product(title, genre, description, developer, release_date, image_file,quantity)

    if not product:
        return Response(
            {"success": False, "message": "Product not added"},
            status=400
        )
    
    serializer = ProductDetailSerializer(product, context={'request': request})
    return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_categories(request):
    if request.method != 'GET':
        return Response(
            {"success": False, "message": "Method not allowed"},
            status=405
        )
    
    categories = category_repository.get_all_categories()
    serializer = CategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)

def delete_category(request):
    pass