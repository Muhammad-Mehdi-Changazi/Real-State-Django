from rest_framework import generics, permissions, status
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, ToggleSavedPropertySerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from properties.models import Property
from rest_framework.response import Response
from rest_framework.views import APIView

# Registration view
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# Custom login view
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]



class ToggleSavedPropertyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ToggleSavedPropertySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        property_id = serializer.validated_data['property_id']
        user = request.user

        try:
            property_obj = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response({"detail": "Property not found."}, status=status.HTTP_404_NOT_FOUND)

        if property_obj in user.saved_properties.all():
            # remove if already saved
            user.saved_properties.remove(property_obj)
            action = "removed"
        else:
            # add if not saved
            user.saved_properties.add(property_obj)
            action = "added"

        return Response({
            "message": f"Property {action} successfully.",
            "saved_properties": list(user.saved_properties.values_list("id", flat=True))
        })
        
        
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = RegisterSerializer(request.user)
        return Response(serializer.data)