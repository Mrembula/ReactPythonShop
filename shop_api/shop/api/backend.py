from django.contrib.auth.models import UserManager


class CustomUserManager(UserManager):
    """
    Overrides the default user creation logic to ensure the password is
    hashed correctly for email-based login, even when inheriting from AbstractUser.
    """
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        if password:
            user.set_password(password)

        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        # We can rely on the parent class implementation, but ensure defaults are set
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return super().create_superuser(username, email, password, **extra_fields)
