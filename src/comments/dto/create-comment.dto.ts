import { IsString, IsNotEmpty, IsInt, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  commentDetail: string;

  @IsInt()
  @IsNotEmpty()
  postId: number;
}
