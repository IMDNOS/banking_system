import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TicketStatus, UserRole } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private readonly db: PrismaService) {}

  // CUSTOMER: create ticket
  create(userId: string, dto: any) {
    return this.db.supportTicket.create({
      data: {
        subject: dto.subject,
        message: dto.message,
        userId,
      },
    });
  }

  // CUSTOMER: view own tickets
  getMyTickets(userId: string) {
    return this.db.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // STAFF: assign ticket
  async assignTicket(ticketId: string, staffId: string) {
    const ticket = await this.db.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) throw new BadRequestException('Ticket not found');

    const staff = await this.db.user.findUnique({ where: { id: staffId } });
    if (!staff) throw new BadRequestException('staff not found');

    return this.db.supportTicket.update({
      where: { id: ticketId },
      data: {
        assignedToId: staffId,
        status: TicketStatus.IN_PROGRESS,
      },
    });
  }

  async getAllTickets(dto: {
    status?: TicketStatus;
    page?: string;
    limit?: string;
  }) {
    const page = dto.page ? +dto.page : 1;
    const limit = dto.limit ? +dto.limit : 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(dto.status && { status: dto.status }),
    };

    const [data, total] = await this.db.$transaction([
      this.db.supportTicket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { full_name: true, email: true } },
          assignedTo: { select: { full_name: true } },
        },
      }),
      this.db.supportTicket.count({ where }),
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

  async getAssignedTickets(
    staffId: string,
    dto: {
      status?: TicketStatus;
      page?: string;
      limit?: string;
    },
  ) {
    const page = dto.page ? +dto.page : 1;
    const limit = dto.limit ? +dto.limit : 10;
    const skip = (page - 1) * limit;

    const where = {
      assignedToId: staffId,
      ...(dto.status && { status: dto.status }),
    };

    const [data, total] = await this.db.$transaction([
      this.db.supportTicket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { full_name: true, email: true } },
        },
      }),
      this.db.supportTicket.count({ where }),
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

  // STAFF: update status
  async updateStatus(
    ticketId: string,
    status: TicketStatus,
    user: { id: string; role: UserRole },
  ) {
    const ticket = await this.db.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) throw new BadRequestException();

    if (ticket.assignedToId !== user.id)
      throw new ForbiddenException('this ticket is not assigned to you');

    return this.db.supportTicket.update({
      where: { id: ticketId },
      data: {
        status,
        resolvedAt: status === TicketStatus.RESOLVED ? new Date() : null,
      },
    });
  }
}
