import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateUserDto) {
    return this.users.createUser(dto, req.user.role);
  }
}
