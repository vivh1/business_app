import pytest

@pytest.mark.django_db
class TestProducts:
    def test_list_products_authenticated(self, auth_client, product):
        res = auth_client.get("/api/products/")
        assert res.status_code == 200
        assert len(res.json()) >= 1

    def test_list_products_unauthenticated(self, api_client):
        res = api_client.get("/api/products/")
        assert res.status_code == 401


    def test_get_categories(self, auth_client, category):
        res = auth_client.get("/api/categories/")
        assert res.status_code == 200

    def test_add_category(self, auth_client):
        res = auth_client.post("/api/categories/add/", {
            "name": "New"
        }, format="json")
        assert res.status_code == 201

    def test_update_category_not_found(self, auth_client):
        res = auth_client.post("/api/categories/update/", {
            "id": 99999
        }, format="json")
        assert res.status_code == 404

    def test_update_category_missing_id(self, auth_client):
        res = auth_client.post("/api/categories/update/", {}, format="json")
        assert res.status_code == 400

    def test_delete_nonexistent_category(self, auth_client):
        res = auth_client.post("/api/categories/delete/", {
            "name": "Nothing"
        }, format="json")
        assert res.status_code == 400

    def test_delete_category_also_deletes_products(self, auth_client, category, product):
        res = auth_client.post("/api/categories/delete/", {
            "name": category.name
        }, format="json")
        assert res.status_code == 200
        from products.models import Product
        assert not Product.objects.filter(id=product.id).exists()


    def test_delete_product(self, auth_client, product):
        res = auth_client.post("/api/products/delete/", {
            "id": product.id
        }, format="json")
        assert res.status_code == 200
        assert res.json()["success"] is True

    def test_delete_nonexistent_product(self, auth_client):
        res = auth_client.post("/api/products/delete/", {
            "id": 99999
        }, format="json")
        assert res.status_code == 404

    def test_update_product(self, auth_client, product, category):
        res = auth_client.post("/api/products/update/", {
            "id": product.id,
            "title": "Updated Title",
            "genre": category.name,
            "description": "new desc",
            "developer": "new dev",
            "release_date": "2000-01-01",
        }, format="json")
        assert res.status_code == 200
        assert res.json()["title"] == "Updated Title"

    def test_update_product_not_found(self, auth_client):
        res = auth_client.post("/api/products/update/", {
            "id": 99999
        }, format="json")
        assert res.status_code == 404

    def test_update_product_missing_id(self, auth_client):
        res = auth_client.post("/api/products/update/", {}, format="json")
        assert res.status_code == 400

    def test_add_duplicate_product(self, auth_client, product):
        res = auth_client.post("/api/products/add/", {
            "title": "Test Game",  # already exists in confest
            "genre": "Test Category",
            "description": "desc",
            "developer": "tester",
            "release_date": "2023-01-01",
        }, format="json")
        assert res.status_code == 400
        assert res.json()["success"] is False

