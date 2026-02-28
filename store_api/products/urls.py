from django.urls import path
from . import views

urlpatterns = [
    #path('products/', ProductListCreate.as_view(), name='product-list-create'),
    #path('products/<int:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('products/',views.list_products,name='list-products'),
    path('products/details/',views.get_product_details,name='product-details'),
]