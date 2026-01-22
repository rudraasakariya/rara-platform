import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PartnerType } from './create-partner.dto';

@Exclude()
export class PartnerResponseDto {
  @Expose()
  @ApiProperty({ description: 'The id of the partner' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'The name of the partner' })
  name: string;

  @Expose()
  @ApiProperty({ 
    description: 'The type of partner',
    enum: PartnerType,
    nullable: true,
    required: false
  })
  type: PartnerType | null;

  @Expose()
  @ApiProperty({ 
    description: 'The contact name for the partner',
    nullable: true,
    required: false
  })
  contactName: string | null;

  @Expose()
  @ApiProperty({ 
    description: 'The contact email for the partner',
    nullable: true,
    required: false
  })
  contactEmail: string | null;

  @Expose()
  @ApiProperty({ 
    description: 'The contact phone for the partner',
    nullable: true,
    required: false
  })
  contactPhone: string | null;

  @Expose()
  @ApiProperty({ 
    description: 'The address of the partner',
    nullable: true,
    required: false
  })
  address: string | null;

  @Expose()
  @ApiProperty({ description: 'Whether the partner is active' })
  active: boolean;

  @Expose()
  @ApiProperty({ description: 'The created at timestamp of the partner' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The updated at timestamp of the partner' })
  updatedAt: Date;
}
