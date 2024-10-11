import Image from 'next/image';

export default function Header() {
    return (
        <Image
            width={240}
            height={52}
            src="/monochrome.svg"
            alt="chess.io"
            className="mb-2 select-none"
        />
    );
}
