import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { MessageCode, Messages } from '../common/messages';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(Messages[MessageCode.INVALID_CREDENTIALS]);
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException(Messages[MessageCode.INVALID_CREDENTIALS]);
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async register(registerDto: RegisterDto) {

    const existingUser = await this.userRepository.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new ConflictException(Messages[MessageCode.USER_ALREADY_EXISTS]);
    }

    const user = this.userRepository.create({
      email: registerDto.email,
      passwordHash: await bcrypt.hash(registerDto.password, 10),
      role: 'tutor',
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      isActive: true,
    });

    await this.userRepository.save(user);

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token: access_token,
      user: user,
    };
  }
}