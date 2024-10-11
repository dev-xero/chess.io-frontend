'use client';

import Header from '@/components/Header';
import InputField from '@/components/InputField';
import CenteredGrid from '@/layout/CenteredGrid';
import { Horse, Lock, Asterisk } from '@phosphor-icons/react';
import { FormEvent, useState } from 'react';

export default function Page() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [secretQuestion, setSecretQuestion] = useState('');

    const handleUserRegistration = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
    };

    return (
        <CenteredGrid>
            <section className="w-[512px] max-w-lg flex flex-col items-center">
                <Header />
                <form
                    action="/"
                    onSubmit={handleUserRegistration}
                    className="w-[512px]"
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
                        <p className="text-xs text-primary mt-2">
                            We ask for a secret question in case you forget your
                            password.
                        </p>
                    </section>
                </form>
            </section>
        </CenteredGrid>
    );
}
