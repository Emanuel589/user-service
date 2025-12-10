export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  mustChangePassword: boolean;
  iat?: number;
  exp?: number;
}
