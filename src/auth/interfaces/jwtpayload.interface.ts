// src/types/custom-request.interface.ts
import { Request } from 'express';
import { User } from 'src/res/user/entities/user.entity'; // User 엔티티 임포트

// Request 객체 확장 (req.user에 User 객체가 포함되도록)
export interface CustomRequest extends Request {
  user: User;
}
