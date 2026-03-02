from .models import Product

class ProductRepository:

    def get_all_products(self):
        return Product.objects.all() 
    
    def get_by_id(self, product_id):
        try:
            return Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return None