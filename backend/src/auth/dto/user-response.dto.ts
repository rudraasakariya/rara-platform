import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: ['admin', 'tutor', 'super_admin'],
    example: 'tutor',
  })
  role: 'admin' | 'tutor' | 'super_admin';

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    nullable: true,
    required: false,
  })
  firstName: string | null;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    nullable: true,
    required: false,
  })
  lastName: string | null;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Timestamp of last login',
    example: '2024-01-15T10:30:00Z',
    nullable: true,
    required: false,
  })
  lastLoginAt: Date | null;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}

