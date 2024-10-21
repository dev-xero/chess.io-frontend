'use client';

import ChallengeIcon from '@/components/ChallengeIcon';
import IconButton from '@/components/IconButton';
import TimeControlPill from '@/components/TimeControlPill';
import Error from '@/components/Error';
import { TIME_CONTROL } from '@/config/controls';
import CenteredGrid from '@/layout/CenteredGrid';
import { ErrorResponse } from '@/util/error';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import NetworkConfig from '@/config/http';
import { getCookie } from 'cookies-next';
import { keys } from '@/config/keys';
import config from '@/config/config';
import Success from '@/components/Success';

export default function Page() {
    const [selectedControl, setSelectedControl] = useState(TIME_CONTROL.RAPID);
    const [isPending, setIsPending] = useState(false);
    const [isGameGenerated, setIsGameGenerated] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [afterMessage, setAfterMessage] = useState('');
    const timeControls = [
        { name: 'Rapid', control: TIME_CONTROL.RAPID },
        { name: 'Blitz', control: TIME_CONTROL.BLITZ },
        { name: 'Bullet', control: TIME_CONTROL.BULLET },
    ];

    const displayError = (msg: string) => {
        setError(msg);
        setIsPending(false);
    };

    const handleNewChallengeCreation = async () => {
        setIsPending(true);
        try {
            const loggedInUser = JSON.parse(
                localStorage.getItem(keys.user) ?? '{}'
            );
            if (!loggedInUser) {
                console.warn('Invalid login state.');
                displayError('Invalid login state, please log in again.');
                return;
            }

            const gameDuration = parseInt(selectedControl) * 60;
            console.log('game duration:', gameDuration);

            const accessToken = getCookie(keys.auth);
            const { data } = await axios.post(
                `${config.api}/challenge/create?duration=${gameDuration}`,
                {
                    username: '',
                },
                {
                    headers: {
                        ...NetworkConfig.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            // console.log(data);
            setIsGameGenerated(true);
            const { expiresIn, link } = data.payload;
            setSuccess(`${config.url}/challenge/${link}`);
            setAfterMessage(`This link expires in ${expiresIn}`);
        } catch (err) {
            const axiosError = err as AxiosError;
            if (axiosError.response) {
                console.warn(axiosError.response);
                const error =
                    ((err as AxiosError).response?.data as ErrorResponse)?.[
                        'error'
                    ] ?? 'Could not generate a challenge link.';
                displayError(error);
            } else {
                displayError('An unknown error occurred.');
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <CenteredGrid>
            <section className="w-screen md:w-[512px] max-w-lg flex flex-col items-center py-2 px-4 relative">
                <section className="text-center flex flex-col mt-8">
                    <h2 className="font-bold mb-2 text-2xl">
                        Create a Challenge
                    </h2>
                    <p className="text-faded">
                        Let&apos;s generate a unique link for you to play others
                        with.
                    </p>
                </section>
                {/* TIME CONTROL */}
                <section className="mt-4">
                    <h4 className="text-faded font-bold text-sm text-center mt-4">
                        TIME CONTROL
                    </h4>

                    <section className="w-[calc(100vw-16px)] max-w-lg md:w-[480px] my-4 flex md:flex-row flex-col gap-2">
                        {timeControls.map((tc, idx) => (
                            <TimeControlPill
                                key={idx}
                                variant={tc}
                                onClick={() => setSelectedControl(tc.control)}
                                selected={selectedControl}
                                isDisabled={isPending}
                            />
                        ))}
                    </section>
                </section>
                <Success msg={success} />
                {/* CREATE CHALLENGE BUTTON */}
                <IconButton
                    label="Create"
                    icon={<ChallengeIcon size={24} />}
                    secondary={false}
                    isDisabled={isPending || isGameGenerated}
                    onClick={handleNewChallengeCreation}
                    pendingText={
                        isGameGenerated ? 'Share this link' : 'Creating'
                    }
                />
                <Error err={error} />
                {afterMessage && (
                    <p className="mt-4 text-faded text-sm">{afterMessage}</p>
                )}
            </section>
        </CenteredGrid>
    );
}
