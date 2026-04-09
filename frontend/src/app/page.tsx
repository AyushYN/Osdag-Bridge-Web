'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  fetchStates,
  fetchCities,
  fetchLocationData,
  calculateGeometry,
} from '@/lib/api';
import type { StructureType, LocationData, GeoParams, CustomParams, ValidationErrors } from '@/types';

import { Select } from '@/components/ui/Select';

import { ProjectLocation } from '@/components/bridge-design/ProjectLocation';
import { GeometricDetails } from '@/components/bridge-design/GeometricDetails';
import { MaterialInputs } from '@/components/bridge-design/MaterialInputs';
import { Visualizer } from '@/components/bridge-design/Visualizer';
import { CustomParamsModal } from '@/components/bridge-design/CustomParamsModal';
import { GeometryModal } from '@/components/bridge-design/GeometryModal';

export default function GroupDesignPage() {
  const [structureType, setStructureType] = useState<StructureType>('Highway');
  const [locMode, setLocMode] = useState<'database' | 'custom'>('database');
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [customParams, setCustomParams] = useState<CustomParams>({
    wind: '', zone: 'III', factor: '', maxTemp: '', minTemp: ''
  });
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [span, setSpan] = useState<number>(30);
  const [carriageway, setCarriageway] = useState<number>(7.5);
  const [footpath, setFootpath] = useState<string>('None');
  const [skew, setSkew] = useState<number>(0);
  const [isGeoModalOpen, setIsGeoModalOpen] = useState(false);
  const [geoParams, setGeoParams] = useState<GeoParams>({ spacing: 2.5, numGirders: 5, overhang: 0 });
  const [girderMat, setGirderMat] = useState('E250');
  const [braceMat, setBraceMat] = useState('E250');
  const [deckMat, setDeckMat] = useState('M25');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const isOther = structureType === 'Other';
  const overallWidth = carriageway + 5.0;

  useEffect(() => {
    fetchStates().then(setStates).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState).then(setCities).catch(console.error);
      setSelectedCity('');
      setLocationData(null);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity && locMode === 'database') {
      fetchLocationData(selectedCity)
        .then(setLocationData)
        .catch(console.error);
    }
  }, [selectedCity, locMode]);

  useEffect(() => {
    const newErrors: ValidationErrors = {};
    if (isOther) newErrors.structure = "Other structures not included.";
    if (!isOther) {
      if (span < 20 || span > 45) newErrors.span = "Outside the software range.";
      if (carriageway < 4.25 || carriageway >= 24) newErrors.carriageway = "Must be ≥4.25 and <24m";
      if (skew > 15 || skew < -15) newErrors.skew = "IRC 24 (2010) requires detailed analysis";
    }
    setErrors(newErrors);
  }, [structureType, span, carriageway, skew, isOther]);

  const handleGeoUpdate = useCallback(async (field: keyof GeoParams, value: string): Promise<string | null> => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;

    const updated = { ...geoParams, [field]: numValue };
    const calcData: { carriageway_width: number; girder_spacing?: number; num_girders?: number; deck_overhang?: number } =
      { carriageway_width: carriageway };

      
    if (field === 'numGirders') {
      calcData.num_girders = updated.numGirders;
      calcData.deck_overhang = updated.overhang;
    } else if (field === 'spacing') {
      calcData.girder_spacing = updated.spacing;
      calcData.num_girders = updated.numGirders;
    } else if (field === 'overhang') {
      calcData.deck_overhang = updated.overhang;
      calcData.girder_spacing = updated.spacing;
    }

    try {
      const result = await calculateGeometry(calcData);
      setGeoParams({
        spacing: result.girder_spacing,
        numGirders: result.num_girders,
        overhang: result.deck_overhang,
      });
      return null;
    } catch (err) {
      let errorMsg: string | null = null;
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      let newP = { ...geoParams, [field]: numValue };
      if (newP.spacing <= 0) newP.spacing = 0.1;
      if (field === 'numGirders' && newP.numGirders > 0) {
        newP.spacing = (overallWidth - newP.overhang) / newP.numGirders;
      } else if ((field === 'spacing' || field === 'overhang') && newP.spacing > 0) {
        newP.numGirders = Math.round((overallWidth - newP.overhang) / newP.spacing);
      }
      setGeoParams(newP);
      return errorMsg;
    }
  }, [geoParams, carriageway, overallWidth]);


  const showLocationResult = (locMode === 'database' && !!locationData) || (locMode === 'custom' && !!customParams.wind);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden">

      {/* === LEFT PANEL - MODERN SLEEK === */}
      <div className="w-[430px] flex flex-col bg-white shrink-0 border-r border-slate-200 z-10 shadow-2xl relative">

        <header className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
                    <Image src="/osdag-logo.png" alt="Osdag" width={24} height={24} className="object-contain" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-800 leading-tight">Osdag | Group Design</h1>
                  <p className="text-[10px] text-blue-600 font-bold tracking-widest uppercase mt-0.5">OPEN STEEL &amp; GRAPHICS</p>
                </div>
            </div>
        </header>

        {/* Floating Segmented Tabs */}
        <div className="px-6 py-4 flex justify-center bg-slate-50/50 border-b border-slate-100">
          <div className="flex bg-slate-200/50 p-1 rounded-lg w-full">
            <button className="flex-1 py-1.5 text-[11px] font-bold bg-white text-slate-800 shadow rounded-md ring-1 ring-slate-900/5">
              Primary Specifications
            </button>
            <button disabled className="flex-1 py-1.5 text-[11px] font-semibold text-slate-400 rounded-md cursor-not-allowed">
              Advanced Settings
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar bg-white flex flex-col gap-8">

          {/* Type of Structure */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Classification</h3>
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-semibold text-slate-600 w-24">Structure Type</span>
                <div className="flex-1">
                    <Select
                      value={structureType}
                      onChange={v => setStructureType(v as StructureType)}
                      options={[{ value: 'Highway', label: 'Highway Bridge' }, { value: 'Other', label: 'Other Classification' }]}
                      error={!!errors.structure}
                    />
                </div>
            </div>
            {errors.structure && <span className="text-xs text-red-500 font-medium block mt-1">{errors.structure}</span>}
          </div>

          <ProjectLocation
            isOther={isOther}
            locMode={locMode}
            setLocMode={setLocMode}
            states={states}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            cities={cities}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            locationData={locationData}
            customParams={customParams}
            setIsCustomModalOpen={setIsCustomModalOpen}
            showLocationResult={showLocationResult}
          />

          <GeometricDetails
            isOther={isOther}
            setIsGeoModalOpen={setIsGeoModalOpen}
            span={span}
            setSpan={setSpan}
            carriageway={carriageway}
            setCarriageway={setCarriageway}
            footpath={footpath}
            setFootpath={setFootpath}
            skew={skew}
            setSkew={setSkew}
            errors={errors}
          />

          <MaterialInputs
            isOther={isOther}
            girderMat={girderMat}
            setGirderMat={setGirderMat}
            braceMat={braceMat}
            setBraceMat={setBraceMat}
            deckMat={deckMat}
            setDeckMat={setDeckMat}
          />

        </div>
      </div>
      
      {/* === RIGHT PANEL === */}
      <Visualizer
        overallWidth={overallWidth}
        carriageway={carriageway}
        geoParams={geoParams}
      />

      <CustomParamsModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        customParams={customParams}
        setCustomParams={setCustomParams}
      />

      <GeometryModal
        isOpen={isGeoModalOpen}
        onClose={() => setIsGeoModalOpen(false)}
        geoParams={geoParams}
        handleGeoUpdate={handleGeoUpdate}
      />
    </div>
  );
}
