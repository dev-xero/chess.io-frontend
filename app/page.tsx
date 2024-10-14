import ProtectedPage from '@/components/ProtectedPage';
import HomeFragment from '@/fragments/HomeFragment';

export default function Home() {
    return (
        <ProtectedPage>
            <HomeFragment player={} />
        </ProtectedPage>
    );
}
