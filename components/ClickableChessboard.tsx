'use client';

import { Chess, Square, Move, PieceSymbol } from 'chess.js';
import { useCallback, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { PromotionPieceOption } from 'react-chessboard/dist/chessboard/types';

type ChessSquareStyle = Record<string, string | number>;
type CustomSquareStyles = Record<string, ChessSquareStyle>;

const INITIAL_SQUARE_STYLES: CustomSquareStyles = {};

interface IChessBoardInterface {
    onMoveCompleted(history: string[]): void;
    setWhoseTurn(color: 'w' | 'b'): void;
}

interface SquareState {
    moveSquares: CustomSquareStyles;
    optionSquares: CustomSquareStyles;
    rightClickedSquares: CustomSquareStyles;
}

export default function ClickableChessboard(props: IChessBoardInterface) {
    const gameRef = useRef<Chess>(new Chess());
    const [moveFrom, setMoveFrom] = useState<Square | ''>('');
    const [moveTo, setMoveTo] = useState<Square | null>(null);
    const [showPromotionDialog, setShowPromotionDialog] =
        useState<boolean>(false);
    const [boardPosition, setBoardPosition] = useState<string>(
        gameRef.current.fen()
    );

    const [squareStyles, setSquareStyles] = useState<SquareState>({
        moveSquares: INITIAL_SQUARE_STYLES,
        optionSquares: INITIAL_SQUARE_STYLES,
        rightClickedSquares: INITIAL_SQUARE_STYLES,
    });

    const getMoveOptions = useCallback((square: Square) => {
        const game = gameRef.current;
        const moves = game.moves({ square, verbose: true });

        if (moves.length === 0) {
            setSquareStyles((prev) => ({
                ...prev,
                optionSquares: {},
            }));
            return false;
        }

        const newSquares: CustomSquareStyles = {};
        moves.forEach((move: Move) => {
            const targetPiece = game.get(move.to as Square);
            const isCapture =
                targetPiece && targetPiece.color !== game.get(square)?.color;

            newSquares[move.to] = {
                background: isCapture
                    ? 'rgba(252,181,100,0.75)'
                    : 'radial-gradient(circle, rgba(0,0,0,.2) 20%, transparent 20%)',
                borderRadius: isCapture ? '0' : '50',
            };
        });

        newSquares[square] = {
            background: 'rgba(100,252,108,0.75)',
        };

        setSquareStyles((prev) => ({
            ...prev,
            optionSquares: newSquares,
        }));

        return true;
    }, []);

    const findKingSquare = useCallback((color: 'w' | 'b'): Square | null => {
        const board = gameRef.current.board();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece && piece.type === 'k' && piece.color === color) {
                    return `${String.fromCharCode(97 + j)}${8 - i}` as Square;
                }
            }
        }
        return null;
    }, []);

    const makeMove = useCallback(
        (from: Square, to: Square, promotion?: PieceSymbol) => {
            const game = gameRef.current;
            try {
                const move = game.move({ from, to, promotion });
                if (move) {
                    setBoardPosition(game.fen());
                    props.onMoveCompleted(game.history());
                    props.setWhoseTurn(game.turn());

                    // Update king in check highlight
                    if (game.inCheck()) {
                        const kingSquare = findKingSquare(game.turn());
                        if (kingSquare) {
                            const newMoveSquares = { ...INITIAL_SQUARE_STYLES };
                            newMoveSquares[kingSquare] = {
                                backgroundColor: 'rgba(255, 0, 0, 0.4)',
                            };
                            setSquareStyles((prev) => ({
                                ...prev,
                                moveSquares: newMoveSquares,
                            }));
                        }
                    } else {
                        setSquareStyles((prev) => ({
                            ...prev,
                            moveSquares: { ...INITIAL_SQUARE_STYLES },
                        }));
                    }
                    return true;
                }
            } catch (err) {
                console.warn(err);
            }
            return false;
        },
        [props, findKingSquare]
    );

    const onSquareClick = useCallback(
        (square: Square) => {
            const game = gameRef.current;
            setSquareStyles((prev) => ({
                ...prev,
                rightClickedSquares: { ...INITIAL_SQUARE_STYLES },
            }));

            const piece = game.get(square);
            const isCurrentTurnPiece = piece && piece.color === game.turn();

            if (!moveFrom) {
                if (isCurrentTurnPiece) {
                    const hasMoveOptions = getMoveOptions(square);
                    if (hasMoveOptions) setMoveFrom(square);
                }
                return;
            }

            if (!moveTo) {
                const moves = game.moves({ square: moveFrom, verbose: true });
                const foundMove = moves.find(
                    (m) => m.from === moveFrom && m.to === square
                );

                if (!foundMove) {
                    if (isCurrentTurnPiece) {
                        const hasMoveOptions = getMoveOptions(square);
                        setMoveFrom(hasMoveOptions ? square : '');
                    }
                    return;
                }

                setMoveTo(square);

                if (
                    foundMove &&
                    ((foundMove.color === 'w' &&
                        foundMove.piece === 'p' &&
                        square[1] === '8') ||
                        (foundMove.color === 'b' &&
                            foundMove.piece === 'p' &&
                            square[1] === '1'))
                ) {
                    setShowPromotionDialog(true);
                    return;
                }

                if (makeMove(moveFrom, square)) {
                    setMoveFrom('');
                    setMoveTo(null);
                    setSquareStyles((prev) => ({
                        ...prev,
                        optionSquares: { ...INITIAL_SQUARE_STYLES },
                    }));
                }
            }
        },
        [moveFrom, moveTo, getMoveOptions, makeMove]
    );

    const onPromotionPieceSelect = useCallback(
        (piece?: PromotionPieceOption) => {
            if (piece && moveFrom && moveTo) {
                makeMove(
                    moveFrom,
                    moveTo,
                    piece[1].toLowerCase() as PieceSymbol
                );
            }
            setMoveFrom('');
            setMoveTo(null);
            setShowPromotionDialog(false);
            setSquareStyles((prev) => ({
                ...prev,
                optionSquares: { ...INITIAL_SQUARE_STYLES },
            }));
            return true;
        },
        [moveFrom, moveTo, makeMove]
    );

    const onPieceDrop = useCallback(
        (sourceSquare: string, targetSquare: string, piece: string) => {
            return makeMove(
                sourceSquare as Square,
                targetSquare as Square,
                piece.toLowerCase().charAt(1) as PieceSymbol
            );
        },
        [makeMove]
    );

    return (
        <div className="w-full max-w-screen-lg mx-auto col-span-2 order-1 md:order-2">
            <Chessboard
                position={boardPosition}
                animationDuration={200}
                arePiecesDraggable={true}
                onPieceDrop={onPieceDrop}
                onSquareClick={onSquareClick}
                onPromotionPieceSelect={onPromotionPieceSelect}
                showPromotionDialog={showPromotionDialog}
                customDropSquareStyle={{
                    boxShadow: 'inset 0 0 1px 6px rgba(100,252,108,0.75)',
                }}
                customDarkSquareStyle={{ backgroundColor: '#485A75' }}
                customLightSquareStyle={{ backgroundColor: '#ADC0DC' }}
                customSquareStyles={{
                    ...(squareStyles.moveSquares as CustomSquareStyles),
                    ...(squareStyles.optionSquares as CustomSquareStyles),
                    ...(squareStyles.rightClickedSquares as CustomSquareStyles),
                }}
                promotionToSquare={moveTo}
            />
        </div>
    );
}
