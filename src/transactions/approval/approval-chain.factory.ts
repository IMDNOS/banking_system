import { AutoApprovalHandler } from './auto-approval.handler';
import { ManagerApprovalHandler } from './manager-approval.handler';
import { AdminApprovalHandler } from './admin-approval.handler';

export class ApprovalChainFactory {
  static create() {
    const auto = new AutoApprovalHandler();
    const manager = new ManagerApprovalHandler();
    const admin = new AdminApprovalHandler();

    auto.setNext(manager).setNext(admin);
    return auto;
  }
}
