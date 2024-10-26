import {
    Asterisk,
    Clock,
    FlagBannerFold,
    Handshake,
    Lightning,
    Timer,
} from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import ChessClock from './ChessClock';

type Game = 'Rapid' | 'Blitz' | 'Bullet';

interface IGameStatsBarProps {
    whoseTurn: 'w' | 'b';
    whitePlayerName: string;
    blackPlayerName: string;
}

export default function GameStatsBar(props: IGameStatsBarProps) {
    // Later, store the game object in local storage, it should contain:
    /**
     * 1. Game type
     * 2. Player IDs
     * 3. Time to play + time elapsed
     * 4. Game state.
     */

    const gameType: Game = 'Rapid';
    const timeLimit = 10;
    const whiteTimeLeft = 600;
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
                <h3 className="w-full text-xs font-bold text-faded mb-2 text-center">
                    CLOCK
                </h3>
                <ChessClock
                    label={props.whitePlayerName}
                    shouldPause={isWhitePaused}
                    timeLimit={whiteTimeLeft}
                    onTimeElapsed={() => alert('White Time Up!')}
                />
                <ChessClock
                    label={props.blackPlayerName}
                    shouldPause={isBlackPaused}
                    timeLimit={blackTimeLeft}
                    onTimeElapsed={() => alert('Black Time Up!')}
                />
            </Card>
            <Card>
                <h3 className="w-full text-xs font-bold text-faded mb-2 text-center">
                    ACTIONS
                </h3>
                <p
                    onClick={() => {}}
                    className="w-full flex items-center gap-2 cursor-pointer hover:underline underline-offset-4 mb-2 text-faded hover:text-foreground transition-all"
                >
                    <FlagBannerFold size={18} weight="fill" />
                    <span>Resign</span>
                </p>
                <p
                    onClick={() => {}}
                    className="w-full flex items-center gap-2 cursor-pointer hover:underline underline-offset-4 mb-2 text-faded hover:text-foreground transition-all"
                >
                    <Handshake size={18} weight="fill" />
                    <span>Draw</span>
                </p>
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
