import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './user.type.js';

export interface UserService {
  create(dto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findById(userId: number): Promise<User | null>;
  updateById(userId: number, dto: UpdateUserDto): Promise<User>;
  deleteById(userId: number): Promise<void>;
}
