import { ConflictException, Injectable } from '@nestjs/common';

import { DatabaseService } from '@app/common';
import { CreateUserDto } from 'apps/auth/src/users/dto/create-user-dto';
import { UserCreateInput } from 'apps/auth/src/users/entities';
import { UsersRepository } from 'apps/auth/src/users/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.transaction(async (db: DatabaseService) => {
      const { email, password } = createUserDto;

      const existingUser = await db.user.findUnique({ where: { email } });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const userData: UserCreateInput = {
        email,
        password,
      };

      return await db.user.create({ data: userData });
    });

    return user;
  }
}
