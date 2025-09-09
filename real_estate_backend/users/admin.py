from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("email", "username", "role", "is_staff", "is_approved")
    list_filter = ("role", "is_approved", "is_staff")

    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Personal Info", {
            "fields": ("first_name", "last_name", "phone_number", "saved_properties") 
        }),
        ("Permissions", {
            "fields": ("is_staff", "is_superuser", "is_approved", "groups", "user_permissions")
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "role", "is_approved", "saved_properties"),  # ✅ added here too
        }),
    )

    search_fields = ("email", "username")
    ordering = ("email",)


admin.site.register(CustomUser, CustomUserAdmin)
