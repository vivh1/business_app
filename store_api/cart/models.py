from django.db import models
from django.contrib.auth.models import User
from products.models import Product

#κάθε item στο cart του user
class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    # πλήθος για κάθε item
    quantity = models.PositiveIntegerField(default=1)
    # πότε προστέθηκε
    added_at = models.DateTimeField(auto_now_add=True)

    #για να μην υπαρχουν duplicates απο το ίδιο item στο cart
    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
            return f"{self.user.username} - {self.product.title} x{self.quantity}"
