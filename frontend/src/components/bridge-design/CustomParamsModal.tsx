'use client';
import React from 'react';
import { FileText, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { CustomParams } from '@/types';

interface CustomParamsModalProps {
    isOpen: boolean;
    onClose: () => void;
    customParams: CustomParams;
    setCustomParams: (params: CustomParams) => void;
}

export function CustomParamsModal({
    isOpen,
    onClose,
    customParams,
    setCustomParams,
}: CustomParamsModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tabulate Custom Loading Parameters"
            icon={<FileText size={16} className="text-gray-400" />}
        >
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Spreadsheet Header Row */}
                <div className="grid grid-cols-[1fr_120px_60px] bg-gray-100 border-b border-gray-300">
                    <div className="px-3 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider border-r border-gray-300">Parameter</div>
                    <div className="px-3 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider border-r border-gray-300">Value</div>
                    <div className="px-3 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-wider">Unit</div>
                </div>

                {/* Row 1: Wind Speed */}
                <div className="grid grid-cols-[1fr_120px_60px] border-b border-gray-200 hover:bg-blue-50/30 transition-colors">
                    <div className="px-3 py-2.5 text-xs font-medium text-gray-700 border-r border-gray-200 flex items-center">Basic Wind Speed</div>
                    <div className="px-1 py-1 border-r border-gray-200">
                        <input
                            type="number"
                            className="w-full h-full px-2 py-1.5 text-sm font-mono bg-transparent border-0 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded"
                            value={customParams.wind}
                            onChange={e => setCustomParams({ ...customParams, wind: e.target.value })}
                        />
                    </div>
                    <div className="px-3 py-2.5 text-xs text-gray-400">m/s</div>
                </div>

                {/* Row 2: Seismic Zone */}
                <div className="grid grid-cols-[1fr_120px_60px] border-b border-gray-200 hover:bg-blue-50/30 transition-colors">
                    <div className="px-3 py-2.5 text-xs font-medium text-gray-700 border-r border-gray-200 flex items-center">Seismic Zone</div>
                    <div className="px-1 py-1 border-r border-gray-200">
                        <Select
                            value={customParams.zone}
                            onChange={v => setCustomParams({ ...customParams, zone: v })}
                            options={['II', 'III', 'IV', 'V'].map(v => ({ value: v, label: v }))}
                        />
                    </div>
                    <div className="px-3 py-2.5 text-xs text-gray-400">—</div>
                </div>

                {/* Row 3: Zone Factor */}
                <div className="grid grid-cols-[1fr_120px_60px] border-b border-gray-200 hover:bg-blue-50/30 transition-colors">
                    <div className="px-3 py-2.5 text-xs font-medium text-gray-700 border-r border-gray-200 flex items-center">Zone Factor</div>
                    <div className="px-1 py-1 border-r border-gray-200">
                        <input
                            type="number"
                            step="0.01"
                            className="w-full h-full px-2 py-1.5 text-sm font-mono bg-transparent border-0 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded"
                            value={customParams.factor}
                            onChange={e => setCustomParams({ ...customParams, factor: e.target.value })}
                        />
                    </div>
                    <div className="px-3 py-2.5 text-xs text-gray-400">Z</div>
                </div>

                {/* Row 4: Max Temp */}
                <div className="grid grid-cols-[1fr_120px_60px] border-b border-gray-200 hover:bg-blue-50/30 transition-colors">
                    <div className="px-3 py-2.5 text-xs font-medium text-gray-700 border-r border-gray-200 flex items-center">Max Shade Air Temp</div>
                    <div className="px-1 py-1 border-r border-gray-200">
                        <input
                            type="number"
                            className="w-full h-full px-2 py-1.5 text-sm font-mono bg-transparent border-0 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded"
                            value={customParams.maxTemp}
                            onChange={e => setCustomParams({ ...customParams, maxTemp: e.target.value })}
                        />
                    </div>
                    <div className="px-3 py-2.5 text-xs text-gray-400">°C</div>
                </div>

                {/* Row 5: Min Temp */}
                <div className="grid grid-cols-[1fr_120px_60px] hover:bg-blue-50/30 transition-colors">
                    <div className="px-3 py-2.5 text-xs font-medium text-gray-700 border-r border-gray-200 flex items-center">Min Shade Air Temp</div>
                    <div className="px-1 py-1 border-r border-gray-200">
                        <input
                            type="number"
                            className="w-full h-full px-2 py-1.5 text-sm font-mono bg-transparent border-0 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded"
                            value={customParams.minTemp}
                            onChange={e => setCustomParams({ ...customParams, minTemp: e.target.value })}
                        />
                    </div>
                    <div className="px-3 py-2.5 text-xs text-gray-400">°C</div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 uppercase tracking-wide transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onClose}
                    className="px-5 py-2 bg-gray-800 text-white rounded-lg text-xs font-semibold hover:bg-gray-900 flex items-center gap-1.5 transition-colors"
                >
                    <Check size={14} /> Apply
                </button>
            </div>
        </Modal>
    );
}
