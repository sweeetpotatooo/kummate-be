// jwt-payload.interface.ts
export interface JwtPayload {
  userId?: number; // Make userId optional
  username: string;
  sub: number;
}
