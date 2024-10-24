import Image from 'next/image';

export default function GameHistoryBar() {
    const testHistory: string[] = []
    // [
    //     '1. e4 d4',
    //     '2. e5 e4',
    //     '3. e5 e4',
    //     '4. e5 e4',
    //     '5. e5 e4',
    //     '6. e5 e4',
    //     '7. e5 e4',
    //     '8. e5 e4',
    //     '9. e5 e4',
    //     '8. e5 e4',
    //     '9. e5 e4',
    //     '10. e5 e4',
    //     '11. e5 e4',
    //     '12. e5 e4',
    //     '13. e5 e4',
    //     '14. e5 e4',
    //     '15. e5 e4',
    //     '16. e5 e4',
    //     '17. e5 e4',
    // ];
    return (
        <aside className="col-span-">
            <section className=" bg-base rounded-md p-2">
                <h3 className="text-lg font-bold text-center">Move History</h3>
                <ul className="h-[400px] max-h-[400px] overflow-y-auto py-2">
                    {testHistory.length > 0 ? testHistory.map((move, idx) => {
                        const parts = move.split(' ');
                        return (
                            <li key={idx} className="grid grid-cols-5">
                                <span className="col-span-1 text-primary">
                                    {parts[0]}
                                </span>
                                <span className="col-span-2 font-bold">
                                    {parts[1]}
                                </span>
                                <span className="col-span-2 font-bold">
                                    {parts[2]}
                                </span>
                            </li>
                        );
                    }) : <li className="text-center">No History</li>}
                </ul>
            </section>
            <section className="mt-2 rounded-md p-2 bg-base w-full h-[128px] flex items-center justify-center">
                <h3 className="flex items-center gap-2">
                    <Image
                        src="/pieces/wK.png"
                        alt=""
                        width={32}
                        height={32}
                        priority={true}
                    />
                    <span className="font-bold text-xl">White&apos;s Turn</span>
                </h3>
            </section>
        </aside>
    );
}
