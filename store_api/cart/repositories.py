from .models import CartItem

class CartRepository:
    def get_cart_items(self, user):
        return CartItem.objects.filter(user=user).select_related('product')

    def get_cart_item_by_id(self, item_id, user):
        try:
            return CartItem.objects.get(id=item_id, user=user)
        except CartItem.DoesNotExist:
            return None

    # αν υπάρχει στο cart αυξάνει το quantity else προσθέτει νέο item
    def get_or_create_cart_item(self, user, product, quantity):
        return CartItem.objects.get_or_create(
            user=user,
            product=product,
            defaults={'quantity': quantity}
        )

    def save_cart_item(self, cart_item):
        cart_item.save()

    # deletes whole item
    def delete_cart_item(self, cart_item):
        cart_item.delete()

    # decreaces quantity
    def decrement_cart_item(self, cart_item):
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
            cart_item.save()
            return cart_item
        else:
            cart_item.delete()
            return None

    def clear_cart(self, user):
        CartItem.objects.filter(user=user).delete()
