import {
  Injectable,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { AuditAction, UserRole } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    private db: PrismaService,
    private audit: AuditService,
  ) {}

  async createUser(
    staff_id: string,
    dto: CreateUserDto,
    creatorRole: UserRole,
  ) {
    const staff = await this.db.account.findUnique({
      where: { id: staff_id },
      select: { id: true, ownerId: true },
    });
    if (!staff) {
      throw new ForbiddenException('staff not found');
    }

    // 🔒 Enforce role hierarchy
    if (creatorRole === UserRole.MANAGER) {
      if (dto.role === UserRole.ADMIN || dto.role === UserRole.MANAGER) {
        throw new ForbiddenException(
          'Managers can only create customers or tellers',
        );
      }
    }

    const emailExists=await this.db.user.findUnique({where:{email:dto.email}})
    const phone_number = await this.db.user.findUnique({where:{phone_number:dto.phone_number}})
    if ( emailExists) {
      throw new ConflictException('email already exists');
    }
    if ( phone_number) {
      throw new ConflictException('phone_number already exists');
    }

    const user = await this.db.user.create({
      data: {
        full_name: dto.full_name,
        email: dto.email,
        phone_number: dto.phone_number,
        role: dto.role,
        password_hash: bcrypt.hashSync(dto.password, 10),
      },
    });

    await this.audit.log({
      action: AuditAction.CREATE,
      entityType: 'User',
      entityId: user.id,
      performedById: staff.ownerId,
      metadata: {
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        createdByRole: creatorRole,
      },
    });

    return user;
  }
}
