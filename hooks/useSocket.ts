import { useEffect, useState } from 'react';
import config from '@/config/config';

const useWebSocket = (userId: string | null) => {
    const [message, setMessage] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const ws = new WebSocket(config.ws);

        ws.onopen = () => {
            console.log('WebSocket connection established.');
            setIsConnected(true);
            ws.send(JSON.stringify({ type: 'auth', userId }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);
            setMessage(data);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed.');
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [userId]);

    return { isConnected, message };
};

export default useWebSocket;
