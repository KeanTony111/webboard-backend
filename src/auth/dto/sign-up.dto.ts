import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class SignUpDto { 
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;
}