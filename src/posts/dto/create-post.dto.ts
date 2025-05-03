import { IsString, IsNotEmpty, IsInt, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  detail: string;

  @IsInt()
  @IsNotEmpty()
  communityId: number;
}