import json
import traceback
from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .models import Order, OrderItem
from .repositories import OrderRepository
from .services import OrderService
from .serializers import OrderSerializer

order_repository = OrderRepository()
order_service = OrderService(order_repository)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
# returns all orders for user
def get_orders(request):
    orders = order_service.get_orders(request.user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
# ADMIN ONLY
# returns all orders for any specific user
def get_user_orders(request, user_id):
    if not request.user.is_staff and not request.user.is_superuser:
        return Response({"success": False, "message": "Admin only"}, status=403)
    user = get_object_or_404(User, id=user_id)
    orders = order_service.get_orders(user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    print("="*50)
    print("CREATE ORDER VIEW CALLED")
    print(f"Request method: {request.method}")
    print(f"User: {request.user.username} (ID: {request.user.id})")
    print(f"Headers: {request.headers}")
    print("="*50)
    
    try:
        print("Attempting to read request body...")
        body = request.body.decode('utf-8')
        print(f"Raw body: {body}")
        
        data = json.loads(body)
        print(f"Parsed data: {data}")
        
        items_data = data.get('items', [])
        total_price = data.get('total_price', 0)
        
        print(f"Items: {items_data}")
        print(f"Total price: {total_price}")
        
        if not items_data:
            return Response(
                {"success": False, "message": "No items in order"},
                status=400
            )
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            total_price=total_price,
            status='pending'
        )
        print(f"Order created with ID: {order.id}")
        
        # Create order items
        for item in items_data:
            print(f"Creating item: {item}")
            OrderItem.objects.create(
                order=order,
                product_id=item['product'],
                quantity=item['quantity'],
                price_at_purchase=item['price_at_purchase']
            )
        
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=201)
        
    except json.JSONDecodeError as e:
        print(f"JSON Error: {e}")
        return Response(
            {"success": False, "message": f"Invalid JSON: {str(e)}"},
            status=400
        )
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return Response(
            {"success": False, "message": str(e)},
            status=500
        )