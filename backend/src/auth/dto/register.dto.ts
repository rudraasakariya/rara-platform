import { IsString, MaxLength, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BaseUserDto } from "./base-user.dto";
import { MessageCode, Messages } from "../../common/messages";

export class RegisterDto extends BaseUserDto {
  // Inherits email and password from BaseUserDto

  @IsNotEmpty({ message: Messages[MessageCode.FIRST_NAME_REQUIRED] })
  @IsString({ message: Messages[MessageCode.FIRST_NAME_MUST_BE_STRING] })
  @MaxLength(100, { message: Messages[MessageCode.FIRST_NAME_MAX_LENGTH] })
  @ApiProperty({ 
    description: 'First name of the user', 
    required: true,
    example: 'John',
    maxLength: 100
  })
  firstName: string;

  @IsNotEmpty({ message: Messages[MessageCode.LAST_NAME_REQUIRED] })
  @IsString({ message: Messages[MessageCode.LAST_NAME_MUST_BE_STRING] })
  @MaxLength(100, { message: Messages[MessageCode.LAST_NAME_MAX_LENGTH] })
  @ApiProperty({ 
    description: 'Last name of the user', 
    required: true,
    example: 'Doe',
    maxLength: 100
  })
  lastName: string;

  // Note: role is NOT included - it will be assigned by super admin
  // Default role will be 'tutor' for new registrations
}
