export interface UserPayload {
  sub: number;
  email: string;
  email_verified_at?: Date;
  role?: string;
}
