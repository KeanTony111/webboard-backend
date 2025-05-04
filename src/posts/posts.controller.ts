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
	UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';
import { JwtAuthGuard } from '../auth/jwt.guard'; 
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get()
  async getAllPosts(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('order') order: string = 'DESC',
  ): Promise<{ posts: PostEntity[]; total: number }> {
    return this.postsService.getAllPosts(page, limit, order);
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
	@UsePipes(new ValidationPipe({ transform: true })) // Ensure transform is true for potential type conversions
  async createPost(
    @Body() createPostDto: CreatePostDto, // Only accept the DTO
    @Request() req, 
  ): Promise<PostEntity> {
    const userId = req.user.userId; 
    return this.postsService.createPost(
      createPostDto.title,
      createPostDto.detail,
      userId,
      createPostDto.communityId,
    );
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
