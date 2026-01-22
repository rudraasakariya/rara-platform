import { IsString, IsOptional, IsEmail, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSiteDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ 
    description: 'The name of the site',
    required: false,
    maxLength: 255
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    description: 'The address of the site',
    required: false,
    nullable: true
  })
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ 
    description: 'The city where the site is located',
    required: false,
    nullable: true,
    maxLength: 100
  })
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ 
    description: 'The state where the site is located',
    required: false,
    nullable: true,
    maxLength: 50
  })
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ 
    description: 'The zip code of the site',
    required: false,
    nullable: true,
    maxLength: 20
  })
  zipCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ 
    description: 'The phone number of the site',
    required: false,
    nullable: true,
    maxLength: 20
  })
  phone?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ 
    description: 'The email address of the site',
    required: false,
    nullable: true,
    example: 'contact@site.com'
  })
  email?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ 
    description: 'Whether the site is active',
    required: false
  })
  active?: boolean;
}
