'use client';

import Error from '@/components/Error';
import FilledButton from '@/components/FilledButton';
import InputField from '@/components/InputField';
import Marker from '@/components/Marker';
import CenteredGrid from '@/layout/CenteredGrid';
import { Asterisk, Horse, Lock } from '@phosphor-icons/react';
import { FormEvent, useState } from 'react';

export default function Page() {
    const [error, setError] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [userName, setUserName] = useState('')
    const [secretQuestion, setSecretQuestion] = useState('')
    const [newPassword, setNewPassword] = useState('')
    
    const refreshForm = () => {
        setError('');
        setIsDisabled(true);
    };

    const handlePasswordReset = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        refreshForm();
    }

    return (
        <CenteredGrid>
            <section className="w-screen md:w-[512px] max-w-lg flex flex-col items-center py-2 px-4 relative">
                <Marker />
                <section className="text-center flex flex-col mt-8">
                    <h2 className="font-bold mb-2 text-2xl">Forgot Password</h2>
                    <p className="text-faded">
                        You can reset your password by providing your secret question. Then you can log in using the new password.
                    </p>
                </section>
                <form
                    action="/"
                    onSubmit={handlePasswordReset}
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
                            name="secret-field"
                            icon={<Asterisk size={24} />}
                            placeholder="Secret question"
                            text={secretQuestion}
                            onChange={(val) => setSecretQuestion(val)}
                            type="text"
                        />
                        <InputField
                            name="password-field"
                            icon={<Lock size={24} />}
                            placeholder="New password"
                            text={newPassword}
                            onChange={(val) => setNewPassword(val)}
                            type="password"
                        />
                    </section>
                    <Error err={error} />
                    <FilledButton
                        label="Reset"
                        isDisabled={isDisabled}
                        pendingText="Hang On"
                        onClick={() => handlePasswordReset}
                    />
                    </form>
            </section>
        </CenteredGrid>
    );
}
