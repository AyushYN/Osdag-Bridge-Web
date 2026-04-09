import csv
import os
from django.core.management.base import BaseCommand
from bridge.models import LocationParameter


class Command(BaseCommand):
    help = 'Seeds the database with location parameters from CSV files'

    def handle(self, *args, **options):
        data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
        
        wind_data = {}
        wind_file = os.path.join(data_dir, 'wind_speed_table.csv')
        with open(wind_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                city = row['City'].strip()
                wind_speed = float(row['Town_Basic_Wind_Speed_mps'])
                wind_data[city.lower()] = {'city': city, 'wind_speed': wind_speed}
        
        self.stdout.write(f"Loaded {len(wind_data)} wind speed entries")
        
        seismic_data = {}
        seismic_file = os.path.join(data_dir, 'seismic_table.csv')
        with open(seismic_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                town = row['Town'].strip()
                seismic_data[town.lower()] = {
                    'town': town,
                    'zone': row['Zone'].strip(),
                    'z_factor': float(row['Z_Factor'])
                }
        
        self.stdout.write(f"Loaded {len(seismic_data)} seismic entries")
        
        LocationParameter.objects.all().delete()
        
        temp_file = os.path.join(data_dir, 'temperature_table.csv')
        created_count = 0
        
        with open(temp_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                state = row['State'].strip()
                station = row['Station'].strip()
                station_lower = station.lower()
                
                max_temp_key = [k for k in row.keys() if 'Max' in k][0]
                min_temp_key = [k for k in row.keys() if 'Min' in k][0]
                
                try:
                    max_temp = float(row[max_temp_key])
                    min_temp = float(row[min_temp_key])
                except ValueError:
                    max_temp = 45.0
                    min_temp = 5.0
                
                wind_speed = 39.0
                for wind_key, wind_info in wind_data.items():
                    if wind_key == station_lower or wind_key in station_lower or station_lower in wind_key:
                        wind_speed = wind_info['wind_speed']
                        break
                
                seismic_zone = 'III'
                seismic_factor = 0.16
                for seismic_key, seismic_info in seismic_data.items():
                    if seismic_key == station_lower or seismic_key in station_lower or station_lower in seismic_key:
                        seismic_zone = seismic_info['zone']
                        seismic_factor = seismic_info['z_factor']
                        break
                
                LocationParameter.objects.create(
                    state=state,
                    city=station,
                    wind_speed=wind_speed,
                    seismic_zone=seismic_zone,
                    seismic_zone_factor=seismic_factor,
                    max_temp=max_temp,
                    min_temp=min_temp
                )
                created_count += 1
        
        self.stdout.write(f"Created {created_count} records from temperature table")
        
        added_from_wind = 0
        for wind_key, wind_info in wind_data.items():
            city_name = wind_info['city']
            if LocationParameter.objects.filter(city__iexact=city_name).exists():
                continue
            
            seismic_zone = 'III'
            seismic_factor = 0.16
            for seismic_key, seismic_info in seismic_data.items():
                if seismic_key == wind_key or seismic_key in wind_key or wind_key in seismic_key:
                    seismic_zone = seismic_info['zone']
                    seismic_factor = seismic_info['z_factor']
                    break
            
            LocationParameter.objects.create(
                state='India',
                city=city_name,
                wind_speed=wind_info['wind_speed'],
                seismic_zone=seismic_zone,
                seismic_zone_factor=seismic_factor,
                max_temp=45.0,
                min_temp=5.0
            )
            added_from_wind += 1
        
        self.stdout.write(f"Added {added_from_wind} additional cities from wind table")
        
        total = LocationParameter.objects.count()
        self.stdout.write(
            self.style.SUCCESS(f'Successfully seeded {total} total location records')
        )
