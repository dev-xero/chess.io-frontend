import React from "react"
import clsx from 'clsx';

interface IIconButtonProps {
    label: string;
    icon: React.ReactNode;
    secondary: boolean;
    isDisabled: boolean;
    onClick: () => void;
}


export default function IconButton(props: IIconButtonProps) {
    return (
        <button
        className={clsx(
            'w-full my-2 p-3 rounded-md font-bold hover:opacity-90 transition-all active:scale-[.98] text-xl flex gap-2 items-center justify-center',
            props.secondary ? 'bg-base' : 'bg-primary',
            props.isDisabled
                ? 'disabled:opacity-70 disabled:!scale-100'
                : ''
        )}
        onClick={props.onClick}
        disabled={props.isDisabled}
    >
        <div>{props.icon}</div>
        <span className="text-white">{props.label}</span>
    </button>
    )
}