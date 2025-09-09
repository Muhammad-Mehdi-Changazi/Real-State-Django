# users/models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from properties.models import Property

class CustomUserManager(BaseUserManager):
    def normalize_email(self, email):
        return email.lower() if email else ""

    def create_user(self, email, username, password=None, role="buyer", **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        email = self.normalize_email(email)

        # ✅ auto-approve buyer and admin
        is_approved = True if role in ["buyer", "admin"] else False

        # prevent duplicate key issue
        extra_fields.pop("is_approved", None)

        user = self.model(
            email=email,
            username=username,
            role=role,
            is_approved=is_approved,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_approved", True)  # superuser always approved

        return self.create_user(
            email,
            username,
            password,
            role="admin",
            **extra_fields
        )


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("buyer", "Buyer"),
        ("agent", "Agent"),
        ("admin", "Admin"),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)

    # ✅ New field for saved properties
    saved_properties = models.ManyToManyField(
        Property,
        blank=True,
        related_name="saved_by_users"
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} ({self.role})"