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
        
    def get_by_name(self, name):
        try:
            return Product.objects.get(title=name)
        except Product.DoesNotExist:
            return None
        
    def save(self, product):
        product.save()

    def get_by_category(self, category):
        return Product.objects.filter(genre=category)
    
    def delete_all_by_category(self, category):
        return Product.objects.filter(genre=category).delete()

class CategoryRepository:
    
    def get_all_categories(self):
        return Category.objects.all() 
    
    def get_by_id(self, category_id):
        try:
            return Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return None
        
    def get_by_name(self, name):
        try:
            return Category.objects.get(name=name)
        except Category.DoesNotExist:
            return None
        
    def save(self, category):
        category.save()

    def add_category(self, name):
        category = Category(name=name)
        category.save()
        return category
    
    def delete_category(self, category_in):
        category = self.get_by_name(category_in)

        if not category:
            return None
        
        category.delete()
        return 1