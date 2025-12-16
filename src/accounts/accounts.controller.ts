import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Patch,
  Param,
  Put,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ChangeAccountStatusDto } from './dto/change-account-status.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private accounts: AccountsService) {}

  // 🔒 Only staff can create accounts
  @Post()
  @Roles(UserRole.TELLER, UserRole.MANAGER, UserRole.ADMIN)
  create(@Body() dto: CreateAccountDto) {
    return this.accounts.createAccount(dto);
  }

  // 👁 Account visibility endpoint
  @Get()
  getAccounts(@Req() req: any) {
    return this.accounts.getAccountsForUser(req.user);
  }

  @Patch(':id')
  updateAccount(
    @Param('id') accountId: string,
    @Req() req: any,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accounts.updateAccount(accountId, dto, req.user);
  }

  @Post(':id/close')
  @Roles(UserRole.CUSTOMER, UserRole.MANAGER)
  closeAccount(@Param('id') accountId: string, @Req() req: any) {
    return this.accounts.closeAccount(accountId, req.user);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN)
  changeStatus(
    @Param('id') accountId: string,
    @Body() dto: ChangeAccountStatusDto,
  ) {
    return this.accounts.changeAccountStatus(accountId, dto.status);
  }
}
