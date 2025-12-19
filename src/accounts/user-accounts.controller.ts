// accounts/controllers/user-accounts.controller.ts
import { Controller, Get, Req, Post, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
// import { RolesGuard } from '../auth/guards/roles.guard';

// @UseGuards(RolesGuard)
@Controller('accounts')
export class UserAccountsController {
  constructor(private readonly accounts: AccountsService) {}

  @Get()
  getAccounts(@Req() req: any) {
    return this.accounts.getAccountsForUser(req.user);
  }

  @Get('balance')
  getBalance(@Req() req: any) {
    return this.accounts.getAggregatedBalance(req.user.accountId);
  }

  @Post('close-hierarchy')
  closeHierarchy(@Req() req: any) {
    return this.accounts.closeAccountHierarchy(req.user.accountId);
  }
}
