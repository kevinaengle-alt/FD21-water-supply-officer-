import React, { useState } from 'react';
import Calculators from './components/Calculators';
import Timer from './components/Timer';
import ResourceLogs from './components/ResourceLogs';
import ReferenceInfo from './components/ReferenceInfo';
import Map from './components/Map';
import { TENDER_DATA } from './constants';
import type { WaterSupply } from './types';

// Haversine formula to calculate distance between two lat/lon points
const parseCoords = (coordString: string): { lat: number, lon: number } | null => {
    if (!coordString || typeof coordString !== 'string') return null;
    const parts = coordString.split(',').map(s => s.trim());
    if (parts.length !== 2) return null;
    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);
    if (isNaN(lat) || isNaN(lon)) return null;
    return { lat, lon };
};

const calculateDistance = (coord1Str: string, coord2Str: string): number | null => {
    const coords1 = parseCoords(coord1Str);
    const coords2 = parseCoords(coord2Str);

    if (!coords1 || !coords2) {
        return null;
    }
    
    const R = 6371; // Radius of the Earth in km
    const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
    const dLon = (coords2.lon - coords1.lon) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat)/2 + 
        Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) * 
        (1 - Math.cos(dLon))/2;
    
    const distanceInKm = R * 2 * Math.asin(Math.sqrt(a));
    return distanceInKm * 0.621371; // Convert to miles
};


const App: React.FC = () => {
    const [turnAroundTime, setTurnAroundTime] = useState<number>(10);
    const [sceneLocation, setSceneLocation] = useState<string>('');
    const [isFetchingSceneLocation, setIsFetchingSceneLocation] = useState(false);
    const [waterSupplies, setWaterSupplies] = useState<WaterSupply[]>([]);
    const [averageSpeed, setAverageSpeed] = useState<number>(35); // mph
    const [fillSetupTime, setFillSetupTime] = useState<number>(5); // minutes

    const handleAddSupply = (supply: Omit<WaterSupply, 'id'>) => {
        const distance = calculateDistance(sceneLocation, supply.location);
        let calculatedTurnaround: string | null = null;
        
        if (distance !== null && averageSpeed > 0) {
            const travelTimeOneWay = (distance / averageSpeed) * 60; // one-way in minutes
            const totalTurnaroundTime = (travelTimeOneWay * 2) + fillSetupTime;
            calculatedTurnaround = totalTurnaroundTime.toFixed(2);
        }

        // Use manually entered time if it exists, otherwise use calculated time.
        const finalTurnaroundTime = supply.turnAroundTime || calculatedTurnaround || '';
        
        const newSupply: WaterSupply = { id: crypto.randomUUID(), ...supply, turnAroundTime: finalTurnaroundTime };
        setWaterSupplies(prev => [...prev, newSupply]);
    };

    const handleRemoveSupply = (id: string) => {
        setWaterSupplies(waterSupplies.filter(supply => supply.id !== id));
    };


    const FireIcon = () => (
        <svg xmlns="http://www.w.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 01-1.898-.632l4-12a1 1 0 011.265-.633zM10 4a1 1 0 01.633 1.265l-2 6a1 1 0 01-1.898-.632l2-6A1 1 0 0110 4z" clipRule="evenodd" />
            <path d="M5 10a1 1 0 01.633 1.265l-2 6a1 1 0 11-1.898-.632l2-6A1 1 0 015 10zM15 10a1 1 0 01.633 1.265l-2 6a1 1 0 01-1.898-.632l2-6a1 1 0 011.265-.632z" />
        </svg>
    );
    
    const LocationMarkerIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
    );

    const SpinnerIcon = () => (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
    
    const handleGetSceneLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setIsFetchingSceneLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setSceneLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                setIsFetchingSceneLocation(false);
            },
            (error) => {
                alert(`Error getting location: ${error.message}`);
                setIsFetchingSceneLocation(false);
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-2 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 flex items-center space-x-4 border-b-4 border-red-600">
                    <FireIcon />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">FD21 Water Supply Officer Work Sheet</h1>
                        <p className="text-yellow-400">Tender Operations & GPM Calculator</p>
                    </div>
                </header>

                <div className="mb-6 bg-gray-800 rounded-lg p-4 shadow-lg space-y-4">
                  <div>
                    <label htmlFor="scene-location" className="block text-sm font-medium text-gray-300 mb-1">Scene Location (Lat, Lon)</label>
                    <div className="relative">
                      <input
                        id="scene-location"
                        type="text"
                        placeholder="e.g., 47.6062, -122.3321 or use GPS"
                        value={sceneLocation}
                        onChange={e => setSceneLocation(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded p-2 text-sm w-full pr-10"
                        disabled={isFetchingSceneLocation}
                      />
                      <button
                        type="button"
                        onClick={handleGetSceneLocation}
                        className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isFetchingSceneLocation}
                        aria-label="Get scene location"
                      >
                        {isFetchingSceneLocation ? <SpinnerIcon /> : <LocationMarkerIcon />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                            <label htmlFor="avg-speed" className="block text-sm font-medium text-gray-300 mb-1">Average Tender Speed (mph)</label>
                            <input
                                id="avg-speed"
                                type="number"
                                value={averageSpeed}
                                onChange={e => setAverageSpeed(Number(e.target.value))}
                                className="bg-gray-700 border border-gray-600 rounded p-2 text-sm w-full"
                                placeholder="e.g., 35"
                            />
                        </div>
                        <div>
                            <label htmlFor="fill-time" className="block text-sm font-medium text-gray-300 mb-1">Fixed Fill/Setup Time (min)</label>
                            <input
                                id="fill-time"
                                type="number"
                                value={fillSetupTime}
                                onChange={e => setFillSetupTime(Number(e.target.value))}
                                className="bg-gray-700 border border-gray-600 rounded p-2 text-sm w-full"
                                placeholder="e.g., 5"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6 bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-700">
                  <Map 
                    sceneLocation={sceneLocation} 
                    waterSupplies={waterSupplies} 
                    onAddSupply={handleAddSupply}
                    averageSpeed={averageSpeed}
                  />
                </div>


                <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-6">
                        <Timer onSetTime={setTurnAroundTime} />
                        <Calculators tenders={TENDER_DATA} turnAroundTime={turnAroundTime} setTurnAroundTime={setTurnAroundTime} />
                    </div>
                    <div>
                        <ResourceLogs 
                            tenders={TENDER_DATA} 
                            sceneLocation={sceneLocation}
                            waterSupplies={waterSupplies}
                            onAddSupply={handleAddSupply}
                            onRemoveSupply={handleRemoveSupply}
                            averageSpeed={averageSpeed}
                            onSetTurnAroundTime={setTurnAroundTime}
                        />
                    </div>
                </main>
                
                <footer className="mt-6">
                    <ReferenceInfo tenders={TENDER_DATA} />
                </footer>
            </div>
        </div>
    );
};

export default App;