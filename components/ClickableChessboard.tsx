'use client';

import { Chess, Square, Move, PieceSymbol } from 'chess.js';
import { useEffect, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import {
    Piece as ChessPiece,
    // CustomPieces,
    PromotionPieceOption,
} from 'react-chessboard/dist/chessboard/types';
import { CSSProperties } from 'react';

interface IChessMove {
    from: string;
    to: string;
    promotion?: string;
}

type SquareStyles = Record<Square, CSSProperties>;

export default function ClickableChessboard() {
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

    // const pieces: ChessPiece[] = useMemo(
    //     () => [
    //         'wP',
    //         'wN',
    //         'wB',
    //         'wR',
    //         'wQ',
    //         'wK',
    //         'bP',
    //         'bN',
    //         'bB',
    //         'bR',
    //         'bQ',
    //         'bK',
    //     ],
    //     []
    // );

    // const customPieces = useMemo(() => {
    //     const pieceComponents: CustomPieces = {};
    //     pieces.forEach((piece) => {
    //         pieceComponents[piece] = ({
    //             squareWidth,
    //         }: {
    //             squareWidth: number;
    //         }) => (
    //             <div
    //                 style={{
    //                     width: squareWidth,
    //                     height: squareWidth,
    //                     backgroundImage: `url(/pieces/${piece}.png)`,
    //                     backgroundSize: '100%',
    //                 }}
    //             />
    //         );
    //     });
    //     return pieceComponents;
    // }, [pieces]);

    // Click Logic
    function getMoveOptions(square: Square) {
        const moves = game.moves({ square, verbose: true });
        if (moves.length === 0) {
            setOptionSquares({} as SquareStyles);
            return false;
        }

        const newSquares: SquareStyles = {} as SquareStyles;
        moves.forEach((move: Move) => {
            newSquares[move.to] = {
                background:
                    game.get(move.to)?.color !== game.get(square)?.color
                        ? 'radial-gradient(circle, rgba(0,0,0,.1) 20%, transparent 20%)'
                        : 'radial-gradient(circle, rgba(0,0,0,.1) 20%, transparent 20%)',
                borderRadius: '50%',
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
        if (!moveFrom) {
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) setMoveFrom(square);
            return;
        }

        if (!moveTo) {
            const moves = game.moves({ square: moveFrom, verbose: true });
            const foundMove = moves.find(
                (m) => m.from === moveFrom && m.to === square
            );
            if (!foundMove) {
                const hasMoveOptions = getMoveOptions(square);
                setMoveFrom(hasMoveOptions ? square : '');
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
                const hasMoveOptions = getMoveOptions(square);
                if (hasMoveOptions) setMoveFrom(square);
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

    function onSquareRightClick(square: Square) {
        const color = 'rgba(0, 0, 255, 0.4)';
        setRightClickedSquares((prev) => ({
            ...prev,
            [square]:
                prev[square]?.backgroundColor === color
                    ? undefined
                    : { backgroundColor: color },
        }));
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
        if (move === null) return false; // illegal move
        return true;
    }

    const findKingSquare = (color: 'w' | 'b'): Square | null => {
        const board = game.board();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece && piece.type === 'k' && piece.color === color) {
                    const file = String.fromCharCode(97 + j);
                    const rank = 8 - i; // Convert 0-7 to 8-1
                    return `${file}${rank}` as Square;
                }
            }
        }
        return null;
    };

    useEffect(() => {
        const newSquares: SquareStyles = {} as SquareStyles;

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
        <div className="w-screen lg:w-[1024px] max-w-screen-lg mx-auto">
            <Chessboard
                position={game.fen()}
                arePiecesDraggable={true}
                onPieceDrop={onPieceDrop}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                onPromotionPieceSelect={onPromotionPieceSelect}
                // customPieces={customPieces}
                showPromotionDialog={showPromotionDialog}
                customDropSquareStyle={{
                    boxShadow: 'inset 0 0 1px 6px rgba(100,252,108,0.75)',
                }}
                customDarkSquareStyle={{
                    backgroundColor: '#727B8B',
                }}
                customLightSquareStyle={{
                    backgroundColor: '#BDC8DA',
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
