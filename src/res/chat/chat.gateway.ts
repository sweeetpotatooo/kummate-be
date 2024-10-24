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
import { UseGuards, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/res/user/user.service';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: '/chat',
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
      const authToken = client.handshake.headers.authorization;
      if (!authToken) {
        this.logger.warn('Authorization token not provided');
        client.disconnect();
        return;
      }

      const token = authToken.split(' ')[1];
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        this.logger.warn(`User not found: ${payload.sub}`);
        client.disconnect();
        return;
      }

      if (user.accessToken !== token) {
        this.logger.warn('Invalid token');
        client.disconnect();
        return;
      }

      // Socket 객체에 사용자 정보 저장
      client.data.user = user;

      this.logger.log(`Client connected: ${user.email}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
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

  @UseGuards(JwtAccessTokenGuard)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.join(roomId);
    client.emit('joinedRoom', roomId);
    this.logger.log(`User ${client.data.user.email} joined room: ${roomId}`);
  }

  @UseGuards(JwtAccessTokenGuard)
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.leave(roomId);
    client.emit('leftRoom', roomId);
    this.logger.log(`User ${client.data.user.email} left room: ${roomId}`);
  }

  @UseGuards(JwtAccessTokenGuard)
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
      client.disconnect();
      return;
    }

    const messageData = {
      roomId: data.roomId,
      message: data.message,
      userEmail: user.email,
      createDate: new Date(),
    };

    // 메시지 저장
    await this.chatService.saveMessage(messageData);

    // 해당 방에 메시지 브로드캐스트
    this.server.to(data.roomId).emit('message', messageData);
    this.logger.log(`User ${user.email} sent message to room ${data.roomId}`);
  }

  @UseGuards(JwtAccessTokenGuard)
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
