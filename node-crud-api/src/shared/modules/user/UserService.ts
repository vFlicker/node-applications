import { User } from '#src/shared/types/user.js';

import { UserDto } from './UserDto.js';

export interface UserService {
  createUser(userData: UserDto): Promise<User>;
  findAllUsers(): Promise<User[]>;
  findUserById(userId: string): Promise<User | undefined>;
  updateUser(userId: string, userData: UserDto): Promise<User>;
  deleteUser(userId: string): Promise<void>;
}
