from email.mime import image

from .models import Product


class ProductService:

    def __init__(self, product_repository,category_repository):
        self.product_repository = product_repository
        self.category_repository = category_repository

    def get_all_products(self):
        return self.product_repository.get_all_products()
    
    def get_by_id(self, id_in):
        return self.product_repository.get_by_id(id_in)
    
    def get_by_name(self, name_in):
        return self.product_repository.get_by_name(name_in)
    
    def update_product(self, id_in, new_name=None, new_category=None, new_description=None, new_developer=None, new_release_date=None, new_image=None):
        product = self.product_repository.get_by_id(id_in)

        if not product:
            return None

        if new_name is not None:
            product.title = new_name
        if new_category is not None:
            category = self.category_repository.get_by_name(new_category)
            if not category:
                category = self.category_repository.add_category(new_category)  # create if not found
            product.genre = category
        if new_description is not None:
            product.description = new_description
        if new_developer is not None:
            product.developer = new_developer
        if new_release_date is not None:
            product.release_date = new_release_date
        if new_image is not None:
            product.image = new_image

        self.product_repository.save(product)
        return product

    def delete_product(self, id_in):
        product = self.product_repository.get_by_id(id_in)

        if not product:
            return None
        
        product.delete()
        return 1
    
    def add_product(self, title, genre, description, developer, release_date, image,quantity):

        if genre is not None:
            category = self.category_repository.get_by_name(genre)
            if not category:
                category = self.category_repository.add_category(genre)  # create if not found

        product = Product(
            title=title,
            genre=category,
            description=description,
            developer=developer,
            release_date=release_date,
            image=image,
            quantity=quantity
        )
        self.product_repository.save(product)
        return product
    
    def delete_category_and_products(self, category_name):
        category = self.category_repository.get_by_name(category_name)
        if not category:
            return None

        self.product_repository.delete_all_by_category(category)
        category.delete()
        return 1
    
class CategoryService:
    
    def __init__(self, category_repository):
        self.category_repository = category_repository

    def get_all_categories(self):
        return self.category_repository.get_all_categories()
    
    def get_by_id(self, id_in):
        return self.category_repository.get_by_id(id_in)

    def add_category(self, name, image=None):
        return self.category_repository.add_category(name, image)
    
    def get_name_by_id(self, id_in):
        category = self.category_repository.get_by_id(id_in)
        if category:
            return category.name
        return None
    
    def delete_category(self, name):
        return self.category_repository.delete_category(name)