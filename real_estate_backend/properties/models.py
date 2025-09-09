from django.db import models
from django.conf import settings

class Property(models.Model):
    PROPERTY_TYPE_CHOICES = [
        ("Room", "Room"),
        ("House", "House"),
        ("Flat", "Flat"),
        ("Portion", "Portion"),
    ]

    dealer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="properties",
        db_column="dealer_id"  # Explicitly name the column
    )
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES)
    floor = models.IntegerField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    address = models.TextField()
    owner_name = models.CharField(max_length=100)
    area = models.CharField(max_length=100)  # e.g., "10 Marla", "2000 sq ft"
    rooms = models.IntegerField()
    furnished = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.property_type.title()} - {self.address} ({self.price})"


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="images"
    )
    image = models.ImageField(upload_to="property_images/")

    def __str__(self):
        return f"Image for {self.property.id}"
