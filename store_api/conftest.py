import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from products.models import Category, Product
from accounts.models import Profile


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def regular_user(db):
    user = User.objects.create_user(
        username="user", 
        password="pass", 
        email="test@user.com"
    )
    Profile.objects.create(user=user)
    return user


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
def auth_client(regular_user):
    client = APIClient()
    token = get_token(regular_user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client


@pytest.fixture
def admin_client(admin_user):
    client = APIClient()
    token = get_token(admin_user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client


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
        release_date="2026-06-01",
        developer="Tester",
        genre=category,
        price=19.69,
        description="Testing game creation again.",
    )