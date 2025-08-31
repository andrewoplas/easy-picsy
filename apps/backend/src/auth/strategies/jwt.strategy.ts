import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: any) {
    // For Supabase JWT, the payload contains the user's ID in the 'sub' field
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    // Verify the user exists in Supabase
    const user = await this.supabaseService.getUserById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return user data that will be attached to the request
    return {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'user',
      metadata: user.user_metadata,
    };
  }
}