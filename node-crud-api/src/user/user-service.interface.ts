import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './user.type.js';

export interface UserService {
  createUser(dto: CreateUserDto): Promise<User>;
  findAllUsers(): Promise<User[]>;
  findUserById(userId: number): Promise<User | null>;
  updateUserById(userId: number, dto: UpdateUserDto): Promise<User>;
  deleteUserById(userId: number): Promise<void>;
}
