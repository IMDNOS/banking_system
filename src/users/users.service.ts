import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}

  async createUser(dto: CreateUserDto, creatorRole: UserRole) {
    // 🔒 Enforce role hierarchy
    if (creatorRole === UserRole.MANAGER) {
      if (dto.role === UserRole.ADMIN || dto.role === UserRole.MANAGER) {
        throw new ForbiddenException(
          'Managers can only create customers or tellers',
        );
      }
    }

    // Optional: prevent nonsense
    if (creatorRole === UserRole.ADMIN && dto.role === UserRole.ADMIN) {
      // allowed, but you may log this
    }

    return this.db.user.create({
      data: {
        full_name: dto.full_name,
        email: dto.email,
        role: dto.role,
        password_hash: bcrypt.hashSync(dto.password, 10),
      },
    });
  }
}
