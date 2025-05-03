import { Controller, Get ,Query,ParseIntPipe,} from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { Post as PostEntity } from '../posts/post.entity';

@Controller('search')
export class SearchController {
constructor(private readonly postsService: PostsService) {}
  @Get('posts')
	async searchPosts(
			@Query('searchTerm') searchTerm: string | undefined,
			@Query('communityId', new ParseIntPipe({ optional: true })) communityId: number | undefined,
			@Query('userId', new ParseIntPipe({ optional: true })) userId: number | undefined,
			@Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
			@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
	): Promise<{ posts: PostEntity[]; total: number }> {
			return this.postsService.searchPosts(searchTerm, communityId, userId, page, limit);
	}
}
