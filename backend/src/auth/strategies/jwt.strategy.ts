import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { MessageCode, Messages } from '../../common/messages';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configService.get<string>('JWT_SECRET')!,
      });
  }

  async validate(payload: { email: string; sub: string }) {
    const user = await this.userRepository.findOne({ 
      where: { id: payload.sub } 
    });
    
    if (!user) {
      throw new UnauthorizedException(Messages[MessageCode.USER_NOT_FOUND]);
    }
    
    return user; // This becomes available as req.user
  }
}