'use client';

import Header from '@/components/Header';
import Marker from '@/components/Marker';
import CenteredGrid from '@/layout/CenteredGrid';
import IPlayer from '@/global/i.player';
import { useContext, useState, useEffect } from 'react';
import { PlayerContext } from '@/providers/player/context';
import LoadingFragment from '@/fragments/LoadingFragment';
import IconButton from '@/components/IconButton';
import ChallengeIcon from '@/components/ChallengeIcon';
import { ChartLineUp, SignOut } from '@phosphor-icons/react';
import config from '@/config/config'

export default function HomeFragment() {
    const { player } = useContext(PlayerContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (player !== null) {
            setIsLoading(false);
        }
    }, [player]);

    if (isLoading) {
        return <LoadingFragment />;
    }

    return (
        <CenteredGrid>
            <main className="w-full md:w-[512px] max-w-lg flex flex-col items-center py-2 px-4 relative">
                <Marker />
                <Header />
                {/* INFO SECTION */}
                <section className="text-center flex items-center gap-2 mt-8">
                    <p className="font-bold mb-2 text-base">
                        Logged in as:{' '}
                        <span className="!font-normal text-primary">
                            @{(player as IPlayer).username}
                        </span>
                    </p>
                    <p className="font-bold mb-2 text-base">
                        Rating:{' '}
                        <span className="!font-normal text-primary">
                            {(player as IPlayer).rating}
                        </span>
                    </p>
                </section>
                {/* CHALLENGE / ANALYTICS / LOGOUT */}
                <section className="w-full my-4 flex flex-col gap-1">
                    <IconButton
                        label="New Challenge"
                        onClick={() => {}}
                        isDisabled={false}
                        icon={<ChallengeIcon size={24} />}
                        secondary={false}
                    />
                    <IconButton
                        label="Analytics"
                        onClick={() => {}}
                        isDisabled={false}
                        icon={<ChartLineUp size={24} />}
                        secondary={true}
                    />
                    <IconButton
                        label="Logout"
                        onClick={() => {}}
                        isDisabled={false}
                        icon={<SignOut size={24} />}
                        secondary={true}
                    />
                </section>
                <p className="my-2 text-xs text-faded">Version {config.version}</p>
            </main>
        </CenteredGrid>
    );
}
