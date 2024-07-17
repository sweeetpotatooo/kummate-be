// src/res/user/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column()
  user_roles: number;

  @Column()
  student_id: string;

  @Column()
  department: string;

  @Column()
  certified: number;

  @Column()
  user_type: string;

  @Column()
  age: number;

  @Column()
  image: string;

  @Column()
  match_status: number;

  @Column()
  modified_date_time: Date;

  @Column()
  created_date_time: Date;

  @Column()
  smoke: number;

  @Column()
  mbti: string;

  @Column()
  snoring: number;

  @Column()
  bruxism: number;

  @Column()
  datail: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
