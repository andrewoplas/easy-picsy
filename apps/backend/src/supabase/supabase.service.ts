import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '../config/config.service';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;

  constructor(private configService: ConfigService) {
    // Create regular client (for frontend-facing operations)
    this.supabase = createClient(this.configService.supabaseUrl, this.configService.supabaseAnonKey);

    // Create admin client (for backend operations)
    this.supabaseAdmin = createClient(this.configService.supabaseUrl, this.configService.supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getAdminClient(): SupabaseClient {
    return this.supabaseAdmin;
  }

  async verifyToken(token: string) {
    try {
      const {
        data: { user },
        error,
      } = await this.supabaseAdmin.auth.getUser(token);

      if (error || !user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  async getUserById(userId: string) {
    try {
      const {
        data: { user },
        error,
      } = await this.supabaseAdmin.auth.admin.getUserById(userId);

      if (error || !user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
}
