import React, { useState, useMemo } from 'react';
import type { WaterSupplyUnit, WaterSupply, Tender } from '../types';

interface ResourceLogsProps {
    tenders: Tender[];
    sceneLocation: string;
    waterSupplies: WaterSupply[];
    onAddSupply: (supply: Omit<WaterSupply, 'id'>) => void;
    onRemoveSupply: (id: string) => void;
    averageSpeed: number;
    onSetTurnAroundTime: (time: number) => void;
}

const LogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
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

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);


// Haversine formula to calculate distance between two lat/lon points
const calculateDistance = (coord1Str: string, coord2Str: string): number | null => {
    const parseCoords = (coordString: string): { lat: number, lon: number } | null => {
        if (!coordString || typeof coordString !== 'string') return null;
        const parts = coordString.split(',').map(s => s.trim());
        if (parts.length !== 2) return null;
        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);
        if (isNaN(lat) || isNaN(lon)) return null;
        return { lat, lon };
    };

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


const ResourceLogs: React.FC<ResourceLogsProps> = ({ tenders, sceneLocation, waterSupplies, onAddSupply, onRemoveSupply, averageSpeed, onSetTurnAroundTime }) => {
    const [supplyUnits, setSupplyUnits] = useState<WaterSupplyUnit[]>([]);
    
    const [unitInput, setUnitInput] = useState({ unit: '', location: '', assignment: '' });
    const [supplyInput, setSupplyInput] = useState({ type: '', location: '', turnAroundTime: '' });

    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [supplySearchTerm, setSupplySearchTerm] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAddUnit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!unitInput.unit) return;
        const newUnit: WaterSupplyUnit = { id: crypto.randomUUID(), ...unitInput };
        setSupplyUnits([...supplyUnits, newUnit]);
        setUnitInput({ unit: '', location: '', assignment: '' });
    };

    const handleRemoveUnit = (id: string) => {
        setSupplyUnits(supplyUnits.filter(unit => unit.id !== id));
    };

    const handleAddSupply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplyInput.type || !supplyInput.location) return;
        onAddSupply(supplyInput);
        setSupplyInput({ type: '', location: '', turnAroundTime: '' });
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setIsFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setSupplyInput(prev => ({ ...prev, location: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
                setIsFetchingLocation(false);
            },
            (error) => {
                alert(`Error getting location: ${error.message}`);
                setIsFetchingLocation(false);
            }
        );
    };
    
    const filteredWaterSupplies = useMemo(() => {
        return waterSupplies.filter(supply => 
            supply.location.toLowerCase().includes(supplySearchTerm.toLowerCase())
        );
    }, [waterSupplies, supplySearchTerm]);

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const geojsonData = JSON.parse(text);

                if (geojsonData.type !== 'FeatureCollection' || !Array.isArray(geojsonData.features)) {
                    throw new Error("Invalid GeoJSON format. Must be a FeatureCollection.");
                }

                const newSupplies: Omit<WaterSupply, 'id'>[] = [];
                geojsonData.features.forEach((feature: any) => {
                    if (feature.geometry?.type === 'Point' && Array.isArray(feature.geometry.coordinates)) {
                        const [lon, lat] = feature.geometry.coordinates;
                        
                        // Try to get a descriptive name from properties
                        const name = feature.properties?.name || feature.properties?.NAME || 'Imported Hydrant';
                        
                        const newSupply: Omit<WaterSupply, 'id'> = {
                            type: name,
                            location: `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
                            turnAroundTime: ''
                        };
                        newSupplies.push(newSupply);
                    }
                });
                
                // Batch add supplies
                newSupplies.forEach(onAddSupply);

            } catch (error: any) {
                alert(`Error importing file: ${error.message}`);
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col space-y-6">
            <h2 className="text-xl font-bold text-yellow-400 border-b border-gray-600 pb-2 flex items-center">
                <LogIcon />
                Resource Logs
            </h2>
            
            {/* Water Supply Units */}
            <div className="bg-gray-700 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Water Supply Units</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="p-2">Unit</th>
                                <th className="p-2">Location</th>
                                <th className="p-2">Assignment</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplyUnits.map(unit => (
                                <tr key={unit.id} className="border-b border-gray-600 hover:bg-gray-600">
                                    <td className="p-2">{unit.unit}</td>
                                    <td className="p-2">{unit.location}</td>
                                    <td className="p-2">{unit.assignment}</td>
                                    <td className="p-2 text-right">
                                        <button onClick={() => handleRemoveUnit(unit.id)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <form onSubmit={handleAddUnit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 items-end">
                    <select 
                        value={unitInput.unit} 
                        onChange={e => setUnitInput({...unitInput, unit: e.target.value})} 
                        className="bg-gray-800 border border-gray-600 rounded p-2 text-sm w-full"
                    >
                        <option value="">-- Select Unit --</option>
                        {tenders.map(tender => (
                            <option key={tender.id} value={tender.id}>{tender.id}</option>
                        ))}
                    </select>
                    <input type="text" placeholder="Location" value={unitInput.location} onChange={e => setUnitInput({...unitInput, location: e.target.value})} className="bg-gray-800 border border-gray-600 rounded p-2 text-sm w-full" />
                    <input type="text" placeholder="Assignment" value={unitInput.assignment} onChange={e => setUnitInput({...unitInput, assignment: e.target.value})} className="bg-gray-800 border border-gray-600 rounded p-2 text-sm w-full" />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded text-sm w-full">Add Unit</button>
                </form>
            </div>

            {/* Water Supplies */}
            <div className="bg-gray-700 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Water Supplies</h3>
                 <div className="my-2">
                    <input
                        type="text"
                        placeholder="Search by Location/Address..."
                        value={supplySearchTerm}
                        onChange={(e) => setSupplySearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-600 rounded p-2 text-sm w-full"
                        aria-label="Search water supplies by location"
                    />
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="p-2">Type (Hydrant/Porta-Tank)</th>
                                <th className="p-2">Location/Address</th>
                                <th className="p-2">Distance (Miles)</th>
                                <th className="p-2">ETA (Mins)</th>
                                <th className="p-2">Turn Around Time</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWaterSupplies.map(supply => {
                                const distance = calculateDistance(sceneLocation, supply.location);
                                let eta = null;
                                if (distance !== null && averageSpeed > 0) {
                                    eta = (distance / averageSpeed) * 60; // in minutes
                                }
                                const hasValidTime = supply.turnAroundTime && !isNaN(parseFloat(supply.turnAroundTime));

                                return (
                                <tr key={supply.id} className="border-b border-gray-600 hover:bg-gray-600">
                                    <td className="p-2">{supply.type}</td>
                                    <td className="p-2">{supply.location}</td>
                                    <td className="p-2 font-medium text-cyan-300">
                                        {distance !== null ? `${distance.toFixed(2)} mi` : 'N/A'}
                                    </td>
                                     <td className="p-2 font-medium text-yellow-300">
                                        {eta !== null ? `${eta.toFixed(1)}` : 'N/A'}
                                    </td>
                                    <td className="p-2">{supply.turnAroundTime}</td>
                                    <td className="p-2 text-right flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => {
                                                if (hasValidTime) {
                                                    onSetTurnAroundTime(parseFloat(supply.turnAroundTime));
                                                }
                                            }}
                                            disabled={!hasValidTime}
                                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-2 rounded text-xs disabled:bg-gray-500 disabled:cursor-not-allowed"
                                            title="Use this turnaround time in calculators"
                                        >
                                            Use
                                        </button>
                                        <button onClick={() => onRemoveSupply(supply.id)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                 <form onSubmit={handleAddSupply} className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 items-end">
                    <input type="text" placeholder="Type" value={supplyInput.type} onChange={e => setSupplyInput({...supplyInput, type: e.target.value})} className="bg-gray-800 border border-gray-600 rounded p-2 text-sm w-full" />
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Location/Address"
                            value={supplyInput.location}
                            onChange={e => setSupplyInput({...supplyInput, location: e.target.value})}
                            className="bg-gray-800 border border-gray-600 rounded p-2 text-sm w-full pr-10"
                            disabled={isFetchingLocation}
                        />
                         <button
                            type="button"
                            onClick={handleGetLocation}
                            className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isFetchingLocation}
                            aria-label="Get current location"
                        >
                            {isFetchingLocation ? <SpinnerIcon /> : <LocationMarkerIcon />}
                        </button>
                    </div>
                    <input type="text" placeholder="Turn Around Time" value={supplyInput.turnAroundTime} onChange={e => setSupplyInput({...supplyInput, turnAroundTime: e.target.value})} className="bg-gray-800 border border-gray-600 rounded p-2 text-sm w-full" />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded text-sm w-full col-span-1 md:col-span-2">Add Supply</button>
                </form>
                <div className="mt-4">
                     <input
                        type="file"
                        accept=".geojson"
                        onChange={handleFileImport}
                        className="hidden"
                        ref={fileInputRef}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-600 hover:bg-gray-500 text-white font-semibold p-2 rounded text-sm w-full flex items-center justify-center"
                    >
                        <UploadIcon />
                        Import GIS Data (.geojson)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourceLogs;