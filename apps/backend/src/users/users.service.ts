import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async findBySupabaseId(supabaseId: string) {
    const db = this.databaseService.getDb();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.supabaseId, supabaseId))
      .limit(1);

    if (!user.length) {
      throw new NotFoundException('User not found');
    }

    return user[0];
  }

  async findByEmail(email: string) {
    const db = this.databaseService.getDb();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user.length) {
      throw new NotFoundException('User not found');
    }

    return user[0];
  }

  async updateUser(supabaseId: string, updateUserDto: UpdateUserDto) {
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

    return updatedUsers[0];
  }

  async getAllUsers() {
    const db = this.databaseService.getDb();
    return await db.select().from(users);
  }

  async findOrCreateUser(supabaseUser: any) {
    const db = this.databaseService.getDb();
    
    // Try to find existing user by supabaseId
    let user = await db
      .select()
      .from(users)
      .where(eq(users.supabaseId, supabaseUser.id))
      .limit(1);

    if (user.length) {
      return user[0];
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

    return newUser[0];
  }
}