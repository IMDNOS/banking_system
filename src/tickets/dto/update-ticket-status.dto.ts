import { IsEnum, IsUUID } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class UpdateTicketStatusDto {
  @IsUUID()
  ticketId: string;

  @IsEnum(TicketStatus)
  status: TicketStatus;
}
