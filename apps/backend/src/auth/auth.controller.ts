import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../types/auth.types';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyTokenResponseDto } from './dto/verify-token-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password using Supabase'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto
  })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'User registration',
    description: 'Register new user with email and password using Supabase'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: AuthResponseDto
  })
  @ApiBadRequestResponse({ description: 'Invalid input or email already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'User logout',
    description: 'Logout user and invalidate JWT token'
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    type: LogoutResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async logout(): Promise<LogoutResponseDto> {
    return this.authService.logout();
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate new access token using refresh token'
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Token refresh successful',
    type: RefreshTokenResponseDto
  })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Get('profile')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve current user profile information'
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async getProfile(@Request() req: AuthenticatedRequest): Promise<UserResponseDto> {
    return this.authService.getProfile(req.user.supabaseId);
  }

  @Get('verify')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Verify JWT token',
    description: 'Validate current JWT token and return user information'
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
    type: VerifyTokenResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
  async verifyToken(@Request() req: AuthenticatedRequest): Promise<VerifyTokenResponseDto> {
    return {
      valid: true,
      user: req.user,
    };
  }
}