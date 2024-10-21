'use client';

import { keys } from '@/config/keys';
import CenteredGrid from '@/layout/CenteredGrid';
import { useEffect, useState } from 'react';
import config from '@/config/config';
import useWebSocket from '@/hooks/useSocket';
import ProtectedPage from '@/components/ProtectedPage';

interface IPendingChallenge {
    link: string;
    expiresIn: number;
}

export default function Page() {
    const [pendingChallenge, setPendingChallenge] =
        useState<IPendingChallenge | null>(null);
    const [userID, setUserID] = useState<string | null>(null);

    useEffect(() => {
        const currentUser = localStorage.getItem(keys.user);
        if (!currentUser) {
            window.location.href = '/auth/login';
            return;
        }

        const userData = JSON.parse(currentUser);
        setUserID(userData.id);

        const theChallenge = JSON.parse(
            localStorage.getItem(keys.game.pending) ?? '{}'
        );
        if (!theChallenge) {
            window.location.href = '/';
            return;
        }

        setPendingChallenge(theChallenge);
    }, []);

    const { isConnected, message } = useWebSocket(userID);

    useEffect(() => {
        console.log("isConnected:", isConnected);
        if (message) {
            console.log('new message received:', message);
        }
    }, [message]);

    return (
        <ProtectedPage>
            <CenteredGrid>
                <section className="w-screen md:w-[512px] max-w-lg flex flex-col items-center py-2 px-4 relative">
                    <section className="text-center flex flex-col mt-8">
                        <h2 className="font-bold mb-2 text-2xl">
                            Challenge Pending
                        </h2>
                        <p className="text-faded">
                            We&apos;re waiting for someone to accept this
                            challenge, you can share this link with your
                            friends.
                        </p>
                        {pendingChallenge && (
                            <>
                                <a
                                    className="my-4 text-sm text-primary"
                                    href={`${config.url}/challenge/${pendingChallenge.link}`}
                                    target="_blank"
                                >
                                    {config.url}/challenge/
                                    {pendingChallenge.link}
                                </a>
                                <p className="mt-2 text-faded">
                                    This challenge will expire in{' '}
                                    {pendingChallenge.expiresIn}
                                </p>
                            </>
                        )}
                    </section>
                </section>
            </CenteredGrid>
        </ProtectedPage>
    );
}
