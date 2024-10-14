import { keys } from '@/config/keys';
import IPlayer from '@/global/i.player';
import React, { useContext, useEffect, useState } from 'react';
import { PlayerContext } from './context';

interface IPlayerProviderProps {
    children: React.ReactNode;
}

export const PlayerProvider = ({ children }: IPlayerProviderProps) => {
    const [player, setPlayer] = useState<IPlayer | null>(null);

    useEffect(() => {
        try {
            const storedPlayer = localStorage.getItem(keys.user);
            if (storedPlayer) {
                setPlayer(JSON.parse(storedPlayer));
            }
        } catch (error) {
            console.error('Failed to parse player from localStorage:', error);
        }
    }, []);

    return (
        <PlayerContext.Provider value={{ player, setPlayer }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
