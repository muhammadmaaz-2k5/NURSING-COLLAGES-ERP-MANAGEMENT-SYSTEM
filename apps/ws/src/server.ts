import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import * as dotenv from 'dotenv';
import { ExtendedWebSocket, WsMessage } from './types';
import { RoomManager } from './room-manager';

// Load environment variables
dotenv.config();

const PORT = Number(process.env.WS_PORT || 4001);
const roomManager = new RoomManager();
const activeClients = new Set<ExtendedWebSocket>();

let clientIdCounter = 1;

// 1. Create Native HTTP Server for Healthchecks & Webhook Dispatching
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Healthcheck endpoint
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'UP',
        service: 'PERN WebSocket Real-Time Gateway',
        port: PORT,
        connectedClients: activeClients.size,
        rooms: roomManager.getRoomStats(),
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }

  // HTTP POST /emit endpoint for backend microservices to push events
  if (req.url === '/emit' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload: WsMessage = JSON.parse(body);
        if (payload.room) {
          roomManager.broadcastToRoom(payload.room, payload);
        } else {
          roomManager.broadcastGlobal(payload, activeClients);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, recipients: activeClients.size }));
      } catch (err: any) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

// 2. Initialize WebSocket Server attached to HTTP Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket, req) => {
  const extWs = ws as ExtendedWebSocket;
  extWs.id = `ws-client-${clientIdCounter++}`;
  extWs.isAlive = true;
  extWs.rooms = new Set();

  activeClients.add(extWs);
  console.log(`[WS Gateway] 🔌 Client connected: ${extWs.id} (Total: ${activeClients.size})`);

  // Auto-join global broadcast room
  roomManager.join('broadcast', extWs);

  // Heartbeat listener
  extWs.on('pong', () => {
    extWs.isAlive = true;
  });

  // Handle incoming client messages
  extWs.on('message', (rawData) => {
    try {
      const message: WsMessage = JSON.parse(rawData.toString());

      switch (message.type) {
        case 'AUTH':
          extWs.userId = message.payload?.userId;
          extWs.role = message.payload?.role;

          if (extWs.userId) {
            roomManager.join(`user:${extWs.userId}`, extWs);
          }
          if (extWs.role) {
            roomManager.join(`role:${extWs.role}`, extWs);
          }

          extWs.send(
            JSON.stringify({
              type: 'AUTH_SUCCESS',
              payload: {
                clientId: extWs.id,
                userId: extWs.userId,
                role: extWs.role,
                rooms: Array.from(extWs.rooms),
              },
              timestamp: Date.now(),
            }),
          );
          console.log(`[WS Gateway] 🔑 Authenticated client ${extWs.id} as Role: ${extWs.role || 'GUEST'}`);
          break;

        case 'SUBSCRIBE':
          if (message.room) {
            roomManager.join(message.room, extWs);
            extWs.send(
              JSON.stringify({
                type: 'NOTIFICATION',
                payload: { message: `Subscribed to room: ${message.room}` },
                timestamp: Date.now(),
              }),
            );
          }
          break;

        case 'UNSUBSCRIBE':
          if (message.room) {
            roomManager.leave(message.room, extWs);
          }
          break;

        case 'PING':
          extWs.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
          break;

        case 'ATTENDANCE_ALERT':
        case 'FEE_ALERT':
        case 'EXAM_RESULT':
        case 'CLINICAL_SIGN_OFF':
        case 'NOTIFICATION':
        case 'BROADCAST':
          if (message.room) {
            roomManager.broadcastToRoom(message.room, message, extWs);
          } else {
            roomManager.broadcastGlobal(message, activeClients);
          }
          break;

        default:
          extWs.send(
            JSON.stringify({
              type: 'ERROR',
              payload: { message: `Unknown message type: ${(message as any).type}` },
              timestamp: Date.now(),
            }),
          );
          break;
      }
    } catch (err: any) {
      extWs.send(
        JSON.stringify({
          type: 'ERROR',
          payload: { message: 'Invalid JSON payload' },
          timestamp: Date.now(),
        }),
      );
    }
  });

  extWs.on('close', () => {
    activeClients.delete(extWs);
    roomManager.leaveAll(extWs);
    console.log(`[WS Gateway] ❌ Client disconnected: ${extWs.id} (Remaining: ${activeClients.size})`);
  });

  extWs.on('error', (err) => {
    console.error(`[WS Gateway] Error on client ${extWs.id}:`, err.message);
  });
});

// 3. Heartbeat Ping Interval (Every 30 seconds)
const heartbeatInterval = setInterval(() => {
  for (const client of activeClients) {
    if (!client.isAlive) {
      activeClients.delete(client);
      roomManager.leaveAll(client);
      client.terminate();
      continue;
    }
    client.isAlive = false;
    client.ping();
  }
}, 30000);

wss.on('close', () => {
  clearInterval(heartbeatInterval);
});

// 4. Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 PERN Standalone WebSocket Gateway running on PORT: ${PORT}`);
  console.log(`📡 WebSocket URL: ws://localhost:${PORT}`);
  console.log(`🩺 Healthcheck:   http://localhost:${PORT}/health`);
  console.log(`🔔 Event Emit:   POST http://localhost:${PORT}/emit`);
  console.log(`=======================================================`);
});
