import { UserDto } from './user.dto.js';
import { User } from './user.type.js';

export interface UserService {
  createUser(userData: UserDto): Promise<User>;
  findAllUsers(): Promise<User[]>;
  findUserById(userId: number): Promise<User | undefined>;
  updateUser(userId: number, userData: UserDto): Promise<User>;
  deleteUser(userId: number): Promise<void>;
}
