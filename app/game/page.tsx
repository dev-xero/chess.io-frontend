'use client';

import { Chess } from 'chess.js';
import { useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import {
    Piece as ChessPiece,
    CustomPieces,
} from 'react-chessboard/dist/chessboard/types';

interface IChessMove {
    from: string;
    to: string;
    promotion?: string;
}

export default function Page() {
    const [game, setGame] = useState<Chess>(new Chess());
    const pieces: ChessPiece[] = [
        'wP',
        'wN',
        'wB',
        'wR',
        'wQ',
        'wK',
        'bP',
        'bN',
        'bB',
        'bR',
        'bQ',
        'bK',
    ];

    const customPieces = useMemo(() => {
        const pieceComponents: CustomPieces = {};

        pieces.forEach((piece) => {
            pieceComponents[piece] = ({
                squareWidth,
            }: {
                squareWidth: number;
            }) => (
                <div
                    style={{
                        width: squareWidth,
                        height: squareWidth,
                        backgroundImage: `url(/pieces/${piece}.png)`,
                        backgroundSize: '100%',
                    }}
                />
            );
        });

        return pieceComponents;
    }, []);

    function makeAMove(move: IChessMove) {
        const gameCopy: Chess = new Chess(game.fen());
        try {
            const result = gameCopy.move(move);
            setGame(gameCopy);
            return result;
        } catch (err) {
            console.warn(err);
            return null;
        }
    }

    function onDrop(sourceSquare: string, targetSquare: string, piece: string) {
        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: piece.toLowerCase() ?? 'q',
        });
        if (move === null) return false; // illegal move
        return true;
    }

    return (
        <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            customPieces={customPieces}
            showPromotionDialog={true}
            customDropSquareStyle={{
                // backgroundColor: '#4F90F0AA',
                boxShadow: 'inset 0 0 1px 6px rgba(100,252,108,0.75)',
            }}
            customDarkSquareStyle={{
                backgroundColor: '#727B8B',
            }}
            customLightSquareStyle={{
                backgroundColor: '#BDC8DA',
            }}
        />
    );
}
