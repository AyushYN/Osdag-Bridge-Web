'use client';
import React from 'react';
import { Settings2 } from 'lucide-react';
import { FormRow } from '../ui/FormRow';
import { NumberInput } from '../ui/NumberInput';
import { Select } from '../ui/Select';
import { ValidationErrors } from '@/types';

interface GeometricDetailsProps {
    isOther: boolean;
    setIsGeoModalOpen: (open: boolean) => void;
    span: number;
    setSpan: (span: number) => void;
    carriageway: number;
    setCarriageway: (width: number) => void;
    footpath: string;
    setFootpath: (footpath: string) => void;
    skew: number;
    setSkew: (skew: number) => void;
    errors: ValidationErrors;
}

export function GeometricDetails({
    isOther,
    setIsGeoModalOpen,
    span,
    setSpan,
    carriageway,
    setCarriageway,
    footpath,
    setFootpath,
    skew,
    setSkew,
    errors,
}: GeometricDetailsProps) {
    const footpathOpts = ['None', 'Single-sided', 'Both'].map(v => ({ value: v, label: v }));

    return (
        <div className={`pt-2 ${isOther ? 'opacity-40 pointer-events-none' : ''}`}>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Geometry & Alignment</h3>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-600">Span Length (m)</span>
                    <NumberInput value={span} onChange={setSpan} error={!!errors.span} mono />
                    {errors.span && <span className="text-[10px] text-red-500 font-medium">{errors.span}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-600">Carriageway (m)</span>
                    <NumberInput value={carriageway} onChange={setCarriageway} step={0.1} error={!!errors.carriageway} mono />
                    {errors.carriageway && <span className="text-[10px] text-red-500 font-medium">{errors.carriageway}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-600">Footpath</span>
                    <Select value={footpath} onChange={setFootpath} options={footpathOpts} />
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-600">Skew Angle (°)</span>
                    <NumberInput value={skew} onChange={setSkew} error={!!errors.skew} mono />
                    {errors.skew && <span className="text-[10px] text-red-500 font-medium">{errors.skew}</span>}
                </div>
            </div>

            <button
                onClick={() => setIsGeoModalOpen(true)}
                className="w-full py-2.5 text-[11px] font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-900/20"
            >
                <Settings2 size={14} /> Tune Advanced Geometry
            </button>
        </div>
    );
}
