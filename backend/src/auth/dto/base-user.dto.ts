import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MessageCode, Messages } from "../../common/messages";

export abstract class BaseUserDto {
  @IsNotEmpty({ message: Messages[MessageCode.EMAIL_REQUIRED] })
  @IsEmail({}, { message: Messages[MessageCode.EMAIL_INVALID] })
  @ApiProperty({ 
    description: 'The email address of the user',
    example: 'user@example.com',
    required: true,
  })
  email: string;

  @IsNotEmpty({ message: Messages[MessageCode.PASSWORD_REQUIRED] })
  @IsString({ message: Messages[MessageCode.PASSWORD_MUST_BE_STRING] })
  @MinLength(8, { message: Messages[MessageCode.PASSWORD_MIN_LENGTH] })
  @MaxLength(32, { message: Messages[MessageCode.PASSWORD_MAX_LENGTH] })
  @ApiProperty({ 
    description: 'The password of the user. Must be between 8 and 32 characters.',
    example: 'SecurePass123!',
    minLength: 8,
    maxLength: 32,
    required: true,
  })
  password: string;
}

