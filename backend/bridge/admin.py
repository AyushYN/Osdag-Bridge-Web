from django.contrib import admin
from .models import LocationParameter, BridgeDesign

@admin.register(LocationParameter)
class LocationParameterAdmin(admin.ModelAdmin):
    list_display = ['city', 'state', 'wind_speed', 'seismic_zone', 'seismic_zone_factor', 'max_temp', 'min_temp']
    list_filter = ['state', 'seismic_zone']
    search_fields = ['city', 'state']

@admin.register(BridgeDesign)
class BridgeDesignAdmin(admin.ModelAdmin):
    list_display = ['id', 'structure_type', 'city', 'span', 'carriageway_width', 'created_at']
    list_filter = ['structure_type', 'footpath', 'created_at']
    search_fields = ['city', 'state']
    readonly_fields = ['created_at', 'updated_at']
