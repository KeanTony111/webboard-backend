import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Like, FindManyOptions } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
	constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

	 async getAllPosts(page: number = 1, limit: number = 10 ,order='DESC'): Promise<{ posts: Post[]; total: number }> {
		const [posts, total] = await this.postRepository.findAndCount({
			relations: ['user', 'community'],
			skip: (page - 1) * limit,
			take: limit,
			order: { createdAt: order === 'ASC' ? 'ASC' : 'DESC' },
		});

    return { posts, total };
  }

	async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'community'], 
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

	async createPost(title: string, detail: string, userId: number, communityId: number): Promise<Post> {
    const post = this.postRepository.create({
      title,
      detail,
      user: { id: userId }, 
      community: { id: communityId },
      userId,
      communityId
    });
    return this.postRepository.save(post);
  }

	async updatePost(id: number, title: string, detail: string, userId: number): Promise<Post> {
    const post = await this.getPostById(id); // Use getPostById to ensure the post exists

    if (post.userId !== userId) {
      throw new UnauthorizedException('You are not authorized to update this post');
    }

    post.title = title;
    post.detail = detail;
    return this.postRepository.save(post);
  }
	
	async deletePost(id: number, userId: number): Promise<void> {
     const post = await this.getPostById(id); // Use getPostById to ensure the post exists

     if (post.userId !== userId) {
        throw new UnauthorizedException('You are not authorized to delete this post');
     }

     await this.postRepository.remove(post);
  }
	
	async searchPosts(
    searchTerm: string | undefined,
    communityId: number | undefined,
    userId: number | undefined,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; total: number }> {
		const where: any = {};

		if (searchTerm && searchTerm.length >= 2) {
			where.title = Like(`%${searchTerm}%`);
		}
		if (communityId) {
			where.communityId = communityId;
		}
		if (userId) {
			where.userId = userId;
		}

		const options: FindManyOptions<Post> = {
			relations: ['user', 'community'],
			skip: (page - 1) * limit,
			take: limit,
			order: { createdAt: 'DESC' },
			where,
		};

		const [posts, total] = await this.postRepository.findAndCount(options);
		
    return { posts, total };
  }
}
