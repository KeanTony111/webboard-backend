import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';

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

	@Post() 
  async createComment(
    @Body('commentDetail') commentDetail: string,
    @Body('postId', ParseIntPipe) postId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<Comment> {
    console.log('userId', userId);
    return this.commentsService.createComment(commentDetail, postId, userId);
  }

}
