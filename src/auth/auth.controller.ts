import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { IsPublic } from './decorators/public.decorator';


@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @IsPublic()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password,dto.accountNumber);
  }
}
