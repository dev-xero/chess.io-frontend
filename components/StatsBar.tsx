import React from 'react';

interface ICardProps {
    children: React.ReactNode;
}

function Card({ children }: ICardProps) {
    return <div className="bg-base rounded-md p-4 w-full mb-2">{children}</div>;
}

export default function StatsBar() {
    return (
        <aside className="col-span-1">
            <Card>
                <h3>Rapid Game</h3>
                <p>Time Limit: 10mins</p>
            </Card>
            <Card>
                <h3>AlgoXero vs Halflife</h3>
                <p>White to play</p>
            </Card>
        </aside>
    );
}
