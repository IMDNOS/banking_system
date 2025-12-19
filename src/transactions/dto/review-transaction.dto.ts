import { IsEnum, IsUUID } from 'class-validator';
import { TransactionStatus } from '@prisma/client';

export class ReviewTransactionDto {

  @IsUUID()
  transactionId: string;

  @IsEnum([TransactionStatus.APPROVED, TransactionStatus.REJECTED])
  decision: TransactionStatus;
}
