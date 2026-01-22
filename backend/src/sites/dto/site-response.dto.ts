import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SiteResponseDto {
  @Expose()
  @ApiProperty({ description: 'The id of the site' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'The name of the site' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'The address of the site', nullable: true, required: false })
  address: string | null;

  @Expose()
  @ApiProperty({ description: 'The city where the site is located', nullable: true, required: false })
  city: string | null;

  @Expose()
  @ApiProperty({ description: 'The state where the site is located', nullable: true, required: false })
  state: string | null;

  @Expose()
  @ApiProperty({ description: 'The zip code of the site', nullable: true, required: false })
  zipCode: string | null;

  @Expose()
  @ApiProperty({ description: 'The phone number of the site', nullable: true, required: false })
  phone: string | null;

  @Expose()
  @ApiProperty({ description: 'The email address of the site', nullable: true, required: false })
  email: string | null;

  @Expose()
  @ApiProperty({ description: 'Whether the site is active' })
  active: boolean;

  @Expose()
  @ApiProperty({ description: 'The created at timestamp of the site' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The updated at timestamp of the site' })
  updatedAt: Date;
}
