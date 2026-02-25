import { PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID, ArrayUnique, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  @ApiProperty({
    description: 'Replace students assigned to the session.',
    type: [String],
    required: false,
  })
  studentIds?: string[];
}
