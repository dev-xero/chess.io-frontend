'use client';

import ClickableChessboard from '@/components/ClickableChessboard';
import GameHistoryBar from '@/components/GameHistoryBar';
import Header from '@/components/Header';
import GameStatsBar from '@/components/GameStatsBar';
import { useEffect, useState } from 'react';
import config from '@/config/config';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { keys } from '@/config/keys';
import ChessGame from '@/interfaces/chess.game.state';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export default function GamePlayLayout() {
    const pathname = usePathname();
    const [userID, setUserID] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [game, setGame] = useState<ChessGame | null>(null);
    const { sendJsonMessage, lastJsonMessage, lastMessage, readyState } =
        useWebSocket(config.ws, {
            share: false,
            shouldReconnect: () => true,
        });

    const playerColor = 'w';
    const [movePairs, setMovePairs] = useState<string[][]>([]);
    const [moveCount, setMoveCount] = useState(0);
    const [whoseTurn, setWhoseTurn] = useState<'w' | 'b'>('w');

    // User authentication
    useEffect(() => {
        const currentUser = localStorage.getItem(keys.user);
        if (!currentUser) {
            window.location.href = '/auth/login';
            return;
        }

        const userData = JSON.parse(currentUser);
        setUserID(userData.id);
    }, []);

    // Websocket authentication
    useEffect(() => {
        console.log('Connection state changed.');
        if (readyState == ReadyState.OPEN && userID) {
            sendJsonMessage({
                type: 'auth',
                userId: userID,
            });
        }
    }, [readyState]);

    // Synchronization + broadcast game ready event
    useEffect(() => {
        const initialize = async () => {
            const accessToken = getCookie(keys.auth);
            if (!accessToken) {
                window.location.href = '/auth/login';
                return;
            }

            const gameID = pathname.split('/')[2];
            const { data } = await axios.get(
                `${config.api}/game/state/${gameID}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log(data);
            setGame(data.game);
            sendJsonMessage({
                type: 'join_game',
                gameID,
            });
            sendJsonMessage({
                type: 'player_ready',
                gameID,
            });
        };

        initialize();
    }, []);

    // Listen for any new messages
    useEffect(() => {
        console.log(`Got a new message: ${lastMessage?.data}`);
        if (lastJsonMessage) {
            console.log(`Got new json message:`, lastJsonMessage);
        }
    }, [lastMessage, lastJsonMessage]);

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
            {!isReady ? (
                <></>
            ) : (
                <>
                    <header className="w-full flex items-center justify-center mt-4">
                        <Header />
                    </header>
                    <section className="flex flex-col md:grid grid-cols-4 gap-2 mx-auto w-[calc(100%-16px)] py-2 !max-w-[1400px]">
                        <GameStatsBar
                            whitePlayerName={'AlgoXero'}
                            blackPlayerName={'HalfLife'}
                            whoseTurn={whoseTurn}
                        />
                        <ClickableChessboard
                            playerColor={playerColor}
                            onMoveCompleted={(history) =>
                                updateMoveHistory(history)
                            }
                            setWhoseTurn={(color) => setWhoseTurn(color)}
                        />
                        <GameHistoryBar
                            moveHistoryPairs={movePairs}
                            whoseTurn={whoseTurn}
                        />
                    </section>
                </>
            )}
        </>
    );
}
