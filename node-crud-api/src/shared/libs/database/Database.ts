import { UserDto } from '#src/shared/modules/user/UserDto.js';
import { User } from '#src/shared/types/user.js';

export interface Database {
  createUser(userData: UserDto): Promise<User>;
  findAllUsers(): Promise<User[]>;
  findUserById(userId: string): Promise<User | undefined>;
}
