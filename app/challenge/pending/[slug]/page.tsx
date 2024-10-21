'use client';

import { keys } from '@/config/keys';
import CenteredGrid from '@/layout/CenteredGrid';
import { useEffect, useState } from 'react';
import config from '@/config/config';

interface IPendingChallenge {
    link: string;
    expiresIn: number;
}

export default function Page() {
    const [pendingChallenge, setPendingChallenge] =
        useState<IPendingChallenge | null>(null);

    useEffect(() => {
        const theChallenge = JSON.parse(
            localStorage.getItem(keys.game.pending) ?? '{}'
        );
        if (!theChallenge) {
            window.location.href = '/';
        }

        setPendingChallenge(theChallenge);
    }, [pendingChallenge]);

    return (
        <CenteredGrid>
            <section className="w-screen md:w-[512px] max-w-lg flex flex-col items-center py-2 px-4 relative">
                <section className="text-center flex flex-col mt-8">
                    <h2 className="font-bold mb-2 text-2xl">
                        Challenge Pending
                    </h2>
                    <p className="text-faded">
                        We&apos;re waiting for someone to accept this challenge,
                        you can share this link with your friends.
                    </p>
                    {pendingChallenge && (
                        <>
                            <a
                                className="my-4 text-sm text-primary"
                                href={`${config.url}/challenge/${pendingChallenge.link}`}
                                target="_blank"
                            >
                                {config.url}/challenge/{pendingChallenge.link}
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
    );
}
