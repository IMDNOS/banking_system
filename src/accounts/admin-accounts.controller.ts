// accounts/controllers/admin-accounts.controller.ts
import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
// import { RolesGuard } from '../auth/guards/roles.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ChangeAccountStatusDto } from './dto/change-account-status.dto';

@Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TELLER)
@Controller('admin/accounts')
export class AdminAccountsController {
  constructor(private readonly accounts: AccountsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateAccountDto) {
    return this.accounts.createAccount(req.user.accountId, dto);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  changeStatus(
    @Req() req: any,
    @Param('id') accountId: string,
    @Body() dto: ChangeAccountStatusDto,
  ) {
    return this.accounts.changeAccountStatus(
      req.user.accountId,
      accountId,
      dto.status,
    );
  }

  @Put(':id/freeze-hierarchy')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  freezeHierarchy(@Param('id') id: string) {
    return this.accounts.freezeHierarchy(id);
  }
}
