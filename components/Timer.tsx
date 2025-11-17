
import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
    onSetTime: (time: number) => void;
}

const TimerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Timer: React.FC<TimerProps> = ({ onSetTime }) => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = window.setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isActive && intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive]);

    const handleStartStop = () => {
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(0);
    };

    const handleApplyTime = () => {
        const timeInMinutes = time / 60;
        onSetTime(parseFloat(timeInMinutes.toFixed(2)));
    };
    
    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
             <h2 className="text-xl font-bold text-yellow-400 border-b border-gray-600 pb-2 flex items-center mb-4">
                <TimerIcon />
                Turnaround Timer
            </h2>
            <div className="text-6xl font-mono text-center my-4 py-4 bg-gray-900 rounded-md">
                {formatTime(time)}
            </div>
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={handleStartStop}
                    className={`p-3 rounded-md font-semibold text-white transition-colors ${isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isActive ? 'Stop' : 'Start'}
                </button>
                <button
                    onClick={handleReset}
                    className="p-3 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold text-white transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={handleApplyTime}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold text-white transition-colors"
                >
                    Use Time
                </button>
            </div>
        </div>
    );
};

export default Timer;
