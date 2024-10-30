'use client';

import { keys } from '@/config/keys';
import CenteredGrid from '@/layout/CenteredGrid';
import { useEffect, useState } from 'react';
import config from '@/config/config';
import ProtectedPage from '@/components/ProtectedPage';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import NotificationCard from '@/components/ui/NotificationCard';

interface IPendingChallenge {
    link: string;
    challenger: string;
    expiresIn: number;
}

export default function Page() {
    const [pendingChallenge, setPendingChallenge] =
        useState<IPendingChallenge | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [userID, setUserID] = useState<string | null>(null);
    const [challengeLink, setChallengeLink] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
        config.ws,
        {
            share: false,
            shouldReconnect: () => true,
        }
    );

    async function handleLinkShare(link: string) {
        try {
            await navigator.clipboard.writeText(link);

            setIsVisible(true);

            const timer = setTimeout(() => {
                setIsVisible(false);
                clearTimeout(timer);
            }, 1000);
        } catch (err) {
            console.error(err);
            alert('Failed to copy to clipboard.');
        }
    }

    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        const currentUser = localStorage.getItem(keys.user);
        if (!currentUser) {
            window.location.href = '/auth/login';
            return;
        }

        const userData = JSON.parse(currentUser);
        setUserID(userData.id);

        const createdChallenge = JSON.parse(
            localStorage.getItem(keys.game.pending) ?? '{}'
        );

        if (!createdChallenge) {
            window.location.href = '/';
            return;
        }

        // check that the challenge still exists here

        setPendingChallenge(createdChallenge);
        setChallengeLink(`${config.url}/challenge/${createdChallenge.link}`);
    }, []);

    // Websocket authentication
    useEffect(() => {
        console.log('Connection state changed.');
        if (readyState == ReadyState.OPEN && userID) {
            sendJsonMessage({
                type: 'auth',
                userId: userID,
            });
        }
    }, [readyState]);

    useEffect(() => {
        console.log(`Got a new message: ${lastMessage?.data}`);
        try {
            const socketMsg = JSON.parse(lastMessage?.data);
            if (socketMsg.type == 'challenge_accepted') {
                const gameID = socketMsg.gameID.split(':')[1];
                localStorage.setItem(
                    keys.game.active,
                    JSON.stringify(socketMsg.gameState)
                );

                console.log('game started successfully.');
                window.location.href = `/game/${gameID}`;
            }
        } catch {
            console.warn('Not JSON parsable.');
        }
    }, [lastMessage]);

    return (
        <ProtectedPage>
            <CenteredGrid>
                {isMounted && (
                    <section className="w-screen md:w-[512px] max-w-lg flex flex-col items-center py-2 px-4 relative">
                        <section className="text-center flex flex-col mt-8">
                            <h2 className="font-bold mb-2 text-2xl">
                                Challenge Pending
                            </h2>
                            <p className="text-faded">
                                Waiting for someone to accept this challenge.
                            </p>
                            {pendingChallenge && (
                                <>
                                    <p
                                        className="my-4 underline underline-offset-4 text-sm text-primary cursor-pointer"
                                        onClick={async () =>
                                            await handleLinkShare(challengeLink)
                                        }
                                    >
                                        copy this challenge link
                                    </p>
                                    <p className="mt-6 text-faded text-xs">
                                        This challenge will expire in{' '}
                                        {pendingChallenge.expiresIn}
                                    </p>
                                </>
                            )}
                        </section>
                        {isVisible && (
                            <NotificationCard
                                type="Success"
                                text="Successfully copied."
                                className="fixed bottom-4"
                            />
                        )}
                    </section>
                )}
            </CenteredGrid>
        </ProtectedPage>
    );
}
