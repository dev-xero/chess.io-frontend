'use client';

import ClickableChessboard from '@/components/ClickableChessboard';
import GameHistoryBar from '@/components/GameHistoryBar';
import Header from '@/components/Header';
import GameStatsBar from '@/components/GameStatsBar';
import { useEffect, useState } from 'react';
import config from '@/config/config';
import { usePathname } from 'next/navigation';
import { keys } from '@/config/keys';
import ChessGame, {
    BoardMove,
    ChessState,
    Player,
} from '@/interfaces/chess.game.state';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { getCookie } from 'cookies-next';
import axios from 'axios';

interface WSStartMessage {
    type: string;
    game: WSGameMessage;
}

interface WSGameMessage {
    duration: number;
    whitePlayer: string;
    blackPlayer: string;
    state: string;
}

interface WSMoveMessage {
    type: string;
    state: ChessState;
    duration: number;
}

interface PlayerInfo {
    gameID: string;
    userID: string;
    username: string;
}

export default function GamePlayLayout() {
    const pathname = usePathname();
    const [fen, setFen] = useState('');
    const [isReady, setIsReady] = useState(false);
    const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
    const [game, setGame] = useState<ChessGame | null>(null);

    const { sendJsonMessage, lastJsonMessage, lastMessage, readyState } =
        useWebSocket(config.ws, {
            share: false,
            shouldReconnect: () => true,
        });

    const [doneTimeSetup, setDoneTimeSetup] = useState(false);
    const [playerColor, setPlayerColor] = useState<string | null>(null);
    const [whoseTurn, setWhoseTurn] = useState<'w' | 'b'>('w');
    const [gameTime, setGameTime] = useState({
        white: 600,
        black: 600,
        isWhitePaused: true,
        isBlackPaused: true,
    });

    // still local for now
    const [movePairs, setMovePairs] = useState<string[][]>([]);
    const [moveCount, setMoveCount] = useState(0);

    useEffect(() => {
        if (game && game.duration && !doneTimeSetup) {
            setGameTime({
                white: game.duration,
                black: game.duration,
                isWhitePaused: whoseTurn === 'b',
                isBlackPaused: whoseTurn === 'w',
            });
            setDoneTimeSetup(true);
        }
    }, [game, whoseTurn]);

    // User authentication
    useEffect(() => {
        const currentUser = localStorage.getItem(keys.user);
        if (!currentUser) {
            window.location.href = '/auth/login';
            return;
        }

        const userData = JSON.parse(currentUser);
        setPlayerInfo({
            userID: userData.id,
            username: userData.username,
            gameID: pathname.split('/')[2],
        });
    }, []);

    // Websocket authentication
    useEffect(() => {
        console.log('Connection state changed.');
        if (readyState == ReadyState.OPEN && playerInfo) {
            sendJsonMessage({
                type: 'auth',
                userId: playerInfo.userID,
            });
        }
    }, [readyState]);

    // Synchronization + broadcast game ready event
    useEffect(() => {
        const initialize = async () => {
            const gameID = playerInfo?.gameID;
            if (gameID) {
                const accessToken = getCookie(keys.auth);
                if (!accessToken) {
                    window.location.href = '/auth/login';
                    return;
                }

                try {
                    await axios.get(`${config.api}/game/state/${gameID}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    sendJsonMessage({
                        type: 'join_game',
                        gameID,
                    });
                    sendJsonMessage({
                        type: 'player_ready',
                        gameID,
                    });
                } catch (err) {
                    console.warn(err);
                    window.location.href = '/';
                }
            }
        };

        initialize();
    }, [playerInfo]);

    // Listen for any new messages
    useEffect(() => {
        if (lastMessage) {
            console.log(`Got a new message: ${lastMessage?.data}`);
        }

        if (
            playerInfo &&
            lastJsonMessage != null &&
            Object.keys(lastJsonMessage as WSStartMessage).length != 0
        ) {
            const socketMessage = lastJsonMessage as WSStartMessage;

            console.log(`Got new json message:`, socketMessage);
            if (socketMessage.type == 'game_start') {
                const game = socketMessage.game;
                const parsedGame: ChessGame = {
                    whitePlayer: JSON.parse(game.whitePlayer) as Player,
                    blackPlayer: JSON.parse(game.blackPlayer) as Player,
                    state: JSON.parse(game.state),
                    duration: game.duration,
                };

                console.log('game duration:', parsedGame.duration);

                // console.log('game:', parsedGame);

                setPlayerColor(
                    parsedGame.whitePlayer.username == playerInfo.username
                        ? 'w'
                        : 'b'
                );

                setWhoseTurn(parsedGame.state.turn);
                setGameTime((prevTime) => ({
                    ...prevTime,
                    white: parsedGame.duration,
                    black: parsedGame.duration,
                    isWhitePaused: parsedGame.state.turn === 'b',
                    isBlackPaused: parsedGame.state.turn === 'w',
                }));
                setFen(parsedGame.state.fen);
                setGame(parsedGame);
                
                console.log('updated game time.');
                setIsReady(true);
            } else if (
                socketMessage.type == 'move' ||
                socketMessage.type == 'move_accepted'
            ) {
                const moveMsg = lastJsonMessage as WSMoveMessage;
                // forcing this assertion could be dangerous...
                const newGameState: ChessGame = {
                    duration: moveMsg.duration,
                    whitePlayer: game!.whitePlayer,
                    blackPlayer: game!.blackPlayer,
                    state: moveMsg.state,
                };

                console.log('new state', newGameState);

                setWhoseTurn(newGameState.state.turn);
                setGameTime((prevTime) => ({
                    ...prevTime,
                    white: moveMsg.state.whiteTTP,
                    black: moveMsg.state.blackTTP,
                    isWhitePaused: moveMsg.state.turn === 'b',
                    isBlackPaused: moveMsg.state.turn === 'w',
                }));
                setFen(newGameState.state.fen);
                setGame(newGameState);
            }
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

    function makeMove(move: BoardMove) {
        if (playerInfo) {
            console.log('gameID:', playerInfo.gameID);
            sendJsonMessage({
                type: 'move',
                data: {
                    gameID: playerInfo.gameID,
                    username: playerInfo?.username,
                    whiteTTP: gameTime.white,
                    blackTTP: gameTime.black,
                    ...move,
                },
            });
        }
    }

    return (
        <>
            {!playerInfo ||
            !isReady ||
            !game ||
            !fen ||
            !playerColor ||
            isNaN(gameTime.white) ||
            isNaN(gameTime.black) ? (
                <></>
            ) : (
                <>
                    <header className="w-full flex items-center justify-center mt-4">
                        <Header />
                    </header>
                    <section className="flex flex-col md:grid grid-cols-4 gap-2 mx-auto w-[calc(100%-16px)] py-2 !max-w-[1400px]">
                        <GameStatsBar
                            whoseTurn={whoseTurn}
                            gameType={game.state.gameType}
                            duration={game.state.duration}
                            gameTime={gameTime}
                            setGameTime={setGameTime}
                            whitePlayerName={game.whitePlayer.username}
                            blackPlayerName={game.blackPlayer.username}
                        />

                        <ClickableChessboard
                            playerColor={playerColor}
                            onMoveCompleted={(history) =>
                                updateMoveHistory(history)
                            }
                            setWhoseTurn={(color) => setWhoseTurn(color)}
                            onMoveComplete={(move) => makeMove(move)}
                            fen={fen}
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
