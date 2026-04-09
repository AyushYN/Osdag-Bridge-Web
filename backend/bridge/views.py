from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import LocationParameter, BridgeDesign
from .serializers import (
    LocationParameterSerializer, 
    BridgeLayoutSerializer,
    ValidationSerializer,
    GeometryCalculasSerializer
)

class LocationListView(APIView):
    def get(self, request):
        state = request.query_params.get('state')
        
        if state:
            cities = LocationParameter.objects.filter(state=state).values_list('city', flat=True)
            return Response(sorted(set(cities)))
        
        states = LocationParameter.objects.values_list('state', flat=True)
        return Response(sorted(set(states)))

class LocationDataView(APIView):
    def get(self, request):
        city = request.query_params.get('city')
        
        if not city:
            return Response(
                {'error': 'City parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            location = LocationParameter.objects.get(city=city)
            serializer = LocationParameterSerializer(location)
            return Response(serializer.data)
        except LocationParameter.DoesNotExist:
            return Response(
                {'error': 'Location not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class InputValidationView(APIView):
    def post(self, request):
        serializer = ValidationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        errors = {}
        
        if 'span' in data:
            span = data['span']
            if span < 20 or span > 45:
                errors['span'] = 'Outside the software range.'
        
        if 'carriageway_width' in data:
            width = data['carriageway_width']
            if width < 4.25 or width >= 24:
                errors['carriageway_width'] = 'Must be ≥ 4.25 and < 24m'
        
        if 'skew_angle' in data:
            angle = data['skew_angle']
            if angle > 15 or angle < -15:
                errors['skew_angle'] = 'IRC 24 (2010) requires detailed analysis'
        
        if errors:
            return Response({'valid': False, 'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'valid': True, 'message': 'All inputs are valid'})

class GeometryCalculationView(APIView):
    def post(self, request):
        serializer = GeometryCalculasSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        carriageway_width = data['carriageway_width']
        overall_width = carriageway_width + 5
        
        girder_spacing = data.get('girder_spacing')
        num_girders = data.get('num_girders')
        deck_overhang = data.get('deck_overhang')
        
        provided_count = sum([girder_spacing is not None, num_girders is not None, deck_overhang is not None])
        
        if provided_count < 2:
            return Response(
                {'error': 'Provide at least 2 of the 3 parameters'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            if girder_spacing is None:
                girder_spacing = (overall_width - deck_overhang) / num_girders
            elif num_girders is None:
                raw = (overall_width - deck_overhang) / girder_spacing
                if not float(raw).is_integer():
                    return Response(
                        {'error': 'Number of girders must be an integer'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                num_girders = int(raw)
            elif deck_overhang is None:
                deck_overhang = overall_width - (girder_spacing * num_girders)
            
            if girder_spacing >= overall_width or deck_overhang >= overall_width:
                return Response(
                    {'error': 'Girder spacing and deck overhang must be less than overall bridge width'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response({
                'overall_width': overall_width,
                'girder_spacing': round(girder_spacing, 1),
                'num_girders': num_girders,
                'deck_overhang': round(deck_overhang, 1)
            })
        
        except (ZeroDivisionError, ValueError) as e:
            return Response(
                {'error': 'Invalid calculation parameters'},
                status=status.HTTP_400_BAD_REQUEST
            )

class MaterialView(APIView):
    def get(self, request, material_type):
        materials = {
            'girder': ['E250', 'E350', 'E450'],
            'bracing': ['E250', 'E350', 'E450'],
            'deck': ['M25', 'M30', 'M35', 'M40', 'M45', 'M50', 'M55', 'M60']
        }
        
        if material_type not in materials:
            return Response(
                {'error': 'Invalid material type'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(materials[material_type])

class BridgeLayoutView(APIView):
    def post(self, request):
        serializer = BridgeLayoutSerializer(data=request.data)
        if serializer.is_valid():
            design = serializer.save()
            return Response(BridgeLayoutSerializer(design).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, design_id=None):
        if design_id:
            try:
                design = BridgeDesign.objects.get(id=design_id)
                return Response(BridgeLayoutSerializer(design).data)
            except BridgeDesign.DoesNotExist:
                return Response(
                    {'error': 'Design not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        designs = BridgeDesign.objects.all()[:10]
        return Response(BridgeLayoutSerializer(designs, many=True).data)
