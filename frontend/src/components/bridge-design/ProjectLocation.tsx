'use client';
import React from 'react';
import { Select } from '../ui/Select';
import { LocationData, CustomParams } from '@/types';

interface ProjectLocationProps {
    isOther: boolean;
    locMode: 'database' | 'custom';
    setLocMode: (mode: 'database' | 'custom') => void;
    states: string[];
    selectedState: string;
    setSelectedState: (state: string) => void;
    cities: string[];
    selectedCity: string;
    setSelectedCity: (city: string) => void;
    locationData: LocationData | null;
    customParams: CustomParams;
    setIsCustomModalOpen: (open: boolean) => void;
    showLocationResult: boolean;
}

export function ProjectLocation({
    isOther,
    locMode,
    setLocMode,
    states,
    selectedState,
    setSelectedState,
    cities,
    selectedCity,
    setSelectedCity,
    locationData,
    customParams,
    setIsCustomModalOpen,
    showLocationResult,
}: ProjectLocationProps) {
    return (
        <div className={`pt-2 transition-opacity ${isOther ? 'opacity-40 pointer-events-none' : ''}`}>
            {/* Header & Segments */}
            <div className="flex flex-col gap-3 mb-5">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-gray-100 pb-2">Geographical Parameters</h3>
                
                <div className="flex bg-slate-100/80 p-1 rounded-lg w-full">
                    <button 
                        onClick={() => setLocMode('database')} 
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${locMode === 'database' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Enter Location Name
                    </button>
                    <button 
                        onClick={() => setLocMode('custom')} 
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${locMode === 'custom' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Tabulate Custom Loading Parameters
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {locMode === 'database' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-semibold text-slate-600">State</span>
                            <Select value={selectedState} onChange={setSelectedState} options={states.map(s => ({ value: s, label: s }))} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-semibold text-slate-600">District</span>
                            <Select value={selectedCity} onChange={setSelectedCity} options={cities.map(c => ({ value: c, label: c }))} disabled={!selectedState} />
                        </div>
                    </div>
                )}

                {locMode === 'custom' && (
                    <button
                        onClick={() => setIsCustomModalOpen(true)}
                        className="w-full py-3 bg-white border border-dashed border-blue-300 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-50 transition-all shadow-sm"
                    >
                        Configure Custom Parameters
                    </button>
                )}

                {showLocationResult && (
                    <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-4 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-lg"></div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Wind Speed</span>
                                <span className="text-base font-bold text-emerald-600">
                                    {locMode === 'database' ? locationData?.wind_speed : customParams.wind}
                                    <span className="text-[10px] font-medium text-emerald-600/70 ml-0.5">m/s</span>
                                </span>
                            </div>
                            <div className="border-x border-slate-200 bg-slate-50">
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Seismic Zone</span>
                                <span className="text-base font-bold text-emerald-600">
                                    {locMode === 'database' ? locationData?.seismic_zone : customParams.zone}
                                    <span className="text-[10px] font-medium text-emerald-600/70 ml-1">
                                        (Z={locMode === 'database' ? locationData?.seismic_zone_factor : customParams.factor})
                                    </span>
                                </span>
                            </div>
                            <div>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Air Temp</span>
                                <span className="text-base font-bold text-emerald-600">
                                    {locMode === 'database' ? `${locationData?.min_temp} / ${locationData?.max_temp}` : `${customParams.minTemp} / ${customParams.maxTemp}`}
                                    <span className="text-[10px] font-medium text-slate-500 ml-0.5">°C</span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
