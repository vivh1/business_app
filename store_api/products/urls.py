from django.urls import path
from . import views

urlpatterns = [
    #path('products/', ProductListCreate.as_view(), name='product-list-create'),
    #path('products/<int:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('products/',views.list_products,name='list-products'),
    path('products/details/',views.get_product_details,name='product-details'),
    path('products/update/',views.update_product,name='update-product'),
    path('products/delete/',views.delete_product,name='delete-product'),
    path('products/add/',views.add_product,name='add-product'),
    path('categories/add/',views.add_category,name='add-category'),
    path('categories/',views.get_categories,name='get-categories'),
    path('categories/delete/',views.delete_category,name='delete-category'),
]