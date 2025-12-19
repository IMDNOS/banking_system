import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { PrismaService } from '../prisma.service';
import { InterestService } from './interest/interest.service';
import { InterestCron } from './interest/interest.cron';
import { AdminAccountsController } from './admin-accounts.controller';
import { UserAccountsController } from './user-accounts.controller';
import { AuditService } from '../audit/audit.service';

@Module({
  controllers: [AdminAccountsController, UserAccountsController],
  providers: [
    AccountsService,
    PrismaService,
    InterestService,
    InterestCron,
    AuditService,
  ],
})
export class AccountsModule {}
