from django.db import models

class Product(models.Model):

    GENRE_CHOICES = [
        ('action', 'Action'),
        ('indie', 'Indie'),
        ('rpg', 'RPG'),
        ('strategy', 'Strategy'),
        ('pixel graphics', 'Pixel Graphics'),
        ('horror', 'Horror'),
        ('metroidvania', 'Metroidvania'),
    ]

    title = models.CharField(max_length=150,default='N/A')
    quantity = models.PositiveIntegerField(default=0)
    release_date = models.DateField(default='2000-01-01')
    developer = models.CharField(max_length=100,default='N/A')
    genre = models.CharField(max_length=50, choices=GENRE_CHOICES, default='other')
    image = models.ImageField(upload_to='products/images/', blank=True, null=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title