import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from 'src/auth/dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateToken(parent: AuthDto) {
    const token = await this.jwtService.signAsync(
      {
        sub: parent.id,
        userName: parent.userName,
        email: parent.email,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '2 days',
      },
    );

    return { token: token };
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePassword(password: string, storedPassword: string) {
    return await bcrypt.compare(password, storedPassword);
  }
}
