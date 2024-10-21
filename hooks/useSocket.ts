import { useEffect, useState } from 'react';
import config from '@/config/config';

const useWebSocket = (userId: string) => {
    // const [socket, setSocket] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(`ws://${config.api}`);

        ws.onopen = () => {
            console.log('Websocket connection established.');
            setIsConnected(true);
            ws.send(JSON.stringify({ type: 'auth', userId }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);
            setMessage(data);
        };

        ws.onclose = () => {
            console.log("Websocket connection closed.");
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Cleanup connection
        return () => {
            if (ws) ws.close();
        };
    });

    return { isConnected, message }
};

export default useWebSocket;
