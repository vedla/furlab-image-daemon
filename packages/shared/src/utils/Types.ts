import { Request } from 'express';

interface AppRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

enum Role {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export { AppRequest, Role };
