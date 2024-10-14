import Header from '@/components/Header';
import Marker from '@/components/Marker';
import IPlayer from '@/global/i.player';

interface HomeFragmentProps {
    player: IPlayer;
}

export default function HomeFragment({ player }: HomeFragmentProps) {
    return (
        <main className="w-full md:w-[512px] max-w-lg flex flex-col items-center py-2 px-4 relative">
            <Marker />
            <Header />
            <section className="text-center flex items-center gap-2 mt-8">
                <h3 className="font-bold mb-2 text-2xl">
                    Logged in as:{' '}
                    <span className="font-normal text-primary">
                        @{player.username}
                    </span>
                </h3>
                <h3 className="font-bold mb-2 text-2xl">
                    Rating:{' '}
                    <span className="font-normal text-primary">
                        {player.rating}
                    </span>
                </h3>
            </section>
        </main>
    );
}
