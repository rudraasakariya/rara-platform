import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PartnerType {
  SCHOOL = 'School',
  CO = 'Co',
  ORGANIZATION = 'Organization',
  OTHER = 'Other',
}

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ 
    description: 'The name of the partner',
    example: 'ABC School District',
    maxLength: 255
  })
  name: string;

  @IsOptional()
  @IsEnum(PartnerType)
  @ApiProperty({ 
    description: 'The type of partner',
    enum: PartnerType,
    required: false,
    nullable: true,
    example: PartnerType.SCHOOL
  })
  type?: PartnerType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ 
    description: 'The contact name for the partner',
    required: false,
    nullable: true,
    maxLength: 255
  })
  contactName?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ 
    description: 'The contact email for the partner',
    required: false,
    nullable: true,
    example: 'contact@partner.com'
  })
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ 
    description: 'The contact phone for the partner',
    required: false,
    nullable: true,
    maxLength: 20
  })
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    description: 'The address of the partner',
    required: false,
    nullable: true
  })
  address?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ 
    description: 'Whether the partner is active',
    required: false,
    default: true
  })
  active?: boolean;
}
