'use client';

import ClickableChessboard from '@/components/ClickableChessboard';
import GameHistoryBar from '@/components/GameHistoryBar';
import StatsBar from '@/components/StatsBar';
import { useEffect, useState } from 'react';

export default function GamePlayLayout() {
    const [movePairs, setMovePairs] = useState<string[][]>([]);
    const [moveCount, setMoveCount] = useState(0);

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

    useEffect(() => {
        console.log(movePairs);
    }, [movePairs]);

    return (
        <section className="grid grid-cols-4 gap-2 mx-auto w-[calc(100%-16px)] py-2 !max-w-[1400px]">
            <StatsBar />
            <ClickableChessboard
                onMoveCompleted={(history) => updateMoveHistory(history)}
            />
            <GameHistoryBar />
        </section>
    );
}
