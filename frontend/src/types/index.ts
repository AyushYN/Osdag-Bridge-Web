// Type definitions for Osdag Group Design module

export type StructureType = 'Highway' | 'Other';

export interface LocationData {
    state: string;
    city: string;
    wind_speed: number;
    seismic_zone: string;
    seismic_zone_factor: number;
    max_temp: number;
    min_temp: number;
}

export interface GeoParams {
    spacing: number;
    numGirders: number;
    overhang: number;
}

export interface CustomParams {
    wind: string;
    zone: string;
    factor: string;
    maxTemp: string;
    minTemp: string;
}

export interface GeometryCalculation {
    overall_width: number;
    girder_spacing: number;
    num_girders: number;
    deck_overhang: number;
}

export interface ValidationErrors {
    [key: string]: string;
}
