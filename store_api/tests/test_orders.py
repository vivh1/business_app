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

    def test_create_order_full_flow(self, auth_client, regular_user, product):
        # add item to cart
        auth_client.post("/api/cart/add/", {
            "product_id": product.id, "quantity": 1
        }, format="json")

        # checkout (clears cart and creates order)
        checkout_res = auth_client.post("/api/cart/checkout/")
        assert checkout_res.status_code == 200
        assert checkout_res.json()["success"] is True

        # verify order appears in user's orders
        orders_res = auth_client.get("/api/orders/")
        assert len(orders_res.json()) == 1
        assert float(orders_res.json()[0]["total_price"]) == float(product.price)

        # verify cart is now empty
        cart_res = auth_client.get("/api/cart/")
        assert cart_res.json() == []