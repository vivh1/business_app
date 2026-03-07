from django.urls import path
from . import views

urlpatterns = [
    path('cart/', views.get_cart, name='get-cart'),
    path('cart/add/', views.add_to_cart, name='add-to-cart'),
    path('cart/update/<int:item_id>/', views.update_cart_item, name='update-cart-item'),
    path('cart/remove/<int:item_id>/', views.remove_cart_item, name='remove-cart-item'),
    path('cart/clear/', views.clear_cart, name='clear-cart'),
    path('cart/checkout/', views.checkout, name='checkout'),
    path('orders/', views.get_orders, name='get-orders'),
]