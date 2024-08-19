import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Login } from '../../login/entities/login.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number; // 자동으로 1씩 증가하는 primary key

  @Column({ nullable: false })
  username: string; // NOT NULL

  @Column({ nullable: false, unique: true })
  email: string; // NOT NULL 및 UNIQUE

  @Column({ nullable: false })
  password: string; // NOT NULL

  @Column({ nullable: false })
  nickname: string; // NOT NULL

  @Column({ nullable: false })
  department: string; // NOT NULL

  @Column({ nullable: false })
  age: number; // NOT NULL

  @Column({ nullable: true })
  user_roles: number | null; // NULL 허용

  @Column({ nullable: true })
  student_id: string | null; // NULL 허용

  @Column({ nullable: true })
  certified: number | null; // NULL 허용

  @Column({ nullable: true })
  user_type: string | null; // NULL 허용

  @Column({ nullable: true })
  image: string | null; // NULL 허용

  @Column({ nullable: true })
  match_status: number | null; // NULL 허용

  @UpdateDateColumn({ type: 'timestamp' })
  modified_date_time: Date; // 수정 시 자동 업데이트

  @CreateDateColumn({ type: 'timestamp' })
  created_date_time: Date; // 생성 시 자동 설정

  @Column({ nullable: true })
  smoke: number | null; // NULL 허용

  @Column({ nullable: true })
  mbti: string | null; // NULL 허용

  @Column({ nullable: true })
  snoring: number | null; // NULL 허용

  @Column({ nullable: true })
  bruxism: number | null; // NULL 허용

  @Column({ nullable: true })
  datail: string | null; // NULL 허용

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Login, (login) => login.user)
  logins: Login[];
}
