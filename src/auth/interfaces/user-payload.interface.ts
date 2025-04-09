export interface UserPayload {
  sub: number;
  name: string;
  email: string;
  email_verified_at?: Date;
  role?: string;
}
