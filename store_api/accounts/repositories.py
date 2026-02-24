from django.contrib.auth.models import User

# DATA ACCESS LAYER
# SETTERS KAI GETTERS KAI O,TI EINAI NA PAREI APO BASH DEDOMENWN

class userRepository:
    def __init__(self, user_in=None):
        self.user = user_in or User

    def get_by_username(self, username_in):
        try:
            return self.user.objects.get(username=username_in)
        except self.user.DoesNotExist:
            return None

    def exists_by_email(self, email):
        return self.user.objects.filter(email=email).exists()

    def get_all_users(self):
        return User.objects.all()