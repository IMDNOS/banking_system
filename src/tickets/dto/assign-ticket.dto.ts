import { IsUUID } from 'class-validator';

export class AssignTicketDto {
  @IsUUID()
  staffId: string;

  @IsUUID()
  ticket_id: string;
}
