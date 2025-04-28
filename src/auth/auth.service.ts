import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, name: string, password: string, passwordConfirmation: string): Promise<any> {
    // Check if passwords match
    if (password !== passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Create user
    const user = await this.userService.create({
      email,
      name,
      password,
      role: 'USER',
    });

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      email_verified_at: user.email_verified_at,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(email: string, pass: string, _remember: boolean): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const hash = user?.password ? user.password : '';
    const updatedHash = hash.replace(/^\$2y\$/, '$2b$');
    const isMatch = await bcrypt.compare(pass, updatedHash);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      email_verified_at: user.email_verified_at,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: _remember == true ? '30d' : '1h',
      }),
    };
  }
}
