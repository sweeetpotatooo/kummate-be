// entities/chatRoom.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/res/user//entities/user.entity'; // User 엔티티 임포트

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: string;

  @Column()
  user1Id: number;

  @Column()
  user2Id: number;

  @ManyToOne(() => User, { eager: true }) // user1과의 관계 설정
  @JoinColumn({ name: 'user1Id' })
  user1: User;

  @ManyToOne(() => User, { eager: true }) // user2과의 관계 설정
  @JoinColumn({ name: 'user2Id' })
  user2: User;

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];
}
