from .models import Product
from .models import Category

class ProductRepository:

    def get_all_products(self):
        return Product.objects.all() 
    
    def get_by_id(self, product_id):
        try:
            return Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return None
        
    def save(self, product):
        product.save()

class CategoryRepository:
    
    def get_all_categories(self):
        return Category.objects.all() 
    
    def get_by_id(self, category_id):
        try:
            return Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return None
        
    def save(self, category):
        category.save()

    def add_category(self, name):
        category = Category(name=name)
        category.save()
        return category