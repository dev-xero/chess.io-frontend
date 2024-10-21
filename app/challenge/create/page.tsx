'use client';

import ChallengeIcon from '@/components/ChallengeIcon';
import IconButton from '@/components/IconButton';
import TimeControlPill from '@/components/TimeControlPill';
import { TIME_CONTROL } from '@/config/controls';
import CenteredGrid from '@/layout/CenteredGrid';
import { useState } from 'react';

export default function Page() {
    const [selectedControl, setSelectedControl] = useState(TIME_CONTROL.RAPID);
    const [isPending, setIsPending] = useState(false);
    const timeControls = [
        { name: 'Rapid', control: TIME_CONTROL.RAPID },
        { name: 'Blitz', control: TIME_CONTROL.BLITZ },
        { name: 'Bullet', control: TIME_CONTROL.BULLET },
    ];

    const handleNewChallengeCreation = () => {
        alert('new challenge!');
        setIsPending(true);
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
                {/* CREATE CHALLENGE BUTTON */}
                <IconButton
                    label="Create"
                    icon={<ChallengeIcon size={24} />}
                    secondary={false}
                    isDisabled={isPending}
                    onClick={handleNewChallengeCreation}
                    pendingText="Creating"
                />
            </section>
        </CenteredGrid>
    );
}
