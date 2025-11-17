
import React, { useState } from 'react';
import type { Tender } from '../types';
import { KEY_POINTS, GPM_QUICK_GLANCE_DATA } from '../constants';

interface ReferenceInfoProps {
    tenders: Tender[];
}

const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-gray-700 rounded-md">
            <h2>
                <button
                    type="button"
                    className="flex items-center justify-between w-full p-4 font-semibold text-left text-yellow-400 bg-gray-800 rounded-md hover:bg-gray-700"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{title}</span>
                    <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            </h2>
            {isOpen && (
                <div className="p-4 border-t border-gray-600">
                    {children}
                </div>
            )}
        </div>
    );
};

const ReferenceInfo: React.FC<ReferenceInfoProps> = ({ tenders }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg space-y-2">
             <AccordionItem title="Key Points">
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {KEY_POINTS.map((point, index) => <li key={index}>★ {point}</li>)}
                </ul>
            </AccordionItem>
            <AccordionItem title="GPM Quick Glance">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-center">
                    {GPM_QUICK_GLANCE_DATA.map(item => (
                        <div key={item.time} className="bg-gray-800 p-2 rounded-md">
                            <div className="font-bold text-red-400">{item.time}</div>
                            <div className="text-lg">{item.gpm}</div>
                        </div>
                    ))}
                </div>
            </AccordionItem>
            <AccordionItem title="Tender Capacities & Capabilities">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="p-2">Tender</th>
                                <th className="p-2">Station</th>
                                <th className="p-2">Tank (Gal)</th>
                                <th className="p-2">Pump (GPM)</th>
                                <th className="p-2">Fold-A-Tank</th>
                                <th className="p-2">Tank Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenders.map(tender => (
                                <tr key={tender.id} className="border-b border-gray-600 hover:bg-gray-600">
                                    <td className="p-2 font-semibold">{tender.id}</td>
                                    <td className="p-2">{tender.station}</td>
                                    <td className="p-2">{tender.tankCapacity}</td>
                                    <td className="p-2">{tender.pumpGpm}</td>
                                    <td className={`p-2 font-bold ${tender.foldATank ? 'text-green-400' : 'text-red-400'}`}>{tender.foldATank ? 'YES' : 'NO'}</td>
                                    <td className="p-2">{tender.foldATankSize || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AccordionItem>
        </div>
    );
};

export default ReferenceInfo;
