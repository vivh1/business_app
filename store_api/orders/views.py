from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
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