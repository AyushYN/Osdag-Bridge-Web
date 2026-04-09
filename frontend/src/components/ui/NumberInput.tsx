'use client';
import React from 'react';

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    step?: number;
    error?: boolean;
    disabled?: boolean;
    mono?: boolean;
}

export function NumberInput({
    value,
    onChange,
    step = 1,
    error,
    disabled,
    mono = false,
}: NumberInputProps) {
    return (
        <input
            type="number"
            step={step}
            value={value}
            onChange={e => onChange(parseFloat(e.target.value) || 0)}
            disabled={disabled}
            className={`w-full h-9 px-3 border rounded text-sm transition-all
        ${mono ? 'font-mono' : ''}
        ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}
        ${error ? 'border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-1 focus:ring-red-200' : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-100'}
      `}
        />
    );
}
