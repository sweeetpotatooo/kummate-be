// chat.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/res/user/user.service';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*', // 필요한 경우 클라이언트 도메인으로 제한
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly chatService: ChatService, // ChatService 주입
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token; // auth 옵션에서 토큰 가져오기
      if (!token) {
        this.logger.warn('Authorization token not provided');
        client.disconnect();
        return;
      }
      this.logger.log(`Received token: ${token}`);

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });
      this.logger.log(`Token payload: ${JSON.stringify(payload)}`);

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        this.logger.warn(`User not found: ${payload.sub}`);
        client.disconnect();
        return;
      }
      this.logger.log(`User found: ${user.email}`);

      if (user.accessToken !== token) {
        this.logger.warn('Invalid token');
        client.disconnect();
        return;
      }

      // Socket 객체에 사용자 정보 저장
      client.data.user = {
        user_id: user.user_id,
        email: user.email,
        nickname: user.nickname,
      };

      this.logger.log(`Client connected: ${user.email}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`, error.stack);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.user) {
      this.logger.log(`Client disconnected: ${client.data.user.email}`);
    } else {
      this.logger.log('Client disconnected');
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    await client.join(roomId);
    client.emit('joinedRoom', roomId);
    this.logger.log(`User ${client.data.user.email} joined room: ${roomId}`);
    // 방에 있는 다른 사용자들에게 새 사용자가 입장했음을 알립니다.
    client.to(roomId).emit('userJoined', client.data.user.email);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    await client.leave(roomId);
    client.emit('leftRoom', roomId);
    this.logger.log(`User ${client.data.user.email} left room: ${roomId}`);
    // 방에 남아있는 다른 사용자들에게 사용자가 퇴장했음을 알립니다.
    client.to(roomId).emit('userLeft', client.data.user.email);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      roomId: string;
      message: string;
    },
  ) {
    const user = client.data.user;
    if (!user) {
      this.logger.warn('User data not found on client');
      client.disconnect();
      return;
    }

    const messageData = {
      roomId: data.roomId,
      message: data.message, // message 필드 사용
      userId: user.user_id,
      nickname: user.nickname,
      createDate: new Date(),
    };

    this.logger.log(`Received message from ${user.email}: ${data.message}`);

    // 메시지 저장
    await this.chatService.saveMessage({
      roomId: messageData.roomId,
      userId: messageData.userId,
      message: messageData.message,
    });

    // 해당 방에 메시지 브로드캐스트
    this.server.to(data.roomId).emit('message', messageData);
    this.logger.log(`Broadcasted message to room ${data.roomId}`);
  }

  @SubscribeMessage('getHistory')
  async handleGetHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const history = await this.chatService.getChatHistory(roomId);
    client.emit('history', history);
    this.logger.log(
      `Sent chat history to ${client.data.user.email} for room ${roomId}`,
    );
  }
}
