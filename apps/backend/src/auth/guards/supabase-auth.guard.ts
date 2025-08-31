import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private usersService: UsersService
  ) {}

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

    const supabaseUser = await this.supabaseService.verifyToken(token);
    
    if (!supabaseUser) {
      throw new UnauthorizedException('Invalid token');
    }

    // Find or create user in local database
    const localUser = await this.usersService.findOrCreateUser(supabaseUser);

    // Attach user to request object
    request.user = {
      id: localUser.id, // Use local database user ID
      sub: localUser.id, // Use local database user ID for JWT compatibility
      supabaseId: supabaseUser.id,
      email: supabaseUser.email,
      role: supabaseUser.user_metadata?.role || 'user',
      metadata: supabaseUser.user_metadata,
      localUser, // Include full local user object for reference
    };

    return true;
  }
}