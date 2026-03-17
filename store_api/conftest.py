import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from products.models import Category, Product


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def regular_user(db):
    return User.objects.create_user(
        username="user", 
        password="pass", 
        email="test@user.com"
    )


@pytest.fixture
def admin_user(db):
    return User.objects.create_superuser(
        username="admin", 
        password="pass", 
        email="test@admin.com"
    )


def get_token(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


@pytest.fixture
def auth_client(api_client, regular_user):
    token = get_token(regular_user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    token = get_token(admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return api_client


@pytest.fixture
def category(db):
    return Category.objects.create(name="Test Category")


@pytest.fixture
def product(db, category):
    return Product.objects.create(
        title="Test Game",
        release_date="2026-01-01",
        developer="Tester",
        genre=category,
        price=19.67,
        description="Testing game creation.",
    )

@pytest.fixture
def second_product(db, category):
    return Product.objects.create(
        title="Second Game",
        quantity=5,
        release_date="2026-06-01",
        developer="Tester",
        genre=category,
        price=19.69,
        description="Testing game creation again.",
    )