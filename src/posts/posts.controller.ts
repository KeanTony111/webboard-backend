import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { JwtAuthGuard } from '../auth/jwt.guard'; 

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get()
  async getAllPosts(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<{ posts: PostEntity[]; total: number }> {
    return this.postsService.getAllPosts(page, limit);
  }

	@Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    try {
      return await this.postsService.getPostById(id);
    } catch (e) {
			if (e instanceof NotFoundException) {
				throw new NotFoundException(`Post with id ${id} not found`); 
			}
			throw e;
    }
  }

	@UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @Body('title') title: string,
    @Body('detail') detail: string,
    @Body('communityId', ParseIntPipe) communityId: number,
    @Request() req, // Assuming you have a JWT token in the request
  ): Promise<PostEntity> {
    const userId = req.user.userId; // Assuming the JWT payload has userId
    return this.postsService.createPost(title, detail, userId, communityId);
  }

	@UseGuards(JwtAuthGuard) 
  @Put(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title: string,
    @Body('detail') detail: string,
    @Request() req,
  ): Promise<PostEntity> {
    const userId = req.user.userId; // Assuming the JWT payload has userId
    try {
      return await this.postsService.updatePost(id, title, detail, userId);
    } catch (e) {
			if (e instanceof NotFoundException) {
				throw new NotFoundException(`Post with id ${id} not found`);
			}
			if (e instanceof UnauthorizedException) {
				throw new UnauthorizedException('You are not authorized to update this post');
			}
			throw e;
    }
  }

	@UseGuards(JwtAuthGuard) // Protect this route with JWT authentication
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<any> {
    const userId = req.user.userId; // Assuming the JWT payload has userId
    try {
      await this.postsService.deletePost(id, userId);
      return { status: 'success', message: `Post with ID ${id} deleted successfully` };
    } catch (e) {
			if (e instanceof NotFoundException) {
				throw new NotFoundException(`Post with id ${id} not found`);
			}
			if (e instanceof UnauthorizedException) {
				throw new UnauthorizedException('You are not authorized to delete this post');
			}
			throw e;
    }
  }
	
}
