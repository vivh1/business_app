from .models import Order, OrderItem

class OrderRepository:
    # new order record
    def create_order(self, user, total_price, status):
        return Order.objects.create(user=user, total_price=total_price, status=status)

    # item within order
    def create_order_item(self, order, product, quantity, price_at_purchase):
        return OrderItem.objects.create(
            order=order,
            product=product,
            quantity=quantity,
            price_at_purchase=price_at_purchase
        )

    # all orders of user
    # prefetch_related loads items and products in one query instead of many
    def get_orders_by_user(self, user):
        return Order.objects.filter(user=user).prefetch_related('items__product').order_by('-created_at')
