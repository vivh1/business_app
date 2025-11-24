from django.urls import include, path
from . import views

urlpatterns = [
    path('login/', views.login_api, name='login_api'),
    path('logout/', views.logout_api, name='logout_api'),
    path('register/', views.register_api, name='register_api'),
    path('profile/', views.profile_api, name='profile_api'),
]