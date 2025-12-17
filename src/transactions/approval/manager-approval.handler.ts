import { ApprovalHandler } from './approval.handler';
import { ApprovalContext } from './approval.context';
import { TransactionStatus } from '@prisma/client';

export class ManagerApprovalHandler extends ApprovalHandler {
  handle(context: ApprovalContext): TransactionStatus {
    if (context.amount.lte(10000)) {
      return TransactionStatus.REQUIRES_MANAGER;
    }
    return super.handle(context);
  }
}
