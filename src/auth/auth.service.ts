import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
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

  async forgotPassword(email: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate reset token
    const token = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    // Save token to user
    user.reset_token = token;
    user.reset_token_expires = expires;
    await this.userService.update(user.id, user);

    // Send email
    const data = {
      name: user.name,
      subject: 'Password Reset Request',
      message: `To reset your password, click this link: http://localhost:3000/reset-password?token=${token}`,
    };

    await this.emailService.sendEmail(
      email,
      'Password Reset Request',
      '',
      data,
    );

    return {
      message: 'Password reset instructions have been sent to your email',
    };
  }

  async resetPassword(token: string, password: string, passwordConfirmation: string): Promise<any> {
    if (password !== passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    // Find user by reset token
    const user = await this.userService.findOneByResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    // Check if token is expired
    if (!user.reset_token_expires || user.reset_token_expires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Update password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Clear reset token and update password
    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_expires = null;
    await this.userService.update(user.id, user);

    return {
      message: 'Password has been reset successfully',
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
