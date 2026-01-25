import { IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PartnerType } from './create-partner.dto';

export class SearchPartnersQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @ApiProperty({
    description: 'Filter partners by active status',
    required: false,
    example: true,
  })
  active?: boolean;

  @IsOptional()
  @IsEnum(PartnerType)
  @ApiProperty({
    description: 'Filter partners by type',
    enum: PartnerType,
    required: false,
    example: PartnerType.SCHOOL,
  })
  type?: PartnerType;
}
