import { useEffect, useRef, useState } from 'react';

interface IChessClockProps {
    timeLimit: number;
    label: string;
    shouldPause: boolean;
    onTimeElapsed: () => void;
}

export default function ChessClock(props: IChessClockProps) {
    const [timeInMillis, setTimeInMillis] = useState(props.timeLimit * 1000);
    const lastTickRef = useRef<number | null>(null);

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / (60 * 1000));
        const seconds = Math.floor((ms % (60 * 1000)) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 100);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
    };

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

                setTimeInMillis((prevMillis) => {
                    const newTimeInMillis = prevMillis - elapsed;
                    if (newTimeInMillis <= 0) {
                        props.onTimeElapsed();
                        clearInterval(counter);
                        return 0;
                    }
                    return newTimeInMillis;
                });
            }, 100);

            return () => {
                clearInterval(counter);
            };
        } else {
            lastTickRef.current = null;
        }
    }, [props.shouldPause]);

    return (
        <section className="w-full p-2 rounded-md font-bold text-2xl">
            <p className="font-bold text-xs text-faded mb-1">{props.label.toUpperCase()}</p>
            <h2 className="text-3xl">{formatTime(timeInMillis)}</h2>
        </section>
    );
}
