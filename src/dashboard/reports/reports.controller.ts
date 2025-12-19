// dashboard/reports/reports.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { DateRangeDto } from './dto/date-range.dto';

@Controller('dashboard/reports')
@Roles(UserRole.ADMIN, UserRole.MANAGER)
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  // 📄 Daily Transactions
  @Get('transactions')
  dailyTransactions(@Query() dto: DateRangeDto) {
    return this.reports.dailyTransactions(dto.from, dto.to);
  }

  // 📊 Account Summaries
  @Get('accounts')
  accountSummaries() {
    return this.reports.accountSummaries();
  }

  // 🧾 Audit Logs
  @Get('audit')
  auditLogs(@Query() dto: DateRangeDto) {
    return this.reports.auditLogs(dto.from, dto.to);
  }

  // 🧠 Support Snapshot
  @Get('snapshot')
  snapshot() {
    return this.reports.supportSnapshot();
  }
}
