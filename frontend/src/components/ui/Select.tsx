'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search } from 'lucide-react';

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
}

export function Select({ value, onChange, options, placeholder, disabled, error }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [rect, setRect] = useState<DOMRect | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find(o => o.value === value)?.label || placeholder || 'Select...';
    const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
    const showSearch = options.length > 8;

    const open = () => {
        if (disabled) return;
        if (buttonRef.current) setRect(buttonRef.current.getBoundingClientRect());
        setSearch('');
        setIsOpen(true);
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleClose = (e: MouseEvent) => {
            if (
                buttonRef.current?.contains(e.target as Node) ||
                dropdownRef.current?.contains(e.target as Node)
            ) return;
            setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClose);
        return () => document.removeEventListener('mousedown', handleClose);
    }, [isOpen]);

    // Reposition on scroll/resize
    useEffect(() => {
        if (!isOpen) return;
        const update = () => {
            if (buttonRef.current) setRect(buttonRef.current.getBoundingClientRect());
        };
        window.addEventListener('scroll', update, true);
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update, true);
            window.removeEventListener('resize', update);
        };
    }, [isOpen]);

    const dropdownStyle: React.CSSProperties = rect ? {
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
    } : {};

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={open}
                disabled={disabled}
                className={`w-full h-9 px-3 bg-white border rounded-lg text-sm text-left transition-all flex items-center justify-between
                    ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'cursor-pointer'}
                    ${error ? 'border-red-400' : isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300 hover:border-gray-400'}
                    ${!value && !disabled ? 'text-gray-400' : 'text-gray-800'}
                `}
            >
                <span className="truncate">{selectedLabel}</span>
                <ChevronDown size={14} className={`ml-2 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''} ${disabled ? 'text-gray-300' : 'text-gray-500'}`} />
            </button>

            {isOpen && rect && createPortal(
                <div ref={dropdownRef} style={dropdownStyle} className="bg-white border border-gray-200 rounded-lg shadow-xl">
                    {showSearch && (
                        <div className="p-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-md border border-gray-200">
                                <Search size={12} className="text-gray-400 shrink-0" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="flex-1 text-xs bg-transparent outline-none text-gray-700 placeholder-gray-400"
                                />
                            </div>
                        </div>
                    )}
                    <div className="max-h-52 overflow-y-auto">
                        {placeholder && (
                            <div
                                onClick={() => { onChange(''); setIsOpen(false); }}
                                className="px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
                            >
                                {placeholder}
                            </div>
                        )}
                        {filtered.length === 0 ? (
                            <div className="px-3 py-3 text-xs text-gray-400 text-center">No results</div>
                        ) : filtered.map(opt => (
                            <div
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`px-3 py-2 text-sm cursor-pointer transition-colors
                                    ${opt.value === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                                `}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
