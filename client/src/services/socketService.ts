import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: ((message: any) => void)[] = [];

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL);

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('receive_message', (message) => {
      this.listeners.forEach(listener => listener(message));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join_room', roomId);
    }
  }

  sendMessage(messageData: any) {
    if (this.socket) {
      this.socket.emit('send_message', messageData);
    }
  }

  onMessage(callback: (message: any) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
