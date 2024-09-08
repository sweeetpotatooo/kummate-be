declare global {
  namespace Express {
    interface Request {
      user: {
        id: number; // JWT에서 추출된 사용자 ID
        roles: string[]; // 사용자 역할
      }; // JWT 페이로드에 해당하는 타입
    }
  }
}
