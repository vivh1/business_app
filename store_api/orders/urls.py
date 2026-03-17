from django.urls import path
from . import views

urlpatterns = [
    path('orders/user/<int:user_id>/', views.get_user_orders, name='get-user-orders'),
    path('orders/', views.get_orders, name='get-orders'),
    path('orders/create/', views.create_order, name='create-order'),
    path('orders/all/', views.get_all_orders, name='get-all-orders'),
]