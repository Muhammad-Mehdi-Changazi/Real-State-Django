from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, ToggleSavedPropertyView, MeView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('saved-properties/toggle/', ToggleSavedPropertyView.as_view(), name='toggle_saved_property'),
    path("me/", MeView.as_view(), name="me"),
]
