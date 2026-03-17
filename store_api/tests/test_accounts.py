import pytest

@pytest.mark.django_db
class TestRegister:
    def test_register_success(self, api_client):
        res = api_client.post("/api/register/", {
            "username": "newuser", 
            "password": "newpass", 
            "email": "test@new.com"
        }, format="json")

        assert res.status_code == 200
        assert res.json()["success"] is True


    def test_register_missing_password(self, api_client):
        res = api_client.post("/api/register/", {
            "username": "newuser"
            }, format="json")
        
        assert res.status_code == 400


    def test_register_missing_username(self, api_client):
        res = api_client.post("/api/register/", {
            "password": "newpass"
            }, format="json")
        
        assert res.status_code == 400


    # ίδια στοιχεία με configtest user
    def test_register_duplicate_user(self, api_client, regular_user):
        res = api_client.post("/api/register/", {
            "username": "user", 
            "password": "pass"
        }, format="json")

        assert res.json()["success"] is False


@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, api_client, regular_user):
        res = api_client.post("/api/login/", {
            "username": "user", 
            "password": "pass"
        }, format="json")

        assert res.status_code == 200
        assert "tokens" in res.json()


    def test_login_wrong_password(self, api_client, regular_user):
        res = api_client.post("/api/login/", {
            "username": "user", 
            "password": "wrong"
        }, format="json")

        assert res.status_code == 401


    def test_login_missing_password(self, api_client):
        res = api_client.post("/api/login/", {
            "username": "user"
        }, format="json")

        assert res.status_code == 400


    def test_login_missing_username(self, api_client):
        res = api_client.post("/api/login/", {
            "password": "pass"
        }, format="json")

        assert res.status_code == 400


@pytest.mark.django_db
class TestLogout:
    def test_logout_authenticated(self, auth_client):
        res = auth_client.post("/api/logout/")
        assert res.status_code == 200

    def test_logout_unauthenticated(self, api_client):
        res = api_client.post("/api/logout/")
        assert res.status_code == 401


@pytest.mark.django_db
class TestProfile:
    def test_profile_authenticated(self, auth_client):
        res = auth_client.get("/api/profile/")
        assert res.status_code == 200
        assert "user" in res.json()

    def test_profile_unauthenticated(self, api_client):
        res = api_client.get("/api/profile/")
        assert res.status_code == 401

