from rest_framework import serializers
from .models import CustomUser
from properties.models import Property  # import Property
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    saved_properties = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True  # new users cannot set this on registration
    )

    class Meta:
        model = CustomUser
        fields = [
            'first_name',
            'last_name',
            'username',
            'email',
            'role',
            'phone_number',
            'password',
            'saved_properties',  # include in output
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.get('role', 'buyer')
        is_approved = True if role == 'buyer' else False

        user = CustomUser(**validated_data)
        user.is_approved = is_approved
        user.set_password(password)
        user.save()
        return user


# Custom JWT serializer to return user info
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Restrict login if user is not approved
        if not self.user.is_approved:
            raise serializers.ValidationError("Account not approved by admin yet.")
        data['user'] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "role": self.user.role,
            "phone_number": self.user.phone_number,
            "saved_properties": list(self.user.saved_properties.values_list("id", flat=True))
            
        }
        return data

class ToggleSavedPropertySerializer(serializers.Serializer):
    property_id = serializers.IntegerField()

    def validate_property_id(self, value):
        if not Property.objects.filter(id=value).exists():
            raise serializers.ValidationError("Property does not exist.")
        return value