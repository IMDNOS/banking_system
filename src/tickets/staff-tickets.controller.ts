import { Body, Controller, Get, Patch, Query, Req } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { GetStaffTicketsDto } from './dto/get-staff-tickets.dto';

@Controller('staff-tickets')
export class StaffTicketsController {
  constructor(private readonly tickets: TicketsService) {}

  // STAFF
  @Roles(UserRole.TELLER, UserRole.MANAGER, UserRole.ADMIN)
  @Get()
  getAll(@Query() dto: GetStaffTicketsDto) {
    return this.tickets.getAllTickets(dto);
  }

  @Roles(UserRole.TELLER, UserRole.MANAGER, UserRole.ADMIN)
  @Get('assigned/me')
  getAssignedToMe(@Req() req: any, @Query() dto: GetStaffTicketsDto) {
    return this.tickets.getAssignedTickets(req.user.id, dto);
  }

  // STAFF
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @Patch('assign')
  assign(@Body() dto: AssignTicketDto) {
    return this.tickets.assignTicket(dto.ticket_id, dto.staffId);
  }

  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.TELLER)
  @Patch('status')
  updateStatus(@Body() dto: UpdateTicketStatusDto, @Req() req: any) {
    return this.tickets.updateStatus(dto.ticketId, dto.status, req.user);
  }
}
