import React from 'react';

interface ICenteredGridProps {
    children: React.ReactNode;
}

export default function CenteredGrid({ children }: ICenteredGridProps) {
    return (
        <main className="w-full h-full grid place-items-center">
            {children}
        </main>
    );
}