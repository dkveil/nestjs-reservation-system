import { User } from '@prisma/client';

export { User };

export type UserCreateInput = {
  email: string;
  password: string;
  id?: string;
};
