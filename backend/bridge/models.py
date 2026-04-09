from django.db import models

class LocationParameter(models.Model):
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    wind_speed = models.FloatField()
    seismic_zone = models.CharField(max_length=10)
    seismic_zone_factor = models.FloatField()
    max_temp = models.FloatField()
    min_temp = models.FloatField()

    class Meta:
        db_table = 'location_parameters'
        unique_together = ['state', 'city']
        ordering = ['state', 'city']

    def __str__(self):
        return f"{self.city}, {self.state}"

class BridgeDesign(models.Model):
    STRUCTURE_TYPES = [('highway', 'Highway'), ('other', 'Other')]
    FOOTPATH_TYPES = [('single', 'Single-sided'), ('both', 'Both'), ('none', 'None')]
    
    structure_type = models.CharField(max_length=20, choices=STRUCTURE_TYPES)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    custom_wind_speed = models.FloatField(blank=True, null=True)
    custom_seismic_factor = models.FloatField(blank=True, null=True)
    custom_max_temp = models.FloatField(blank=True, null=True)
    custom_min_temp = models.FloatField(blank=True, null=True)
    span = models.FloatField()
    carriageway_width = models.FloatField()
    footpath = models.CharField(max_length=20, choices=FOOTPATH_TYPES)
    skew_angle = models.FloatField()
    girder_material = models.CharField(max_length=10)
    bracing_material = models.CharField(max_length=10)
    deck_material = models.CharField(max_length=10)
    girder_spacing = models.FloatField(blank=True, null=True)
    num_girders = models.IntegerField(blank=True, null=True)
    deck_overhang = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bridge_designs'
        ordering = ['-created_at']

    def __str__(self):
        return f"Design {self.id} - {self.structure_type}"
