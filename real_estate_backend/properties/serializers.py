from rest_framework import serializers
from .models import Property, PropertyImage
from django.contrib.auth import get_user_model

User = get_user_model()


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)

    # Expose dealer_id as read+write
    dealer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='dealer',
        write_only=False  # allows read + write
    )

    dealer_username = serializers.CharField(source="dealer.username", read_only=True)
    dealer_email = serializers.EmailField(source="dealer.email", read_only=True)

    class Meta:
        model = Property
        fields = [
            'id',
            'dealer_id',        # Dealer ID (read/write)
            'dealer_username',  # Dealer username (read-only)
            'dealer_email',     # Dealer email (read-only)
            'property_type',
            'floor',
            'price',
            'address',
            'owner_name',
            'area',
            'rooms',
            'furnished',
            'images',
            'created_at',
            'updated_at',
        ]
