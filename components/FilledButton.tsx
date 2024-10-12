import clsx from 'clsx';

interface IFilledButtonProps {
    label: string;
    isDisabled: boolean;
    onClick: () => void;
}

export default function FilledButton(props: IFilledButtonProps) {
    return (
        <button
            className={clsx(
                'w-full my-2 p-4 rounded-md bg-primary font-bold hover:opacity-90 transition-all active:scale-[.98] text-xl',
                props.isDisabled ? 'disabled:opacity-70' : ''
            )}
            onClick={props.onClick}
            disabled={props.isDisabled}
        >
            {props.label}
        </button>
    );
}
