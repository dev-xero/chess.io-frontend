import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

interface IChessClockProps {
    timeLimit: number;
    currentTime: number;
    label: string;
    shouldPause: boolean;
    onTimeElapsed: () => void;
    onTick: (ms: number) => void;
}

export default function ChessClock(props: IChessClockProps) {
    const [isClient, setIsClient] = useState(false);
    const lastTickRef = useRef<number | null>(null);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const decisecond = Math.floor((ms % 1000) / 100);

        return `${totalMinutes}:${seconds
            .toString()
            .padStart(2, '0')}.${decisecond}`;
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    // accurate to the nearest 100th of a millisecond
    useEffect(() => {
        if (!props.shouldPause) {
            lastTickRef.current = Date.now();
            const counter = setInterval(() => {
                const now = Date.now();
                const elapsed = lastTickRef.current
                    ? now - lastTickRef.current
                    : 100;
                lastTickRef.current = now;

                const newTimeInMillis = props.currentTime - elapsed;
                if (newTimeInMillis <= 0) {
                    props.onTimeElapsed();
                    clearInterval(counter);
                    props.onTick(0);
                } else {
                    props.onTick(newTimeInMillis);
                }
            }, 100);

            return () => {
                clearInterval(counter);
            };
        } else {
            lastTickRef.current = null;
        }
    }, [props.shouldPause, isClient, props.currentTime]);

    const timeDisplay = isClient
        ? formatTime(props.currentTime)
        : formatTime(props.timeLimit * 1000);

    return (
        <section className="w-full py-2 rounded-md font-bold text-2xl">
            <p className="font-bold text-xs text-faded mb-1">
                {props.label.toUpperCase()}
            </p>
            <h2
                className={clsx(
                    'text-3xl transition-all',
                    props.shouldPause ? 'opacity-60' : 'opacity-100'
                )}
            >
                {timeDisplay}
            </h2>
        </section>
    );
}
