import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private readonly db: PrismaService) {}

  async getAuditLogs(
    entityType?: string,
    entityId?: string,
    dto_page?: string,
    dto_limit?: string,
  ) {
    const page = dto_page ? +dto_page : 1;
    const limit = dto_limit ? +dto_limit : 10;


    const skip = (page - 1) * limit;

    const where = {
      ...(entityType && { entityType }),
      ...(entityId && { entityId }),
    };

    const [data, total] = await this.db.$transaction([
      this.db.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.db.auditLog.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async log(params: {
    action: AuditAction;
    entityType: string;
    entityId: string;
    performedById?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.db.auditLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        performedById: params.performedById,
        metadata: params.metadata ?? {},
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  }
}
