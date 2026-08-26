import { WebSocket } from 'ws';

export interface ExtendedWebSocket extends WebSocket {
  id: string;
  isAlive: boolean;
  userId?: string;
  role?: string;
  rooms: Set<string>;
}

export type WsMessageType =
  | 'AUTH'
  | 'AUTH_SUCCESS'
  | 'PING'
  | 'PONG'
  | 'SUBSCRIBE'
  | 'UNSUBSCRIBE'
  | 'NOTIFICATION'
  | 'ATTENDANCE_ALERT'
  | 'FEE_ALERT'
  | 'EXAM_RESULT'
  | 'CLINICAL_SIGN_OFF'
  | 'BROADCAST'
  | 'ERROR';

export interface WsMessage<T = any> {
  type: WsMessageType;
  payload?: T;
  room?: string;
  timestamp?: number;
}
