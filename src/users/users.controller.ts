import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Roles(UserRole.ADMIN, UserRole.MANAGER)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateUserDto) {
    return this.users.createUser(dto, req.user.role);
  }
}
