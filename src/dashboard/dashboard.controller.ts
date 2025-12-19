import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

// dashboard.controller.ts
@Roles(UserRole.ADMIN, UserRole.MANAGER)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService,private audit: AuditService) {}

  @Get('health')
  getHealth() {
    return this.dashboard.systemHealth();
  }

  @Get('metrics')
  getMetrics() {
    return this.dashboard.getBusinessMetrics();
  }
  @Get('audit/recent')
  getRecentAudit() {
    return this.audit.getAuditLogs(undefined, undefined, '1', '20');
  }

  @Get('tickets')
  tickets() {
    return this.dashboard.ticketMetrics();
  }

  @Get('failed-transactions')
  failedTransactions() {
    return this.dashboard.failedTransactions();
  }
}

