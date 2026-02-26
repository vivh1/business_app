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

    def get_by_username(self,username):
        return self.user_repository.get_by_username(username)

    def update_user(self,username,new_password,old_password,email,id_in): 
        # TODO: STREAMLINE THE UPDATES (DES ELEGXOUS TOU LOGIN!!)
        user = self.user_repository.get_by_id(id_in)

        updated = False
        
        if not check_password(old_password,user.password):
            return -3

        if new_password:
            user.set_password(new_password)
            updated = True
        
        if email and email != user.email:
            if self.user_repository.exists_by_email(email):
                return -1
            else:
                user.email = email
                updated = True

        if username and username != user.username:
            if self.user_repository.exists_by_username(username):
                return -2
            else:
                user.username = username
                updated = True 
        
        if updated:
            self.user_repository.save(user)

        return 0

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

    def register(self,username_in,email_in,password_in):
        
        if self.user_repository.exists_by_username(username_in):
            return ServiceResult(False, "Username already exists")
        
        if email_in and self.user_repository.exists_by_email(email_in):
            return ServiceResult(False,"Email already registered")
        
        User.objects.create_user(username=username_in, email=email_in, password=password_in)
        return ServiceResult(True,"Account created successfully")

