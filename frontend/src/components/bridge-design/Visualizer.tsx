'use client';
import React from 'react';
import Image from 'next/image';
import { Layers } from 'lucide-react';
import { GeoParams } from '@/types';

interface VisualizerProps {
    overallWidth: number;
    carriageway: number;
    geoParams: GeoParams;
}

export function Visualizer({
    overallWidth,
    carriageway,
    geoParams,
}: VisualizerProps) {
    return (
        <div className="flex-1 bg-gradient-to-br from-[#1e293b] to-[#0f172a] relative flex flex-col items-center justify-center p-8 overflow-hidden border-l border-slate-800">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Modern Clean Tag */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-slate-800/80 backdrop-blur px-4 py-2.5 rounded-full border border-slate-700 shadow-xl">
                <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-full">
                    <Layers size={14} />
                </div>
                <span className="text-slate-300 text-[11px] font-bold uppercase tracking-widest leading-none">
                    Structural Profile <span className="text-slate-500 font-medium ml-2">Front Elevation</span>
                </span>
            </div>

            {/* XYZ Axis Indicator */}
            <div className="absolute bottom-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-slate-800/50 rounded-lg backdrop-blur border border-slate-700">
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                    {/* X axis - Red */}
                    <line x1="18" y1="18" x2="32" y2="18" stroke="#ef4444" strokeWidth="2" />
                    <polygon points="32,18 28,15 28,21" fill="#ef4444" />
                    <text x="34" y="22" fill="#ef4444" fontSize="9" fontWeight="bold">X</text>
                    
                    {/* Y axis - Green */}
                    <line x1="18" y1="18" x2="6" y2="28" stroke="#22c55e" strokeWidth="2" />
                    <polygon points="6,28 7,23 11,26" fill="#22c55e" />
                    <text x="2" y="32" fill="#22c55e" fontSize="9" fontWeight="bold">Y</text>
                    
                    {/* Z axis - Blue */}
                    <line x1="18" y1="18" x2="18" y2="4" stroke="#3b82f6" strokeWidth="2" />
                    <polygon points="18,4 15,8 21,8" fill="#3b82f6" />
                    <text x="20" y="8" fill="#3b82f6" fontSize="9" fontWeight="bold">Z</text>
                </svg>
            </div>

            {/* Image Container with Glow */}
            <div className="relative z-10 w-full max-w-4xl bg-white rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.05)] overflow-hidden border border-slate-400/20 group">
                <Image
                    src="/bridge-section.png"
                    alt="Bridge Cross Section"
                    width={1200}
                    height={600}
                    className="w-full h-auto object-contain p-2"
                    priority
                />
            </div>
            
            {/* Soft parameters readout at bottom */}
            <div className="absolute bottom-6 left-6 z-20 flex gap-4">
                <div className="bg-slate-800/80 backdrop-blur px-4 py-2 border border-slate-700 rounded-lg flex flex-col shadow-lg">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Overall Width</span>
                    <span className="text-sm font-mono text-slate-200">{overallWidth.toFixed(2)}<span className="text-xs text-slate-500 ml-0.5">m</span></span>
                </div>
                <div className="bg-slate-800/80 backdrop-blur px-4 py-2 border border-slate-700 rounded-lg flex flex-col shadow-lg">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Girder Layout</span>
                    <span className="text-sm font-mono text-slate-200">{geoParams.numGirders} <span className="text-xs text-slate-500 ml-0.5">Units</span></span>
                </div>
            </div>
        </div>
    );
}
