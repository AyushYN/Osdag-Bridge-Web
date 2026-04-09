from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import LocationParameter


class LocationAPITests(TestCase):
    """Tests for the location lookup endpoints (State → District → parameters)."""

    def setUp(self):
        self.client = APIClient()
        LocationParameter.objects.create(
            state='Maharashtra', city='Mumbai',
            wind_speed=44.0, seismic_zone='III',
            seismic_zone_factor=0.16, max_temp=40.6, min_temp=16.7,
        )
        LocationParameter.objects.create(
            state='Maharashtra', city='Pune',
            wind_speed=39.0, seismic_zone='III',
            seismic_zone_factor=0.16, max_temp=41.0, min_temp=7.0,
        )
        LocationParameter.objects.create(
            state='Karnataka', city='Bangalore',
            wind_speed=33.0, seismic_zone='II',
            seismic_zone_factor=0.10, max_temp=38.3, min_temp=14.0,
        )

    def test_list_states(self):
        """GET /api/locations/ should return a sorted list of unique states."""
        response = self.client.get('/api/locations/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, ['Karnataka', 'Maharashtra'])

    def test_list_cities_for_state(self):
        """GET /api/locations/?state=Maharashtra should list cities in that state."""
        response = self.client.get('/api/locations/', {'state': 'Maharashtra'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Mumbai', response.data)
        self.assertIn('Pune', response.data)

    def test_get_location_data(self):
        """GET /api/location-data/?city=Mumbai should return environmental parameters."""
        response = self.client.get('/api/location-data/', {'city': 'Mumbai'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['wind_speed'], 44.0)
        self.assertEqual(response.data['seismic_zone'], 'III')

    def test_location_data_missing_city(self):
        """GET /api/location-data/ without city param should return 400."""
        response = self.client.get('/api/location-data/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_location_data_not_found(self):
        """GET /api/location-data/?city=Unknown should return 404."""
        response = self.client.get('/api/location-data/', {'city': 'Unknown'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ValidationAPITests(TestCase):
    """Tests for the geometric input validation endpoint."""

    def setUp(self):
        self.client = APIClient()

    def test_valid_inputs(self):
        """POST /api/validate/ with valid data should return valid=True."""
        response = self.client.post('/api/validate/', {
            'span': 30, 'carriageway_width': 7.5, 'skew_angle': 10
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['valid'])

    def test_span_out_of_range(self):
        """Span < 20 or > 45 should fail validation."""
        response = self.client.post('/api/validate/', {'span': 10}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['valid'])
        self.assertIn('span', response.data['errors'])

    def test_carriageway_too_narrow(self):
        """Carriageway width < 4.25 should fail validation."""
        response = self.client.post('/api/validate/', {'carriageway_width': 3.0}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['valid'])

    def test_skew_angle_exceeded(self):
        """Skew angle outside ±15° should fail validation."""
        response = self.client.post('/api/validate/', {'skew_angle': 20}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('skew_angle', response.data['errors'])


class GeometryCalculatorAPITests(TestCase):
    """Tests for the girder geometry auto-calculation endpoint."""

    def setUp(self):
        self.client = APIClient()

    def test_calculate_with_spacing_and_overhang(self):
        """Given spacing and overhang, should compute num_girders."""
        response = self.client.post('/api/calculate-geometry/', {
            'carriageway_width': 7.5,
            'girder_spacing': 2.5,
            'deck_overhang': 0.0,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['num_girders'], 5)
        self.assertEqual(response.data['overall_width'], 12.5)

    def test_calculate_with_girders_and_overhang(self):
        """Given num_girders and overhang, should compute spacing."""
        response = self.client.post('/api/calculate-geometry/', {
            'carriageway_width': 7.5,
            'num_girders': 5,
            'deck_overhang': 0.0,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['girder_spacing'], 2.5)

    def test_insufficient_params(self):
        """Providing fewer than 2 geometry params should return 400."""
        response = self.client.post('/api/calculate-geometry/', {
            'carriageway_width': 7.5,
            'girder_spacing': 2.5,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_spacing_exceeds_width(self):
        """Spacing >= overall width should be rejected."""
        response = self.client.post('/api/calculate-geometry/', {
            'carriageway_width': 7.5,
            'girder_spacing': 15.0,
            'deck_overhang': 0.0,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class MaterialsAPITests(TestCase):
    """Tests for the materials listing endpoint."""

    def setUp(self):
        self.client = APIClient()

    def test_girder_materials(self):
        """GET /api/materials/girder/ should return steel grades."""
        response = self.client.get('/api/materials/girder/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, ['E250', 'E350', 'E450'])

    def test_deck_materials(self):
        """GET /api/materials/deck/ should return concrete grades up to M60."""
        response = self.client.get('/api/materials/deck/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('M25', response.data)
        self.assertIn('M60', response.data)

    def test_invalid_material_type(self):
        """GET /api/materials/invalid/ should return 400."""
        response = self.client.get('/api/materials/invalid/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
