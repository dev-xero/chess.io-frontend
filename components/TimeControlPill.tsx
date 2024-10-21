import { TIME_CONTROL } from '@/config/controls';
import clsx from 'clsx';

interface IControl {
    name: string;
    control: TIME_CONTROL;
}

interface ITimeControlPillProps {
    variant: IControl;
    onClick: () => void;
    selected: TIME_CONTROL;
    isDisabled: boolean;
}

export default function TimeControlPill(props: ITimeControlPillProps) {
    return (
        <div
            className={clsx(
                'w-full flex-grow p-4 rounded-md bg-base cursor-pointer transition-all text-xs font-bold text-center',
                props.selected == props.variant.control
                    ? '!bg-primary hover:!bg-primary'
                    : 'bg-base',
                props.isDisabled
                    ? 'cursor-default hover:!bg-base'
                    : 'hover:bg-lighter'
            )}
            onClick={!props.isDisabled ? props.onClick : () => {}}
        >
            {props.variant.control} mins | {props.variant.name}
        </div>
    );
}
