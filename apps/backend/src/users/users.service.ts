import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { users, User } from '../database/schema';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  private transformToDto(user: User): UserResponseDto {
    return {
      id: user.id,
      supabaseId: user.supabaseId,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      permissions: Array.isArray(user.permissions) ? user.permissions as string[] : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
      metadata: user.metadata as Record<string, unknown>,
    };
  }

  async findBySupabaseId(supabaseId: string): Promise<UserResponseDto> {
    const db = this.databaseService.getDb();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.supabaseId, supabaseId))
      .limit(1);

    if (!user.length) {
      throw new NotFoundException('User not found');
    }

    return this.transformToDto(user[0]);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const db = this.databaseService.getDb();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user.length) {
      throw new NotFoundException('User not found');
    }

    return this.transformToDto(user[0]);
  }

  async updateUser(supabaseId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const db = this.databaseService.getDb();
    
    const updatedUsers = await db
      .update(users)
      .set({
        ...updateUserDto,
        updatedAt: new Date(),
      })
      .where(eq(users.supabaseId, supabaseId))
      .returning();

    if (!updatedUsers.length) {
      throw new NotFoundException('User not found');
    }

    return this.transformToDto(updatedUsers[0]);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const db = this.databaseService.getDb();
    const userList = await db.select().from(users);
    return userList.map(user => this.transformToDto(user));
  }

  async findOrCreateUser(supabaseUser: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
      role?: string;
    };
  }): Promise<UserResponseDto> {
    const db = this.databaseService.getDb();
    
    // Try to find existing user by supabaseId
    const user = await db
      .select()
      .from(users)
      .where(eq(users.supabaseId, supabaseUser.id))
      .limit(1);

    if (user.length) {
      return this.transformToDto(user[0]);
    }

    // If user doesn't exist, create them
    const newUser = await db
      .insert(users)
      .values({
        supabaseId: supabaseUser.id,
        email: supabaseUser.email,
        fullName: supabaseUser.user_metadata?.full_name || null,
        avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
        role: supabaseUser.user_metadata?.role || 'user',
        lastLoginAt: new Date(),
      })
      .returning();

    return this.transformToDto(newUser[0]);
  }
}