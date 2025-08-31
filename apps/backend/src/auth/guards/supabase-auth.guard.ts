import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const user = await this.supabaseService.verifyToken(token);
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // Attach user to request object
    request.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'user',
      metadata: user.user_metadata,
    };

    return true;
  }
}