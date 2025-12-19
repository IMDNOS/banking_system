// accounts/controllers/admin-accounts.controller.ts
import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
// import { RolesGuard } from '../auth/guards/roles.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ChangeAccountStatusDto } from './dto/change-account-status.dto';

// @UseGuards(RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TELLER)
@Controller('admin/accounts')
export class AdminAccountsController {
  constructor(private readonly accounts: AccountsService) {}

  // ➕ Create account (staff only)
  @Post()
  create(@Body() dto: CreateAccountDto) {
    return this.accounts.createAccount(dto);
  }

  // 🔄 Change account status (ADMIN only)
  @Put(':id/status')
  @Roles(UserRole.ADMIN)
  changeStatus(
    @Param('id') accountId: string,
    @Body() dto: ChangeAccountStatusDto,
  ) {
    return this.accounts.changeAccountStatus(accountId, dto.status);
  }

  // ❄️ Freeze entire hierarchy
  @Put(':id/freeze-hierarchy')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  freezeHierarchy(@Param('id') id: string) {
    return this.accounts.freezeHierarchy(id);
  }
}
