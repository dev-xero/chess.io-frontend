import { Asterisk, Clock, Lightning, Timer } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import ChessClock from './ChessClock';

type Game = 'Rapid' | 'Blitz' | 'Bullet';

interface IStatsBarProps {
    whoseTurn: 'w' | 'b';
}

export default function StatsBar(props: IStatsBarProps) {
    // Later, store the game object in local storage, it should contain:
    /**
     * 1. Game type
     * 2. Player IDs
     * 3. Time to play + time elapsed
     * 4. Game state.
     */

    const gameType: Game = 'Rapid';
    const timeLimit = 10;
    const whitePlayerName = 'algoXero';
    const blackPlayerName = 'halflife';
    const whiteTimeLeft = 400;
    const blackTimeLeft = 600;

    const [isWhitePaused, setIsWhitePaused] = useState(props.whoseTurn == 'b');
    const [isBlackPaused, setIsBlackPaused] = useState(props.whoseTurn == 'w');

    useEffect(() => {
        setIsWhitePaused(props.whoseTurn == 'b');
        setIsBlackPaused(props.whoseTurn == 'w');
    }, [props.whoseTurn]);

    return (
        <aside className="col-span-1 order-2 md:order-1">
            <Card>
                <h3 className="flex gap-2 items-center text-foreground">
                    <div>
                        {gameType == 'Rapid' ? (
                            <Lightning size={24} weight="fill" />
                        ) : gameType == 'Blitz' ? (
                            <Timer size={24} weight="fill" />
                        ) : (
                            <Asterisk size={24} weight="fill" />
                        )}
                    </div>
                    <span className="font-bold">{gameType} Game</span>
                </h3>
                <p className="flex gap-2 mt-2 text-faded items-center">
                    <Clock size={18} weight="fill" />
                    {timeLimit}mins
                </p>
            </Card>
            <Card>
                <h3 className="w-full text-xs font-bold text-faded mb-2 text-center">CLOCK</h3>
                <ChessClock
                    label={whitePlayerName}
                    shouldPause={isWhitePaused}
                    timeLimit={whiteTimeLeft}
                    onTimeElapsed={() => alert('White Time Up!')}
                />
                <ChessClock
                    label={blackPlayerName}
                    shouldPause={isBlackPaused}
                    timeLimit={blackTimeLeft}
                    onTimeElapsed={() => alert('Black Time Up!')}
                />
            </Card>
        </aside>
    );
}

interface ICardProps {
    children: React.ReactNode;
}

function Card({ children }: ICardProps) {
    return <div className="bg-base rounded-md p-4 w-full mb-2">{children}</div>;
}
