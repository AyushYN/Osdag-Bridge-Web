const API_BASE = typeof window === 'undefined'
    ? 'http://localhost:8000/api'
    : '/api';

export async function fetchStates(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/locations`);
    if (!res.ok) throw new Error('Failed to fetch states');
    return res.json();
}

export async function fetchCities(state: string): Promise<string[]> {
    const res = await fetch(`${API_BASE}/locations?state=${encodeURIComponent(state)}`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return res.json();
}

export async function fetchLocationData(city: string): Promise<{
    state: string;
    city: string;
    wind_speed: number;
    seismic_zone: string;
    seismic_zone_factor: number;
    max_temp: number;
    min_temp: number;
}> {
    const res = await fetch(`${API_BASE}/location-data?city=${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error('Failed to fetch location data');
    return res.json();
}

export async function fetchMaterials(type: 'girder' | 'bracing' | 'deck'): Promise<string[]> {
    const res = await fetch(`${API_BASE}/materials/${type}`);
    if (!res.ok) throw new Error('Failed to fetch materials');
    return res.json();
}

export async function validateInputs(data: {
    span?: number;
    carriageway_width?: number;
    skew_angle?: number;
}): Promise<{ valid: boolean; errors?: Record<string, string> }> {
    const res = await fetch(`${API_BASE}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function calculateGeometry(data: {
    carriageway_width: number;
    girder_spacing?: number;
    num_girders?: number;
    deck_overhang?: number;
}): Promise<{
    overall_width: number;
    girder_spacing: number;
    num_girders: number;
    deck_overhang: number;
}> {
    const res = await fetch(`${API_BASE}/calculate-geometry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Calculation failed');
    }
    return res.json();
}
