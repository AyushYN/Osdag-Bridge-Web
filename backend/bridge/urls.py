from django.urls import path
from .views import (
    LocationListView, 
    LocationDataView,
    InputValidationView,
    GeometryCalculationView,
    MaterialView,
    BridgeLayoutView
)

urlpatterns = [
    path('locations/', LocationListView.as_view(), name='locations'),
    path('location-data/', LocationDataView.as_view(), name='location-data'),
    path('validate/', InputValidationView.as_view(), name='validate'),
    path('calculate-geometry/', GeometryCalculationView.as_view(), name='calculate-geometry'),
    path('materials/<str:material_type>/', MaterialView.as_view(), name='materials'),
    path('designs/', BridgeLayoutView.as_view(), name='designs-list'),
    path('designs/<int:design_id>/', BridgeLayoutView.as_view(), name='designs-detail'),
]
