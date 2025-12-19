import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class GetStaffTicketsDto {
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
