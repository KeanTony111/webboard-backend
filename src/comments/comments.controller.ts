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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
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

	@Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true })) 
  async createComment(
     @Request() req,
     @Body() createCommentDto: CreateCommentDto, 
  ): Promise<Comment> {

    // Get userId from sub claim in JWT token
    if (!req.user || !req.user.sub) {
      throw new Error('User ID not found in token');
    }
    
    const userId = req.user.sub; // Use sub from JWT token as userId
    return this.commentsService.createComment(
      createCommentDto.commentDetail,
      createCommentDto.postId,
      userId,
    );
  }

}
