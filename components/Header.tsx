import Image from 'next/image';

export default function Header() {
    return (
        <Image
            width={140}
            height={24}
            src="/monochrome.svg"
            alt="chess.io"
            className="mb-2 select-none"
            priority={true}
        />
    );
}
