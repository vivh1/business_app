import pytest
from orders.models import Order

@pytest.mark.django_db
class TestOrders:
    def test_get_orders_authenticated(self, auth_client):
        res = auth_client.get("/api/orders/") 
        assert res.status_code == 200

    def test_get_orders_unauthenticated(self, api_client):
        res = api_client.get("/api/orders/")
        assert res.status_code == 401

    def test_create_order(self, auth_client, product):
        res = auth_client.post("/api/orders/create/", {
            "items": [{"product": product.id, 
                       "quantity": 1, 
                       "price_at_purchase": str(product.price)}],
            "total_price": str(product.price)
        }, format="json")
        assert res.status_code == 201
    
    def test_create_order_multiple_items(self, auth_client, product, second_product):
        total = str(product.price + second_product.price * 2)
        res = auth_client.post("/api/orders/create/", {
            "items": [
                {"product": product.id, "quantity": 1, "price_at_purchase": str(product.price)},
                {"product": second_product.id, "quantity": 2, "price_at_purchase": str(second_product.price)},
            ],
            "total_price": total
        }, format="json")
        assert res.status_code == 201

    def test_create_order_no_items(self, auth_client):
        res = auth_client.post("/api/orders/create/", {
            "items": [], "total_price": 0
        }, format="json")
        assert res.status_code == 400

    def test_get_all_orders_admin_only(self, auth_client, admin_client):
        res_user = auth_client.get("/api/orders/all/")
        assert res_user.status_code == 403

        res_admin = admin_client.get("/api/orders/all/")
        assert res_admin.status_code == 200