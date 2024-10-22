'use client';

import { keys } from '@/config/keys';
import { useState, useEffect } from 'react';
import CenteredGrid from '@/layout/CenteredGrid';
import useWebSocket from '@/hooks/useSocket';
import ProtectedPage from '@/components/ProtectedPage';
import { useRouter } from 'next/router'

export default function Page() {
    const [userID, setUserID] = useState<string | null>(null);
    const { asPath } = useRouter()

    useEffect(() => {
        const currentUser = localStorage.getItem(keys.user);
        if (!currentUser) {
            window.location.href = '/auth/login';
            return;
        }

        const userData = JSON.parse(currentUser);
        setUserID(userData.id);
    }, []);

    const { isConnected, sendMessage } = useWebSocket(userID);

    useEffect(() => {
        console.log('isConnected:', isConnected);

        if (isConnected) {
            const gameId = asPath.split("/");
            console.log(gameId);
            // sendMessage({
            //     type: "join_game",
            //     gameId: ''
            // })
        }
    }, []);

    return (
        <ProtectedPage>
            <CenteredGrid>
                <section className="w-screen md:w-[512px] max-w-lg flex flex-col items-center py-2 px-4 relative">
                    <section className="text-center flex flex-col mt-8">
                        <h2 className="font-bold mb-2 text-2xl">
                            Challenge Pending
                        </h2>
                    </section>
                </section>
            </CenteredGrid>
        </ProtectedPage>
    );
}
