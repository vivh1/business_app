from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import CartItem, Order, OrderItem
from .serializers import CartItemSerializer, OrderSerializer
from products.models import Product


@api_view(['GET'])
@permission_classes([IsAuthenticated])
#Return all cart items of user
def get_cart(request):
    items = CartItem.objects.filter(user=request.user).select_related('product')
    serializer = CartItemSerializer(items, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
# add to cart or increment quantity if already exists
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    if not product_id:
        return Response({"success": False, "message": "product_id is required"}, status=400)

    product = get_object_or_404(Product, id=product_id)

    cart_item, created = CartItem.objects.get_or_create(
        user=request.user,
        product=product,
        defaults={'quantity': quantity}
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    serializer = CartItemSerializer(cart_item, context={'request': request})
    return Response({"success": True, "item": serializer.data})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
# Update quantity of a specific cart item.
def update_cart_item(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
    quantity = request.data.get('quantity')

    if quantity is None or int(quantity) < 1:
        return Response({"success": False, "message": "Invalid quantity"}, status=400)

    cart_item.quantity = int(quantity)
    cart_item.save()

    serializer = CartItemSerializer(cart_item, context={'request': request})
    return Response({"success": True, "item": serializer.data})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
    cart_item.delete()
    return Response({"success": True, "message": "Item removed"})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    CartItem.objects.filter(user=request.user).delete()
    return Response({"success": True, "message": "Cart cleared"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
# Convert cart into a completed order
# Return order details
def checkout(request):
    items = CartItem.objects.filter(user=request.user).select_related('product')

    if not items.exists():
        return Response({"success": False, "message": "Your cart is empty"}, status=400)

    # Calculate total
    total = sum(item.product.price * item.quantity for item in items)

    # Create the order
    order = Order.objects.create(user=request.user, total_price=total, status='paid')

    # Create order items
    for item in items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price_at_purchase=item.product.price
        )

    # Clear the cart after checkout
    items.delete()

    serializer = OrderSerializer(order)
    return Response({"success": True, "order": serializer.data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
# Get all past orders of the user
def get_orders(request):
    orders = Order.objects.filter(user=request.user).prefetch_related('items__product').order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)