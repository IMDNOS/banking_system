import { ApprovalHandler } from './approval.handler';
import { ApprovalContext } from './approval.context';
import { TransactionStatus } from '@prisma/client';

export class AutoApprovalHandler extends ApprovalHandler {
  handle(context: ApprovalContext): TransactionStatus {
    if (context.amount.lte(1000)) {
      return TransactionStatus.APPROVED;
    }
    return super.handle(context);
  }
}
