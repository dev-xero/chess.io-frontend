'use client';

import { keys } from '@/config/keys';
import { useState, useEffect, useCallback } from 'react';
import CenteredGrid from '@/layout/CenteredGrid';
import Error from '@/components/Error';
import useWebSocket from '@/hooks/useSocket';
import ProtectedPage from '@/components/ProtectedPage';
import { usePathname } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '@/util/error';
import config from '@/config/config';
import { getCookie } from 'cookies-next';
import NetworkConfig from '@/config/http';

export default function Page() {
    const [userID, setUserID] = useState<string | null>(null);
    const [error, setError] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        const currentUser = localStorage.getItem(keys.user);
        if (!currentUser) {
            window.location.href = '/auth/login';
            return;
        }

        const userData = JSON.parse(currentUser);
        setUserID(userData.id);
    }, []);

    const { isConnected } = useWebSocket(userID);

    const acceptChallenge = useCallback(async (gameId: string) => {
        const accessToken = getCookie(keys.auth);
        if (!accessToken) {
            setError('Session has expired, log in again.');
            window.location.href = '/auth/login';
            return;
        }

        try {
            const { data } = await axios.post(
                `${config.api}/challenge/accept/${gameId}`,
                {},
                {
                    headers: {
                        ...NetworkConfig.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(data);
        } catch (err) {
            const axiosError = err as AxiosError;
            if (axiosError.response) {
                console.warn(axiosError.response);
                const error =
                    ((err as AxiosError).response?.data as ErrorResponse)?.[
                        'message'
                    ] ?? 'Could not accept this challenge link.';
                setError(error);
            } else {
                setError('An unknown error occurred.');
            }
        }
    }, []);

    useEffect(() => {
        console.log('isConnected:', isConnected);

        if (isConnected) {
            const parts = pathname.split('/');
            if (parts.length != 4) {
                window.location.href = '/challenge/create';
                return;
            }
            const gameId = parts[3];
            console.log('gameId:', gameId);
            acceptChallenge(gameId);
        }
    }, [isConnected, pathname, acceptChallenge]);

    return (
        <ProtectedPage>
            <CenteredGrid>
                <section className="w-screen md:w-[512px] max-w-lg flex flex-col items-center py-2 px-4 relative">
                    <section className="text-center flex flex-col mt-8">
                        <h2 className="font-bold mb-2 text-2xl">
                            Accept this challenge
                        </h2>
                        <Error err={error} />
                    </section>
                </section>
            </CenteredGrid>
        </ProtectedPage>
    );
}
