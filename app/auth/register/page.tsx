'use client';

import FilledButton from '@/components/FilledButton';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import Link from '@/components/Link';
import Marker from '@/components/Marker';
import Error from '@/components/Error';
import CenteredGrid from '@/layout/CenteredGrid';
import { Horse, Lock, Asterisk } from '@phosphor-icons/react';
import { FormEvent, useState } from 'react';
import config from '@/config/config';
import axios from 'axios';
import NetworkConfig from '@/config/http';

export default function Page() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [secretQuestion, setSecretQuestion] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [error, setError] = useState('');

    const refreshForm = () => {
        setError('');
        setIsDisabled(true);
    };

    const displayError = (msg: string) => {
        setError(msg);
        setIsDisabled(false);
    };

    const handleUserRegistration = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        refreshForm();

        if (
            userName.trim().length == 0 ||
            password.trim().length == 0 ||
            secretQuestion.trim().length == 0
        ) {
            displayError('Please fill all fields.');
            return;
        }

        if (password.length < 8) {
            displayError('Password cannot be less than 8 characters.');
            return;
        }

        // make network request
        try {
            const { data} = await axios.post(
                `${config.api}/auth/register`,
                {
                    username: userName,
                    password: password,
                    secretQuestion: secretQuestion,
                },
                NetworkConfig
            );

            if (data.status != 201) {
                console.warn("wahala");
            }

            console.log("data:", data);
        } catch (err) {
            console.warn(err);
        } finally {
            setIsDisabled(false);
        }
    };

    return (
        <CenteredGrid>
            <section className="w-full md:w-[512px] max-w-lg flex flex-col items-center py-2 px-4 relative">
                <Marker />
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
                    className="w-full md:max-w-[512px] md:w-[512px]"
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
                    <Error err={error} />
                    <FilledButton
                        label="Register"
                        onClick={() => handleUserRegistration}
                        isDisabled={isDisabled}
                    />
                    <section className="mt-4 flex items-center justify-center gap-4">
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
