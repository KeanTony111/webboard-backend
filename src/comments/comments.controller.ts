import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  NotFoundException,
	UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto'; 

@Controller('comments')
export class CommentsController {
	 constructor(private readonly commentsService: CommentsService) {}

	@Get(':postId') 
  async getCommentsForPost(@Param('postId', ParseIntPipe) postId: number): Promise<Comment[]> {
    try {
      return await this.commentsService.getCommentsForPost(postId);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
  }

	@Post() // POST /comments
  @UsePipes(new ValidationPipe()) 
  async createComment(
     @Body() createCommentDto: CreateCommentDto, 
  ): Promise<Comment> {
     return this.commentsService.createComment(
      createCommentDto.commentDetail,
      createCommentDto.postId,
      createCommentDto.userId,
    );
  }

}
