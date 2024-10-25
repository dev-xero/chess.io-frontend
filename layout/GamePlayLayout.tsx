'use client';

import ClickableChessboard from '@/components/ClickableChessboard';
import GameHistoryBar from '@/components/GameHistoryBar';
import Header from '@/components/Header';
import GameStatsBar from '@/components/GameStatsBar';
import { useState } from 'react';

export default function GamePlayLayout() {
    const [movePairs, setMovePairs] = useState<string[][]>([]);
    const [moveCount, setMoveCount] = useState(0);
    const [whoseTurn, setWhoseTurn] = useState<'w' | 'b'>('w');

    function updateMoveHistory(move: string[]) {
        if (move.length != 0) {
            if (moveCount == 0) {
                movePairs.push(move);
                setMoveCount(1);
                return;
            } else {
                const pairs: string[][] = [...movePairs];
                if (moveCount % 2 == 0) {
                    pairs.push(move);
                } else {
                    pairs[movePairs.length - 1].push(...move);
                }

                setMoveCount((moveCount) => moveCount + 1);
                setMovePairs(pairs);
            }
        }
    }

    return (
        <>
            <header className="w-full flex items-center justify-center mt-4">
                <Header />
            </header>
            <section className="flex flex-col md:grid grid-cols-4 gap-2 mx-auto w-[calc(100%-16px)] py-2 !max-w-[1400px]">
                <GameStatsBar whoseTurn={whoseTurn} />
                <ClickableChessboard
                    onMoveCompleted={(history) => updateMoveHistory(history)}
                    setWhoseTurn={(color) => setWhoseTurn(color)}
                />
                <GameHistoryBar
                    moveHistoryPairs={movePairs}
                    whoseTurn={whoseTurn}
                />
            </section>
        </>
    );
}
