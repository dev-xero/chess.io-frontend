'use client';

import FilledButton from '@/components/FilledButton';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import Link from '@/components/Link';
import Marker from '@/components/Marker';
import CenteredGrid from '@/layout/CenteredGrid';
import { Horse, Lock } from '@phosphor-icons/react';
import { FormEvent, useState } from 'react';

export default function Page() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleUserLogin = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        alert('Not yet implemented!');
    };

    return (
        <CenteredGrid>
            <section className="md:w-[512px] max-w-lg flex flex-col items-center p-2 relative">
                <Marker />
                <Header />
                <section className="text-center flex flex-col mt-8">
                    <h2 className="font-bold mb-2 text-2xl">Log Back In</h2>
                    <p className="text-faded">
                        Log back into your account to play friends!
                    </p>
                </section>
                <form
                    action="/"
                    onSubmit={handleUserLogin}
                    className="md:w-[512px]"
                >
                    <section className="my-8 flex flex-col gap-2">
                        <InputField
                            name="username-field"
                            icon={<Horse size={24} />}
                            placeholder="Username"
                            text={userName}
                            onChange={(val) => setUserName(val)}
                            type="text"
                        />
                        <InputField
                            name="password-field"
                            icon={<Lock size={24} />}
                            placeholder="Password"
                            text={password}
                            onChange={(val) => setPassword(val)}
                            type="password"
                        />
                    </section>
                    <FilledButton
                        label="Log In"
                        onClick={() => handleUserLogin}
                    />
                    <section className="mt-4 flex items-center justify-center gap-4">
                        <Link
                            href="/auth/register"
                            label="Register Instead"
                            external={false}
                        />
                        <Link
                            href="/auth/forgot-password"
                            label="Forgot Password"
                            external={false}
                        />
                    </section>
                </form>
            </section>
        </CenteredGrid>
    );
}
