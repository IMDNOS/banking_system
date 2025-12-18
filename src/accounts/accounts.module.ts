import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaService } from '../prisma.service';
import { InterestService } from './interest/interest.service';
import { InterestCron } from './interest/interest.cron';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService, InterestService, InterestCron],
})
export class AccountsModule {}
