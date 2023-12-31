// useWebSocket.js
import { useEffect, useRef, useState, useCallback } from 'react';

const useWebSocket = (url) => {
    const socket = useRef(null);
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [latestMessage, setLatestMessage] = useState(null);
    const [matchingResponse, setMatchingResponse] = useState(null);

    useEffect(() => {
        if (response && response.word === latestMessage) {
            setMatchingResponse(response);
            setIsLoading(false);
        }
    }, [response, latestMessage, setMatchingResponse, setIsLoading]);


    useEffect(() => {
        console.log('Connecting to: ', url);
        socket.current = new WebSocket(url);

        socket.current.onopen = () => console.log('WebSocket Connected');
        socket.current.onmessage = (event) => {
            const response = JSON.parse(event.data);
            console.log('WebSocket Message Received:', response);
            setResponse(response);
        };
        socket.current.onerror = (error) => console.error('WebSocket Error:', error);
        socket.current.onclose = () => console.log('WebSocket Disconnected');

        return () => {
            socket.current.close();
        };
    }, [url]);

    const sendMessage = useCallback((message) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(message);
            setLatestMessage(message);
            setIsLoading(true);
        }
    }, [setLatestMessage, setIsLoading]);

    return { response: matchingResponse, sendMessage, isLoading };
};

export default useWebSocket;
