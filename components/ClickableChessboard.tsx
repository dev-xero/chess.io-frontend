'use client';

import { Chess, Square, Move, PieceSymbol } from 'chess.js';
import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { PromotionPieceOption } from 'react-chessboard/dist/chessboard/types';
import { CSSProperties } from 'react';

interface IChessMove {
    from: string;
    to: string;
    promotion?: string;
}

type SquareStyles = Record<Square, CSSProperties>;

interface IChessBoardInterface {
    onMoveCompleted(history: string[]): void;
    setWhoseTurn(color: 'w' | 'b'): void;
}

export default function ClickableChessboard(props: IChessBoardInterface) {
    const [game, setGame] = useState<Chess>(new Chess());
    const [moveFrom, setMoveFrom] = useState<Square | ''>('');
    const [moveTo, setMoveTo] = useState<Square | null>(null);
    const [showPromotionDialog, setShowPromotionDialog] =
        useState<boolean>(false);
    const [rightClickedSquares, setRightClickedSquares] = useState<
        Record<Square, { backgroundColor: string } | undefined>
    >({} as Record<Square, { backgroundColor: string } | undefined>);
    const [moveSquares, setMoveSquares] = useState<SquareStyles>(
        {} as SquareStyles
    );
    const [optionSquares, setOptionSquares] = useState<SquareStyles>(
        {} as SquareStyles
    );

    function getMoveOptions(square: Square) {
        const moves = game.moves({ square, verbose: true });
        if (moves.length === 0) {
            setOptionSquares({} as SquareStyles);
            return false;
        }

        const newSquares: SquareStyles = {} as SquareStyles;
        moves.forEach((move: Move) => {
            const targetPiece = game.get(move.to as Square);
            const isCapture =
                targetPiece && targetPiece.color !== game.get(square)?.color;
            newSquares[move.to] = {
                background: isCapture
                    ? 'rgba(252,181,100,0.75)'
                    : 'radial-gradient(circle, rgba(0,0,0,.1) 20%, transparent 20%)',
                borderRadius: isCapture ? '0%' : '50%',
            };
        });
        newSquares[square] = {
            background: 'rgba(100,252,108,0.75)',
        };
        setOptionSquares(newSquares);
        return true;
    }

    function onSquareClick(square: Square) {
        setRightClickedSquares(
            {} as Record<Square, { backgroundColor: string } | undefined>
        );

        const piece = game.get(square as Square);
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

            const gameCopy = new Chess(game.fen());
            const move = gameCopy.move({
                from: moveFrom,
                to: square,
                promotion: 'q',
            });

            if (move === null) {
                if (isCurrentTurnPiece) {
                    const hasMoveOptions = getMoveOptions(square);
                    if (hasMoveOptions) setMoveFrom(square);
                }
                return;
            }

            setGame(gameCopy);
            setMoveFrom('');
            setMoveTo(null);
            setOptionSquares({} as SquareStyles);
        }
    }

    function onPromotionPieceSelect(piece?: PromotionPieceOption) {
        if (piece && moveFrom && moveTo) {
            const gameCopy = new Chess(game.fen());
            gameCopy.move({
                from: moveFrom,
                to: moveTo,
                promotion: piece[1].toLowerCase() as PieceSymbol,
            });
            setGame(gameCopy);
        }
        setMoveFrom('');
        setMoveTo(null);
        setShowPromotionDialog(false);
        setOptionSquares({} as SquareStyles);
        return true;
    }

    function makeADropMove(move: IChessMove) {
        const gameCopy = Object.assign(
            Object.create(Object.getPrototypeOf(game)),
            game
        );

        try {
            const result = gameCopy.move(move);
            setGame(gameCopy);
            return result;
        } catch (err) {
            console.warn(err);
            return null;
        } finally {
            setMoveFrom('');
            setMoveTo(null);
            setOptionSquares({} as SquareStyles);
        }
    }

    function onPieceDrop(
        sourceSquare: string,
        targetSquare: string,
        piece: string
    ) {
        const move = makeADropMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: piece.toLowerCase().charAt(1) ?? 'q',
        });
        if (move === null) return false;
        return true;
    }

    const findKingSquare = (color: 'w' | 'b'): Square | null => {
        const board = game.board();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece && piece.type === 'k' && piece.color === color) {
                    const file = String.fromCharCode(97 + j);
                    const rank = 8 - i;
                    return `${file}${rank}` as Square;
                }
            }
        }
        return null;
    };

    useEffect(() => {
        const newSquares: SquareStyles = {} as SquareStyles;
        props.onMoveCompleted(game.history());
        props.setWhoseTurn(game.turn());

        if (game.inCheck()) {
            const kingSquare = findKingSquare(game.turn());
            if (kingSquare) {
                newSquares[kingSquare] = {
                    backgroundColor: 'rgba(255, 0, 0, 0.4)',
                };
                setMoveSquares(newSquares);
            }
        } else {
            setMoveSquares({} as SquareStyles);
        }
    }, [game]);

    return (
        <div className="w-full max-w-screen-lg mx-auto col-span-2 order-1 md:order-2">
            <Chessboard
                position={game.fen()}
                animationDuration={200}
                arePiecesDraggable={true}
                onPieceDrop={onPieceDrop}
                onSquareClick={onSquareClick}
                onPromotionPieceSelect={onPromotionPieceSelect}
                showPromotionDialog={showPromotionDialog}
                customDropSquareStyle={{
                    boxShadow: 'inset 0 0 1px 6px rgba(100,252,108,0.75)',
                }}
                customDarkSquareStyle={{
                    backgroundColor: '#485A75',
                }}
                customLightSquareStyle={{
                    backgroundColor: '#ADC0DC',
                }}
                customSquareStyles={{
                    ...moveSquares,
                    ...optionSquares,
                    ...rightClickedSquares,
                }}
                promotionToSquare={moveTo}
            />
        </div>
    );
}
