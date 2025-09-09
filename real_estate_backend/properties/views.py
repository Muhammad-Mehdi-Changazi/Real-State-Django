from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from .models import Property, PropertyImage
from .serializers import PropertySerializer, PropertyImageSerializer


class PropertyViewSet(viewsets.ModelViewSet):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # If user is a buyer, return all properties
        if user.role == "buyer":
            saved_properties = self.request.query_params.getlist("saved_properties")

            if saved_properties:  
                # If saved_properties param is provided -> filter only those
                return Property.objects.filter(id__in=saved_properties)

            return Property.objects.all()
        # Otherwise, return only properties created by this agent
        return Property.objects.filter(dealer=user)

    def perform_create(self, serializer):
        # Auto-assign logged-in user as dealer (ignores dealer_id in request)
        serializer.save(dealer=self.request.user)

    def update(self, request, *args, **kwargs):
        property_instance = self.get_object()
        if property_instance.dealer != request.user:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        property_instance = self.get_object()
        if property_instance.dealer != request.user:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class PropertyImageViewSet(viewsets.ModelViewSet):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        property_id = self.request.data.get('property')
        property_instance = Property.objects.get(id=property_id)

        # Check that the logged-in dealer owns this property
        if property_instance.dealer != self.request.user:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        serializer.save(property=property_instance)
