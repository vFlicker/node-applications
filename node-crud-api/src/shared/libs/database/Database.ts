import { User } from '#src/shared/types/user.js';
import { UserDto } from '#src/user/UserDto.js';

export interface Database {
  createUser(userData: UserDto): Promise<User>;
  findAllUsers(): Promise<User[]>;
  findUserById(userId: string): Promise<User | undefined>;
}
