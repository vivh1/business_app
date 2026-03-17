from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    image = models.ImageField(upload_to='categories/images/', blank=True, null=True) # For category images - Cyel

    def __str__(self):
        return self.name

class Product(models.Model):

    title = models.CharField(max_length=150,default='N/A')
    release_date = models.DateField(default='2000-01-01')
    developer = models.CharField(max_length=100,default='N/A')
    genre = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.ImageField(upload_to='products/images/', blank=True, null=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=30.00)
    quantity = models.PositiveIntegerField(default=100)

    def __str__(self):
        return self.title