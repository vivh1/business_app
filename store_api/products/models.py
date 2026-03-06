from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):

    title = models.CharField(max_length=150,default='N/A')
    quantity = models.PositiveIntegerField(default=0)
    release_date = models.DateField(default='2000-01-01')
    developer = models.CharField(max_length=100,default='N/A')
    genre = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.ImageField(upload_to='products/images/', blank=True, null=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title