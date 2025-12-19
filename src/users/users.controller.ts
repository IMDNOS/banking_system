import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  create(@Req() req: any, @Body() dto: CreateUserDto) {
    return this.users.createUser(req.user.accountId, dto, req.user.role);
  }
}
