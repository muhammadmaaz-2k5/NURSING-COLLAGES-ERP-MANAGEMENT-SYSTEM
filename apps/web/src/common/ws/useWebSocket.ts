'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export interface WsMessage<T = any> {
  type: string;
  payload?: T;
  room?: string;
  timestamp?: number;
}

export function useWebSocket() {
  const { user } = useAuth();
  const toast = useToast();
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WsMessage | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4001';

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        console.log(`[WebSocket Client] 🟢 Connected to ${wsUrl}`);

        // Send authentication handshake
        if (user) {
          ws.send(
            JSON.stringify({
              type: 'AUTH',
              payload: {
                userId: user.id,
                role: user.role,
                name: user.name,
              },
            }),
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const data: WsMessage = JSON.parse(event.data);
          setLastMessage(data);

          // Real-time toast dispatches
          switch (data.type) {
            case 'ATTENDANCE_ALERT':
              toast.warning('Attendance Alert', data.payload?.message || 'Attendance shortage detected');
              break;
            case 'FEE_ALERT':
              toast.info('Fee Reminder', data.payload?.message || 'Tuition fee deadline approaching');
              break;
            case 'EXAM_RESULT':
              toast.success('Exam Results Published', data.payload?.message || 'New results are now available');
              break;
            case 'CLINICAL_SIGN_OFF':
              toast.success('Clinical Sign-off', data.payload?.message || 'Bedside procedure verified');
              break;
            case 'NOTIFICATION':
              if (data.payload?.title) {
                toast.info(data.payload.title, data.payload.message);
              }
              break;
            default:
              break;
          }
        } catch (e) {
          console.warn('[WebSocket Client] Failed to parse message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('[WebSocket Client] 🔴 Connection closed. Retrying in 5s...');
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };

      ws.onerror = (err) => {
        console.warn('[WebSocket Client] Connection error:', err);
        ws.close();
      };
    } catch (err) {
      console.warn('[WebSocket Client] Unable to initialize WebSocket:', err);
    }
  }, [user, toast]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((message: WsMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  const subscribe = useCallback((room: string) => {
    send({ type: 'SUBSCRIBE', room });
  }, [send]);

  const unsubscribe = useCallback((room: string) => {
    send({ type: 'UNSUBSCRIBE', room });
  }, [send]);

  return {
    isConnected,
    lastMessage,
    send,
    subscribe,
    unsubscribe,
  };
}
