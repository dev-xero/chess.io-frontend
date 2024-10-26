import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface ChessClockProps {
    timeLimit: number;
    currentTime: number;
    label: string;
    shouldPause: boolean;
    onTimeElapsed: () => void;
    onTick: (ms: number) => void;
}

export default function ChessClock({
    timeLimit,
    currentTime,
    label,
    shouldPause,
    onTimeElapsed,
    onTick,
}: ChessClockProps) {
    const rafIdRef = useRef<number | null>(null);
    const lastTickRef = useRef<number | null>(null);
    const remainingTimeRef = useRef<number>(currentTime);
    const [displayTime, setDisplayTime] = useState(currentTime);
    const [isClient, setIsClient] = useState(false);

    // Track when pause state changes
    const pauseChangeRef = useRef<number | null>(null);

    const formatTime = (ms: number): string => {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60);
        const decisecond = Math.floor((Math.max(0, ms) % 1000) / 100);

        return `${minutes}:${seconds
            .toString()
            .padStart(2, '0')}.${decisecond}`;
    };

    const updateTimer = (timestamp: number) => {
        if (shouldPause) {
            rafIdRef.current = null;
            return;
        }

        if (
            lastTickRef.current === null ||
            pauseChangeRef.current === timestamp
        ) {
            lastTickRef.current = timestamp;
            pauseChangeRef.current = null;
        }

        const elapsed = timestamp - lastTickRef.current;
        lastTickRef.current = timestamp;

        // Update the remaining time
        remainingTimeRef.current = Math.max(
            0,
            remainingTimeRef.current - elapsed
        );

        // Update display and trigger callback if time changed significantly
        if (Math.abs(remainingTimeRef.current - displayTime) >= 100) {
            setDisplayTime(remainingTimeRef.current);
            onTick(remainingTimeRef.current);

            if (remainingTimeRef.current <= 0) {
                onTimeElapsed();
                return;
            }
        }

        rafIdRef.current = requestAnimationFrame(updateTimer);
    };

    // Handle pause/unpause and cleanup
    useEffect(() => {
        if (!shouldPause && !rafIdRef.current) {
            pauseChangeRef.current = performance.now();
            rafIdRef.current = requestAnimationFrame(updateTimer);
        }

        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, [shouldPause]);

    // Sync with external time updates
    useEffect(() => {
        remainingTimeRef.current = currentTime;
        setDisplayTime(currentTime);

        // Reset last tick when time is updated externally
        lastTickRef.current = null;
    }, [currentTime]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const timeDisplay = isClient
        ? formatTime(displayTime)
        : formatTime(timeLimit * 1000);

    return (
        <section className="w-full py-2 rounded-md font-bold text-2xl">
            <p className="font-bold text-xs text-faded mb-1">
                {label.toUpperCase()}
            </p>
            <h2
                className={clsx(
                    'text-3xl transition-all',
                    shouldPause ? 'opacity-60' : 'opacity-100'
                )}
            >
                {timeDisplay}
            </h2>
        </section>
    );
}
