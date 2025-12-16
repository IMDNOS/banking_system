import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      throw new UnauthorizedException();
    }

    return {
      access_token: this.jwt.sign({ sub: user.id, role: user.role }),
    };
  }
}
