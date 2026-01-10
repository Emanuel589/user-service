import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';

interface JwtPayload {
  sub: string; // normalmente el userId
  userName: string; // o cualquier otro campo que incluyas
  iat?: number; // optional issued at
  exp?: number; // optional expiration
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('🔍 JWT Payload:', payload); // 👈 AGREGAR
    const user = await this.usersService.findOne(payload.sub);
    console.log('✅ User active:', user?.isActive); // 👈 AGREGAR

    if (!user || !user.isActive) {
      console.log('❌ Unauthorized: User not found or inactive'); // 👈 AGREGAR
      throw new UnauthorizedException();
    }
    console.log('✅ Validation successful'); // 👈 AGREGAR

    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      mustChangePassword: user.mustChangePassword,
    };
  }
}
