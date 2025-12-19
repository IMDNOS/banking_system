import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { UserTransactionsController } from './user-transactions.controller';
import { PrismaService } from '../prisma.service';
import { AdminTransactionsController } from './admin-transactions.controller';
import { AuditService } from '../audit/audit.service';

@Module({
  controllers: [UserTransactionsController,AdminTransactionsController],
  providers: [TransactionsService, PrismaService,AuditService],
})
export class TransactionsModule {}
