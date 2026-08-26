import { WebSocket } from 'ws';
import { ExtendedWebSocket, WsMessage } from './types';

export class RoomManager {
  private rooms: Map<string, Set<ExtendedWebSocket>> = new Map();

  join(room: string, client: ExtendedWebSocket) {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }
    this.rooms.get(room)!.add(client);
    client.rooms.add(room);
  }

  leave(room: string, client: ExtendedWebSocket) {
    const clients = this.rooms.get(room);
    if (clients) {
      clients.delete(client);
      if (clients.size === 0) {
        this.rooms.delete(room);
      }
    }
    client.rooms.delete(room);
  }

  leaveAll(client: ExtendedWebSocket) {
    for (const room of client.rooms) {
      this.leave(room, client);
    }
  }

  broadcastToRoom<T>(room: string, message: WsMessage<T>, sender?: ExtendedWebSocket) {
    const clients = this.rooms.get(room);
    if (!clients) return;

    const data = JSON.stringify({
      ...message,
      timestamp: message.timestamp || Date.now(),
    });

    for (const client of clients) {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  }

  broadcastGlobal<T>(message: WsMessage<T>, allClients: Set<ExtendedWebSocket>) {
    const data = JSON.stringify({
      ...message,
      timestamp: message.timestamp || Date.now(),
    });

    for (const client of allClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  }

  getRoomStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    for (const [room, clients] of this.rooms.entries()) {
      stats[room] = clients.size;
    }
    return stats;
  }
}
