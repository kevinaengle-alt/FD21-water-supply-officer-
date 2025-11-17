import React, { useEffect, useRef, useState } from 'react';
import type { WaterSupply } from '../types';

// Declare Leaflet's global 'L' object to satisfy TypeScript
declare var L: any;

interface MapProps {
    sceneLocation: string;
    waterSupplies: WaterSupply[];
    onAddSupply: (supply: Omit<WaterSupply, 'id'>) => void;
    averageSpeed: number;
}

const parseCoords = (coordString: string): [number, number] | null => {
    if (!coordString || typeof coordString !== 'string') return null;
    const parts = coordString.split(',').map(s => s.trim());
    if (parts.length !== 2) return null;
    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);
    if (isNaN(lat) || isNaN(lon)) return null;
    return [lat, lon];
};

const calculateDistance = (coord1Str: string, coord2Str: string): number | null => {
    const coords1 = parseCoords(coord1Str)?.reverse() as [number, number] | undefined;
    const coords2 = parseCoords(coord2Str)?.reverse() as [number, number] | undefined;
    
    if (!coords1 || !coords2) return null;

    const R = 6371; // Radius of the Earth in km
    const dLat = (coords2[1] - coords1[1]) * Math.PI / 180;
    const dLon = (coords2[0] - coords1[0]) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat)/2 + 
        Math.cos(coords1[1] * Math.PI / 180) * Math.cos(coords2[1] * Math.PI / 180) * 
        (1 - Math.cos(dLon))/2;
    
    const distanceInKm = R * 2 * Math.asin(Math.sqrt(a));
    return distanceInKm * 0.621371; // Convert to miles
};


const Map: React.FC<MapProps> = ({ sceneLocation, waterSupplies, onAddSupply, averageSpeed }) => {
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const [isPinning, setIsPinning] = useState(false);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([47.6062, -122.3321], 9); // Default to Seattle
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);
        }
    }, []);

    useEffect(() => {
        // Clear previous markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        const bounds: [number, number][] = [];

        // Create custom icons
        const sceneIcon = L.divIcon({
            html: `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.706-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" />
                </svg>
            `,
            className: 'bg-transparent border-0',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        const supplyIcon = L.divIcon({
            html: `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
            `,
            className: 'bg-transparent border-0',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });
        
        // Add scene marker
        const sceneCoords = parseCoords(sceneLocation);
        if (sceneCoords) {
            const marker = L.marker(sceneCoords, { icon: sceneIcon }).addTo(mapRef.current);
            marker.bindPopup("<b>Scene Location</b>").openPopup();
            markersRef.current.push(marker);
            bounds.push(sceneCoords);
        }

        // Add water supply markers
        waterSupplies.forEach(supply => {
            const supplyCoords = parseCoords(supply.location);
            if (supplyCoords) {
                const distance = calculateDistance(sceneLocation, supply.location);
                let etaString = '';
                if (distance !== null && averageSpeed > 0) {
                    const etaMinutes = (distance / averageSpeed) * 60;
                    etaString = `<br><b class='text-yellow-400'>ETA:</b> ${etaMinutes.toFixed(1)} min`;
                }

                const turnAroundString = supply.turnAroundTime
                    ? `<br><b class='text-cyan-400'>Turnaround:</b> ${supply.turnAroundTime} min`
                    : '';

                const marker = L.marker(supplyCoords, { icon: supplyIcon }).addTo(mapRef.current);
                marker.bindPopup(`<b>${supply.type}</b><br>${supply.location}${etaString}${turnAroundString}`);
                markersRef.current.push(marker);
                bounds.push(supplyCoords);
            }
        });

        // Fit map to markers
        if (bounds.length > 0) {
            mapRef.current.flyToBounds(bounds, { padding: [50, 50] });
        }
        else if(sceneCoords) {
             mapRef.current.flyTo(sceneCoords, 14);
        }

    }, [sceneLocation, waterSupplies, averageSpeed]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        const mapContainer = map.getContainer();

        const handleMapClick = (e: any) => {
            const { lat, lng } = e.latlng;
            onAddSupply({
                type: 'Hydrant (Pinned)',
                location: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                turnAroundTime: '',
            });
            setIsPinning(false); // Automatically turn off after one pin
        };

        if (isPinning) {
            map.on('click', handleMapClick);
            mapContainer.style.cursor = 'crosshair';
        } else {
            mapContainer.style.cursor = ''; // Reset cursor
        }

        return () => {
            map.off('click', handleMapClick);
            if(mapContainer) {
                mapContainer.style.cursor = ''; // Ensure cursor is reset on unmount/cleanup
            }
        };
    }, [isPinning, onAddSupply]);

    return (
        <div className="relative">
            <div id="map" style={{ height: '450px' }} className="rounded-lg z-0"></div>
             <button
                onClick={() => setIsPinning(!isPinning)}
                className={`absolute top-2 right-2 z-[1000] p-2 rounded-md shadow-lg font-semibold text-white transition-colors
                    ${isPinning
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                title={isPinning ? "Cancel pinning mode" : "Pin a new hydrant location on the map"}
            >
                {isPinning ? (
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Click Map to Pin...
                    </div>
                ) : (
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Pin Hydrant
                    </div>
                )}
            </button>
        </div>
    );
};

export default Map;