import { UserDto } from './user.dto.js';
import { User } from './user.type.js';

export interface UserService {
  createUser(userData: UserDto): Promise<User>;
  findAllUsers(): Promise<User[]>;
  findUserById(userId: string): Promise<User | undefined>;
  updateUser(userId: string, userData: UserDto): Promise<User>;
  deleteUser(userId: string): Promise<void>;
}
