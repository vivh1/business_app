class OrderService:
    def __init__(self, order_repository):
        self.order_repository = order_repository

    def get_orders(self, user):
        return self.order_repository.get_orders_by_user(user)
