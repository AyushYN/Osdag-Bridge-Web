from rest_framework import serializers
from .models import LocationParameter, BridgeDesign

class LocationParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationParameter
        fields = ['state', 'city', 'wind_speed', 'seismic_zone', 'seismic_zone_factor', 'max_temp', 'min_temp']

class BridgeLayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = BridgeDesign
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class ValidationSerializer(serializers.Serializer):
    span = serializers.FloatField(required=False)
    carriageway_width = serializers.FloatField(required=False)
    skew_angle = serializers.FloatField(required=False)

class GeometryCalculasSerializer(serializers.Serializer):
    carriageway_width = serializers.FloatField(required=True)
    girder_spacing = serializers.FloatField(required=False, allow_null=True)
    num_girders = serializers.IntegerField(required=False, allow_null=True)
    deck_overhang = serializers.FloatField(required=False, allow_null=True)
