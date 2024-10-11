interface IFilledButtonProps {
    label: string;
    onClick: () => void;
}

export default function FilledButton(props: IFilledButtonProps) {
    return (
        <button
            className="w-full my-2 p-4 rounded-md bg-primary font-bold hover:opacity-90 transition-all active:scale-[.98] text-xl"
            onClick={props.onClick}
        >
            {props.label}
        </button>
    );
}
