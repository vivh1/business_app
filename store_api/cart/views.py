from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import CartItem
from .serializers import CartItemSerializer
from .repositories import CartRepository
from orders.repositories import OrderRepository
from orders.serializers import OrderSerializer
from .services import CartService
from products.models import Product

cart_repository = CartRepository()
order_repository = OrderRepository()
cart_service = CartService(cart_repository, order_repository)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
# επιστρέφει ολα τα cart items
def get_cart(request):
    items = cart_service.get_cart(request.user)
    serializer = CartItemSerializer(items, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
# προσθέτει item ή αυξάνει quantity αν υπάρχει
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    if not product_id:
        return Response({"success": False, "message": "product_id is required"}, status=400)

    product = get_object_or_404(Product, id=product_id)
    cart_item = cart_service.add_to_cart(request.user, product, quantity)
    serializer = CartItemSerializer(cart_item, context={'request': request})
    return Response({"success": True, "item": serializer.data})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
# αυξάνει quantity 
def update_cart_item(request, item_id):
    quantity = request.data.get('quantity')

    if quantity is None or int(quantity) < 1:
        return Response({"success": False, "message": "Invalid quantity"}, status=400)

    cart_item = cart_service.update_cart_item(item_id, request.user, int(quantity))
    if not cart_item:
        return Response({"success": False, "message": "Item not found"}, status=404)

    serializer = CartItemSerializer(cart_item, context={'request': request})
    return Response({"success": True, "item": serializer.data})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
# removes item based oon id
def remove_cart_item(request, item_id):
    success = cart_service.remove_cart_item(item_id, request.user)
    if not success:
        return Response({"success": False, "message": "Item not found"}, status=404)
    return Response({"success": True, "message": "Item removed"})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
# decrease 1 quantity or delete item if quantity = 0
def decrement_cart_item(request, item_id):
    success = cart_service.decrement_cart_item(item_id, request.user)
    if not success:
        return Response({"success": False, "message": "Item not found"}, status=404)
    return Response({"success": True, "message": "Quantity decreased"})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    cart_service.clear_cart(request.user)
    return Response({"success": True, "message": "Cart cleared"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):
    order = cart_service.checkout(request.user)
    if not order:
        return Response({"success": False, "message": "Your cart is empty"}, status=400)
    serializer = OrderSerializer(order)
    return Response({"success": True, "order": serializer.data})
