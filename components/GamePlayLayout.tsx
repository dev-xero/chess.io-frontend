import ClickableChessboard from './ClickableChessboard';
import GameHistoryBar from './GameHistoryBar';
import StatsBar from './StatsBar';

export default function GamePlayLayout() {
    return (
        <section className="grid grid-cols-4 gap-2 mx-auto w-[calc(100%-16px)] py-2 !max-w-[1400px]">
            <StatsBar />
            <ClickableChessboard />
            <GameHistoryBar />
        </section>
    );
}
