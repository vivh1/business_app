class CartService:
    def __init__(self, cart_repository, order_repository):
        self.cart_repository = cart_repository
        self.order_repository = order_repository

    # όλα τα items στο cart
    def get_cart(self, user):
        return self.cart_repository.get_cart_items(user)

    # προσθέτει νέο item, αν υπάρχει αυξάνει απλά το quantity
    def add_to_cart(self, user, product, quantity):
        cart_item, created = self.cart_repository.get_or_create_cart_item(user, product, quantity)
        if not created:
            cart_item.quantity += quantity
            self.cart_repository.save_cart_item(cart_item)
        return cart_item

    # αυξάνει το quantity
    def update_cart_item(self, item_id, user, quantity):
        cart_item = self.cart_repository.get_cart_item_by_id(item_id, user)
        if not cart_item:
            return None
        cart_item.quantity = quantity
        self.cart_repository.save_cart_item(cart_item)
        return cart_item

    # whole item
    def remove_cart_item(self, item_id, user):
        cart_item = self.cart_repository.get_cart_item_by_id(item_id, user)
        if not cart_item:
            return False
        self.cart_repository.delete_cart_item(cart_item)
        return True
    
    # μειώνει το quantity
    def decrement_cart_item(self, item_id, user):
        cart_item = self.cart_repository.get_cart_item_by_id(item_id, user)
        if not cart_item:
            return False
        self.cart_repository.decrement_cart_item(cart_item)
        return True

    def clear_cart(self, user):
        self.cart_repository.clear_cart(user)

    # 1. Check cart is not empty
    # 2. Calculate total price
    # 3. Create the order
    # 4. Save each cart item as an order item with price locked in
    # 5. Clear the cart
    def checkout(self, user):
        items = self.cart_repository.get_cart_items(user)
        if not items.exists():
            return None
        total = sum(item.product.price * item.quantity for item in items)
        order = self.order_repository.create_order(user, total, 'paid')
        for item in items:
            self.order_repository.create_order_item(order, item.product, item.quantity, item.product.price)
        self.cart_repository.clear_cart(user)
        return order
