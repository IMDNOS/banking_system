import { ApprovalHandler } from './approval.handler';
import { TransactionStatus } from '@prisma/client';

export class AdminApprovalHandler extends ApprovalHandler {
  handle(): TransactionStatus {
    return TransactionStatus.REQUIRES_ADMIN;
  }
}
