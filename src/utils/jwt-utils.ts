import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your-secret-key';

export const verifyToken = (token: string): object | null => {
  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'string') {
      return null; // 문자열로 반환된 경우 null로 처리하거나 오류를 던질 수 있습니다.
    }

    return decoded as object; // 여기서 객체로 반환됨을 확신하고 반환
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
};
