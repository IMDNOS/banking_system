import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetLogsDto } from './dto/get-logs.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Roles(UserRole.ADMIN)
  @Get('audit')
  getAuditLogs(@Query() dto: GetLogsDto) {
    return this.auditService.getAuditLogs(
      dto.entityType,
      dto.entityId,
      dto.page,
      dto.limit,
    );
  }

}
