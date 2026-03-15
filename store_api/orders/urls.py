from django.urls import path
from . import views

urlpatterns = [
    path('user/<int:user_id>/', views.get_user_orders, name='get-user-orders'),
    path('', views.get_orders, name='get-orders'),
    path('create/', views.create_order, name='create-order'),
    path('create', views.create_order, name='create-order-no-slash'),
]