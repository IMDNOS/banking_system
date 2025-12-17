import { TransactionStatus } from '@prisma/client';

export abstract class ApprovalHandler {
  protected next?: ApprovalHandler;

  setNext(handler: ApprovalHandler): ApprovalHandler {
    this.next = handler;
    return handler;
  }

  handle(context: any): TransactionStatus {
    if (this.next) {
      return this.next.handle(context);
    }
    return TransactionStatus.REJECTED;
  }
}
