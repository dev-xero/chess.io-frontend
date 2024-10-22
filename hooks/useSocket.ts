import { useEffect, useRef, useState } from 'react';
import config from '@/config/config';

const useWebSocket = (userId: string | null) => {
    const wsRef = useRef<WebSocket | null>(null)
    const [message, setMessage] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const ws = new WebSocket(config.ws);
        wsRef.current = ws

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
            wsRef.current = null
        };
    }, [userId]);

    const sendMessage = (msg: unknown) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
            console.log("message sent:", msg);
        } else {
            console.warn('WebSocket is not connected.');
        }
    };

    return { isConnected, message, sendMessage };
};

export default useWebSocket;
