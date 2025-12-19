import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { UserTransactionsController } from './user-transactions.controller';
import { PrismaService } from '../prisma.service';
import { AdminTransactionsController } from './admin-transactions.controller';

@Module({
  controllers: [UserTransactionsController,AdminTransactionsController],
  providers: [TransactionsService, PrismaService],
})
export class TransactionsModule {}
