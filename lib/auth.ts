import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface UserPayload {
  id: string;
  email: string;
  officialName: string;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export function hashSecurityAnswer(answer: string): string {
  return bcrypt.hashSync(answer.toLowerCase().trim(), 10);
}

export function verifySecurityAnswer(answer: string, hashedAnswer: string): boolean {
  return bcrypt.compareSync(answer.toLowerCase().trim(), hashedAnswer);
}
