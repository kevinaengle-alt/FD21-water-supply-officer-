
import React, { useState, useMemo } from 'react';
import type { Tender } from '../types';

interface CalculatorsProps {
  tenders: Tender[];
  turnAroundTime: number;
  setTurnAroundTime: (time: number) => void;
}

const CalculatorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M12 17h.01M15 17h.01M9 10h.01M12 10h.01M15 10h.01M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
);


const Calculators: React.FC<CalculatorsProps> = ({ tenders, turnAroundTime, setTurnAroundTime }) => {
  const [selectedCapacity, setSelectedCapacity] = useState<number>(tenders[0]?.tankCapacity || 3000);
  const [gpmNeed, setGpmNeed] = useState<number>(500);
  const [lowestCapacity, setLowestCapacity] = useState<number>(2500);

  const calculatedTenderGpm = useMemo(() => {
    if (turnAroundTime <= 0) return 0;
    return Math.round(selectedCapacity / turnAroundTime);
  }, [selectedCapacity, turnAroundTime]);

  const tendersNeeded = useMemo(() => {
    if (lowestCapacity <= 0) return 0;
    const needed = (turnAroundTime * gpmNeed) / lowestCapacity;
    return Math.ceil(needed);
  }, [turnAroundTime, gpmNeed, lowestCapacity]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col space-y-6">
      <h2 className="text-xl font-bold text-yellow-400 border-b border-gray-600 pb-2 flex items-center">
        <CalculatorIcon />
        Calculators
      </h2>

      {/* Tender GPM Calculator */}
      <div className="bg-gray-700 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Tender GPM</h3>
        <p className="text-sm text-gray-400 mb-4">Calculated Tender GPM = Capacity / Total Turn Around Time</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tender-capacity" className="block text-sm font-medium text-gray-300 mb-1">Tender Capacity (Gal)</label>
            <select
              id="tender-capacity"
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={selectedCapacity}
              onChange={(e) => setSelectedCapacity(Number(e.target.value))}
            >
              {tenders.map(tender => (
                <option key={tender.id} value={tender.tankCapacity}>{tender.id} - {tender.tankCapacity} gal</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="turnaround-time-1" className="block text-sm font-medium text-gray-300 mb-1">Turn Around Time (Min)</label>
            <input
              type="number"
              id="turnaround-time-1"
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={turnAroundTime}
              onChange={(e) => setTurnAroundTime(Number(e.target.value))}
              placeholder="e.g., 10"
            />
          </div>
        </div>
        <div className="mt-4 text-center bg-gray-800 p-3 rounded-md">
          <span className="text-gray-300">Calculated GPM: </span>
          <span className="text-2xl font-bold text-green-400">{calculatedTenderGpm}</span>
        </div>
      </div>

      {/* Tenders Needed Calculator */}
      <div className="bg-gray-700 p-4 rounded-md">
        <h3 className="font-semibold mb-2"># Of Tenders Needed</h3>
        <p className="text-sm text-gray-400 mb-4">Tenders Needed = (Turn Around Time * GPM Need) / Lowest Capacity</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="gpm-need" className="block text-sm font-medium text-gray-300 mb-1">GPM Need</label>
            <input
              type="number"
              id="gpm-need"
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={gpmNeed}
              onChange={(e) => setGpmNeed(Number(e.target.value))}
              placeholder="e.g., 500"
            />
          </div>
          <div>
            <label htmlFor="turnaround-time-2" className="block text-sm font-medium text-gray-300 mb-1">Turn Around Time (Min)</label>
            <input
              type="number"
              id="turnaround-time-2"
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={turnAroundTime}
              onChange={(e) => setTurnAroundTime(Number(e.target.value))}
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <label htmlFor="lowest-capacity" className="block text-sm font-medium text-gray-300 mb-1">Lowest Capacity (Gal)</label>
            <input
              type="number"
              id="lowest-capacity"
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={lowestCapacity}
              onChange={(e) => setLowestCapacity(Number(e.target.value))}
              placeholder="e.g., 2500"
            />
          </div>
        </div>
        <div className="mt-4 text-center bg-gray-800 p-3 rounded-md">
          <span className="text-gray-300">Tenders Needed: </span>
          <span className="text-2xl font-bold text-green-400">{tendersNeeded}</span>
        </div>
      </div>
    </div>
  );
};

export default Calculators;
