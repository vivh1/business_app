import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken

#BUSINESS LOGIC LAYER
# METHODOI POU XRHSIMOPOIOUNT EPIKOINWNIA STH BASH DEDOMENWN

class tokenService:

    def __init__(self):
        pass

    def give_tokens(self,user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

class userService:
    def __init__(self, user_repository):
        self.user_repository = user_repository

    def get_all_users(self):
        return self.user_repository.get_all_users()

class ServiceResult:
    def __init__(self, success, message):
        self.success = success
        self.message = message

class authenticationService:

    def __init__(self, user_repository):
        self.user_repository = user_repository

    def login(self,username,password):
        user = self.user_repository.get_by_username(username)

        if user and check_password(password,user.password):
            return user

        return None

    def register(self,username,email,password):
        
        if User.objects.filter(username=username).exists():
            return ServiceResult(False, "Username already exists")
        
        if email and User.objects.filter(email=email).exists():
            return ServiceResult(False,"Email already registered")
        
        User.objects.create_user(username=username, email=email, password=password)
        return ServiceResult(True,"Account created successfully")

