import React from 'react';

interface IInputFieldProps {
    name: string;
    icon: React.ReactNode;
    placeholder: string;
    text: string;
    onChange: (text: string) => void;
    type: 'text' | 'password';
}

export default function InputField(props: IInputFieldProps) {
    return (
        <input
            name={props.name}
            placeholder={props.placeholder}
            value={props.text}
            onChange={(ev) => props.onChange(ev.target.value)}
            className="w-full px-4 py-2 rounded-md bg-base outline-none border-2 border-base text-foreground focus:border-primary transition-all"
            type={props.type}
        />
    );
}
