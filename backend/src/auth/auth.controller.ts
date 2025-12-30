import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiConflictResponse,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { MessageCode, Messages } from '../common/messages';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '../common/roles/roles.enum';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticate user with email and password. Returns JWT access token and user information.',
  })
  @ApiOkResponse({
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: Messages[MessageCode.INVALID_CREDENTIALS],
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account. Default role is "tutor". Returns JWT access token and user information.',
  })
  @ApiOkResponse({
    description: 'Registration successful',
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({
    description: Messages[MessageCode.USER_ALREADY_EXISTS],
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration information',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get current authenticated user',
    description: 'Returns the currently authenticated user information based on JWT token.',
  })
  @ApiOkResponse({
    description: 'User information retrieved successfully',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing authentication token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Get('admin/test')
  @ApiOperation({
    summary: 'Test admin endpoint',
    description: 'Test endpoint to verify role-based authorization. Requires ADMIN or SUPER_ADMIN role.',
  })
  @ApiOkResponse({
    description: 'Access granted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Admin access granted',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing authentication token',
  })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async adminTest() {
    return { message: 'Admin access granted' };
  }
}
