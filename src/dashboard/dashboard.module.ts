import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaService } from '../prisma.service';
import { AuditService } from '../audit/audit.service';
import { ReportsController } from './reports/reports.controller';
import { ReportsService } from './reports/reports.service';

@Module({
  controllers: [DashboardController,ReportsController],
  providers: [DashboardService,PrismaService,AuditService,ReportsService],
})
export class DashboardModule {}
