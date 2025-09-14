import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({ status: 200, type: UserResponseDto })
  @Get('profile')
  @UseGuards(SupabaseAuthGuard)
  async getProfile(@Request() req: any): Promise<UserResponseDto> {
    return this.usersService.findBySupabaseId(req.user.id);
  }

  @ApiResponse({ status: 200, type: UserResponseDto })
  @Put('profile')
  @UseGuards(SupabaseAuthGuard)
  async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }
}
