import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateCommunityDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  name?: string; // Optional

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string; // Optional
}