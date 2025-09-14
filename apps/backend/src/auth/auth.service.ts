import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Sign in with Supabase
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({ email, password });

    if (error || !data.user || !data.user.email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Sync user with our database
    await this.usersService.findOrCreateUser({
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata,
    });

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in || 3600,
      user: {
        id: data.user.id,
        email: data.user.email || '',
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;

    // Sign up with Supabase
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'user',
          },
        },
      });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new ConflictException('User already exists');
      }
      throw new UnauthorizedException(error.message);
    }

    if (!data.user || !data.user.email) {
      throw new UnauthorizedException('Registration failed');
    }

    // Sync user with our database
    await this.usersService.findOrCreateUser({
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata,
    });

    // For register, we might not have a session immediately if email confirmation is required
    if (!data.session) {
      throw new UnauthorizedException('Registration successful. Please check your email to verify your account.');
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in || 3600,
      user: {
        id: data.user.id,
        email: data.user.email || '',
      },
    };
  }

  async logout() {
    // Sign out from Supabase
    const { error } = await this.supabaseService
      .getClient()
      .auth.signOut();

    if (error) {
      throw new UnauthorizedException('Logout failed');
    }

    return { message: 'Logout successful' };
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.refreshSession({ refresh_token: refreshToken });

    if (error || !data.session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      access_token: data.session.access_token,
      expires_in: data.session.expires_in || 3600,
    };
  }

  async getProfile(userId: string) {
    try {
      return await this.usersService.findBySupabaseId(userId);
    } catch {
      throw new UnauthorizedException('User not found');
    }
  }

}