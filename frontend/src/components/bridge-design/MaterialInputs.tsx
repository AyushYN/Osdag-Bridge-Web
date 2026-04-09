'use client';
import React, { useEffect, useState } from 'react';
import { fetchMaterials } from '@/lib/api';

interface MaterialInputsProps {
    isOther: boolean;
    girderMat: string;
    setGirderMat: (mat: string) => void;
    braceMat: string;
    setBraceMat: (mat: string) => void;
    deckMat: string;
    setDeckMat: (mat: string) => void;
}

export function MaterialInputs({
    isOther,
    girderMat,
    setGirderMat,
    braceMat,
    setBraceMat,
    deckMat,
    setDeckMat,
}: MaterialInputsProps) {
    const [steelGrades, setSteelGrades] = useState<string[]>(['E250', 'E350', 'E450']);
    const [concreteGrades, setConcreteGrades] = useState<string[]>(['M25', 'M30', 'M35', 'M40', 'M45', 'M50', 'M55', 'M60']);

    useEffect(() => {
        fetchMaterials('girder').then(setSteelGrades).catch(console.error);
        fetchMaterials('deck').then(setConcreteGrades).catch(console.error);
    }, []);

    const selectClass = "w-full h-9 px-3 text-xs font-bold text-blue-900 bg-blue-50/50 border border-blue-100 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:bg-blue-50 transition-all outline-none appearance-none shadow-inner";

    return (
        <div className={`pt-2 ${isOther ? 'opacity-40 pointer-events-none' : ''}`}>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Material Grades</h3>
            <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-600">Girder Steel</span>
                    <div className="relative">
                        <select value={girderMat} onChange={e => setGirderMat(e.target.value)} className={selectClass}>
                            {steelGrades.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-600">Cross Bracing</span>
                    <div className="relative">
                        <select value={braceMat} onChange={e => setBraceMat(e.target.value)} className={selectClass}>
                            {steelGrades.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-600">Deck Concrete</span>
                    <div className="relative">
                        <select value={deckMat} onChange={e => setDeckMat(e.target.value)} className={selectClass}>
                            {concreteGrades.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
