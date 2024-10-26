export default interface ChessState {
    fen: string;
    pgn: string;
    whiteTTP: number;
    blackTTP: number;
    gameType: "Rapid" | "Bullet" | "Blitz"
    inCheck: boolean;
    isCheckmate: boolean;
    isDraw: boolean;
    isGameOver: boolean;
    turn: "w" | "b"
}

export default interface ChessGame {
   whitePlayer: string;
   blackPlayer: string;
   state: ChessState;
}