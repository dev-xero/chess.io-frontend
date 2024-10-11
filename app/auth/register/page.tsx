'use client';

import FilledButton from '@/components/FilledButton';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import Link from '@/components/Link';
import CenteredGrid from '@/layout/CenteredGrid';
import { Horse, Lock, Asterisk } from '@phosphor-icons/react';
import { FormEvent, useState } from 'react';

export default function Page() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [secretQuestion, setSecretQuestion] = useState('');

    const handleUserRegistration = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        alert('Not yet implemented!');
    };

    return (
        <CenteredGrid>
            <section className="md:w-[512px] max-w-lg flex flex-col items-center p-2">
                <Header />
                <section className="text-center flex flex-col mt-8">
                    <h2 className="font-bold mb-2 text-2xl">
                        Create Your Account
                    </h2>
                    <p className="text-faded">
                        Let&apos;s create an account so you can play on ChessIO!
                    </p>
                </section>
                <form
                    action="/"
                    onSubmit={handleUserRegistration}
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
                        <InputField
                            name="secret-field"
                            icon={<Asterisk size={24} />}
                            placeholder="Secret question"
                            text={secretQuestion}
                            onChange={(val) => setSecretQuestion(val)}
                            type="text"
                        />
                        <p className="text-xs text-primary mt-2 text-center">
                            We ask for a secret question in case you forget your
                            password.
                        </p>
                    </section>
                    <FilledButton
                        label="Register"
                        onClick={() => handleUserRegistration}
                    />
                    <section className="mt-4 flex items-center justify-center gap-2">
                        <Link
                            href="/auth/login"
                            label="Login Instead"
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
