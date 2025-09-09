from django.contrib import admin
from .models import Property, PropertyImage


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1  # Number of empty image forms to show
    max_num = 20  # Limit to 20 images per property


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Property._meta.get_fields() if not field.is_relation] + ['dealer_id_display', 'dealer_username']
    list_filter = ('property_type', 'furnished', 'created_at')
    search_fields = ('address', 'dealer__username', 'dealer__email', 'owner_name')
    inlines = [PropertyImageInline]

    def dealer_id_display(self, obj):
        return obj.dealer.id
    dealer_id_display.short_description = "Dealer ID"

    def dealer_username(self, obj):
        return obj.dealer.username
    dealer_username.short_description = "Dealer Username"


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'property', 'image')
