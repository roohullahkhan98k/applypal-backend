import { UserRole } from '@prisma/client';

export interface User {
  id: string;
  full_name: string;
  email: string;
  university: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface UserPayload {
  sub: string;
  email: string;
  role: UserRole;
  fullName: string;
  university: string;
}

export interface CreateUserDto {
  full_name: string;
  email: string;
  university: string;
  password_hash: string;
  role: UserRole;
}
