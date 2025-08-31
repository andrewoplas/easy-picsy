import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Sign in with Supabase
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Sync user with our database
    await this.syncUser(data.user);

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata?.role || 'user',
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

    if (!data.user) {
      throw new UnauthorizedException('Registration failed');
    }

    // Sync user with our database
    await this.syncUser(data.user);

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  }

  async logout(token: string) {
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
      refresh_token: data.session.refresh_token,
    };
  }

  async getProfile(userId: string) {
    const db = this.databaseService.getDb();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.supabaseId, userId))
      .limit(1);

    if (!user.length) {
      throw new UnauthorizedException('User not found');
    }

    return user[0];
  }

  private async syncUser(supabaseUser: any) {
    const db = this.databaseService.getDb();
    
    // Check if user exists in our database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.supabaseId, supabaseUser.id))
      .limit(1);

    if (existingUser.length === 0) {
      // Create user in our database
      await db.insert(users).values({
        supabaseId: supabaseUser.id,
        email: supabaseUser.email,
        fullName: supabaseUser.user_metadata?.full_name || null,
        avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
        role: supabaseUser.user_metadata?.role || 'user',
        metadata: supabaseUser.user_metadata || {},
        lastLoginAt: new Date(),
      });
    } else {
      // Update last login
      await db
        .update(users)
        .set({
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.supabaseId, supabaseUser.id));
    }
  }
}