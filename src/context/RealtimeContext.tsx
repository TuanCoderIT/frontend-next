"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

interface RealtimeContextProps {
    echo: Echo | null;
    isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextProps>({
    echo: null,
    isConnected: false
});

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
    const [echo, setEcho] = useState<Echo | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
        const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
        
        if (!token) {
            console.log('No token found, skipping realtime connection');
            setIsConnected(false);
            return;
        }

        if (!pusherKey || !pusherCluster) {
            console.log('Pusher config not found, skipping realtime connection');
            setIsConnected(false);
            return;
        }

        try {
            // Initialize Laravel Echo with Pusher
            const echoInstance = new Echo({
                broadcaster: 'pusher',
                key: pusherKey,
                cluster: pusherCluster,
                forceTLS: true,
                auth: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            });

            setEcho(echoInstance);

            // Connection event listeners
            echoInstance.connector.pusher.connection.bind('connected', () => {
                console.log('Realtime connected');
                setIsConnected(true);
            });

            echoInstance.connector.pusher.connection.bind('disconnected', () => {
                console.log('Realtime disconnected');
                setIsConnected(false);
            });

            echoInstance.connector.pusher.connection.bind('error', (error: any) => {
                console.error('Realtime connection error:', error);
                setIsConnected(false);
            });

            return () => {
                echoInstance.disconnect();
            };
        } catch (error) {
            console.error('Failed to initialize realtime connection:', error);
            setIsConnected(false);
        }
    }, []);

    return (
        <RealtimeContext.Provider value={{ echo, isConnected }}>
            {children}
        </RealtimeContext.Provider>
    );
};

export const useRealtime = () => {
    const context = useContext(RealtimeContext);
    if (!context) {
        throw new Error('useRealtime must be used within RealtimeProvider');
    }
    return context;
};