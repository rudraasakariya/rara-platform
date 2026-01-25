import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SearchSitesQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @ApiProperty({
    description: 'Filter sites by active status',
    required: false,
    example: true,
  })
  active?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter sites by city',
    required: false,
    example: 'New York',
  })
  city?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter sites by state',
    required: false,
    example: 'NY',
  })
  state?: string;
}
