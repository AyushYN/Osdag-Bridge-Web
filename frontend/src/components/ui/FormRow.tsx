'use client';
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface FormRowProps {
    label: string;
    error?: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export function FormRow({
    label,
    error,
    children,
    disabled,
}: FormRowProps) {
    return (
        <div className={`${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">{label}</label>
                {error && (
                    <span className="text-[10px] text-red-600 font-medium flex items-center gap-0.5">
                        <AlertTriangle size={10} /> {error}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}
