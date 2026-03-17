import pytest
from cart.models import CartItem


@pytest.mark.django_db
class TestGetCart:
    def test_get_cart_empty(self, auth_client):
        res = auth_client.get("/api/cart/")
        assert res.status_code == 200
        assert res.json() == []

    def test_get_cart_with_items(self, auth_client, regular_user, product):
        CartItem.objects.create(user=regular_user, product=product, quantity=2)
        res = auth_client.get("/api/cart/")
        assert res.status_code == 200
        assert len(res.json()) == 1
        assert res.json()[0]["product_title"] == "Test Game"

    def test_get_cart_unauthenticated(self, api_client):
        res = api_client.get("/api/cart/")
        assert res.status_code == 401

    def test_cart_persists_after_logout_and_login(self, auth_client, regular_user, product):
        # add item to cart
        auth_client.post("/api/cart/add/", {
            "product_id": product.id, "quantity": 2
        }, format="json")

        # logout
        auth_client.post("/api/logout/")

        # login again with fresh token
        login_res = auth_client.post("/api/login/", {
            "username": "user", "password": "pass"
        }, format="json")
        new_token = login_res.json()["tokens"]["access"]
        auth_client.credentials(HTTP_AUTHORIZATION=f"Bearer {new_token}")

        # cart should still have the item
        res = auth_client.get("/api/cart/")
        assert res.status_code == 200
        assert len(res.json()) == 1
        assert res.json()[0]["quantity"] == 2


@pytest.mark.django_db
class TestAddToCart:
    def test_add_item_to_cart(self, auth_client, product):
        res = auth_client.post("/api/cart/add/", {
            "product_id": product.id, 
            "quantity": 1
        }, format="json")
        assert res.status_code == 200
        assert res.json()["success"] is True
        assert res.json()["item"]["product_title"] == "Test Game"

    def test_add_item_with_quantity_2(self, auth_client, product):
        res = auth_client.post("/api/cart/add/", {
            "product_id": product.id,
            "quantity": 2
        }, format="json")
        assert res.status_code == 200
        assert res.json()["item"]["quantity"] == 2

    def test_add_same_item_increases_quantity(self, auth_client, regular_user, product):
        CartItem.objects.create(user=regular_user, product=product, quantity=1)
        res = auth_client.post("/api/cart/add/", {
            "product_id": product.id, 
            "quantity": 2
        }, format="json")
        assert res.status_code == 200
        assert res.json()["item"]["quantity"] == 3

    def test_add_item_missing_product_id(self, auth_client):
        res = auth_client.post("/api/cart/add/", {
            "quantity": 1
        }, format="json")
        assert res.status_code == 400
        assert res.json()["success"] is False

    def test_add_nonexistent_product(self, auth_client):
        res = auth_client.post("/api/cart/add/", {
            "product_id": 99999, 
            "quantity": 1
        }, format="json")
        assert res.status_code == 404

    def test_add_to_cart_unauthenticated(self, api_client, product):
        res = api_client.post("/api/cart/add/", {
            "product_id": product.id, 
            "quantity": 1
        }, format="json")
        assert res.status_code == 401


@pytest.mark.django_db
class TestUpdateCartItem:
    def test_update_cart_item_quantity(self, auth_client, regular_user, product):
        item = CartItem.objects.create(user=regular_user, product=product, quantity=1)
        res = auth_client.patch(f"/api/cart/update/{item.id}/", {
            "quantity": 5
        }, format="json")
        assert res.status_code == 200
        assert res.json()["item"]["quantity"] == 5

    def test_update_nonexistent_item(self, auth_client):
        res = auth_client.patch("/api/cart/update/99999/", {
            "quantity": 2
        }, format="json")
        assert res.status_code == 404

    def test_update_with_invalid_quantity(self, auth_client, regular_user, product):
        item = CartItem.objects.create(user=regular_user, product=product, quantity=1)
        res = auth_client.patch(f"/api/cart/update/{item.id}/", {
            "quantity": 0
        }, format="json")
        assert res.status_code == 400


@pytest.mark.django_db
class TestRemoveCartItem:
    def test_remove_cart_item(self, auth_client, regular_user, product):
        item = CartItem.objects.create(user=regular_user, product=product, quantity=2)
        res = auth_client.delete(f"/api/cart/remove/{item.id}/")
        assert res.status_code == 200
        assert res.json()["success"] is True

    def test_remove_nonexistent_item(self, auth_client):
        res = auth_client.delete("/api/cart/remove/99999/")
        assert res.status_code == 404

    def test_remove_unauthenticated(self, api_client, regular_user, product):
        item = CartItem.objects.create(user=regular_user, product=product, quantity=1)
        res = api_client.delete(f"/api/cart/remove/{item.id}/")
        assert res.status_code == 401


@pytest.mark.django_db
class TestDecrementCartItem:
    def test_decrement_reduces_quantity(self, auth_client, regular_user, product):
        item = CartItem.objects.create(user=regular_user, product=product, quantity=3)
        res = auth_client.delete(f"/api/cart/remove/{item.id}/decrement/")
        assert res.status_code == 200
        item.refresh_from_db()
        assert item.quantity == 2

    def test_decrement_at_one_deletes_item(self, auth_client, regular_user, product):
        item = CartItem.objects.create(user=regular_user, product=product, quantity=1)
        res = auth_client.delete(f"/api/cart/remove/{item.id}/decrement/")
        assert res.status_code == 200
        assert not CartItem.objects.filter(id=item.id).exists()

    def test_decrement_nonexistent_item(self, auth_client):
        res = auth_client.delete("/api/cart/remove/99999/decrement/")
        assert res.status_code == 404


@pytest.mark.django_db
class TestClearCart:
    def test_clear_cart(self, auth_client, regular_user, product, second_product):
        CartItem.objects.create(user=regular_user, product=product, quantity=1)
        CartItem.objects.create(user=regular_user, product=second_product, quantity=2)
        res = auth_client.delete("/api/cart/clear/")
        assert res.status_code == 200
        assert res.json()["success"] is True
        assert CartItem.objects.filter(user=regular_user).count() == 0

    def test_clear_cart_unauthenticated(self, api_client):
        res = api_client.delete("/api/cart/clear/")
        assert res.status_code == 401


@pytest.mark.django_db
class TestCheckout:
    def test_checkout_success(self, auth_client, regular_user, product):
        CartItem.objects.create(user=regular_user, product=product, quantity=2)
        res = auth_client.post("/api/cart/checkout/")
        assert res.status_code == 200
        assert res.json()["success"] is True
        assert "order" in res.json()
        # Cart should be cleared after checkout
        assert CartItem.objects.filter(user=regular_user).count() == 0

    def test_checkout_empty_cart(self, auth_client):
        res = auth_client.post("/api/cart/checkout/")
        assert res.status_code == 400
        assert res.json()["success"] is False

    def test_checkout_unauthenticated(self, api_client):
        res = api_client.post("/api/cart/checkout/")
        assert res.status_code == 401