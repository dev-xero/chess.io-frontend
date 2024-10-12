import ProtectedPage from '@/components/ProtectedPage';

export default function Home() {
    return (
        <ProtectedPage>
            <main>
                <h2>Welcome to ChessIO</h2>
            </main>
        </ProtectedPage>
    );
}
