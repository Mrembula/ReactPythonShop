from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend


class EmailBackend(ModelBackend):
    print("Check if code works!!")
    def authenticate(self, request, email=None, password=None, **kwargs):
        print("Backend password & email:",email, password)
        user_model = get_user_model()
        print("UserModel:",user_model)
        if email is None or password is None:
            return None
        try:
            user = user_model.objects.get(email=email)
        except user_model.DoesNotExist:
            return None
        print(user.check_password(password),  self.user_can_authenticate(user))
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
