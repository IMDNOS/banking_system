import { IsEnum } from 'class-validator';
import { TransactionStatus } from '@prisma/client';

export class ReviewTransactionDto {
  @IsEnum([TransactionStatus.APPROVED, TransactionStatus.REJECTED])
  decision: TransactionStatus;
}
