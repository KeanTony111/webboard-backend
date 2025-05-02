import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity'; 

@Injectable()
export class CommentsService {
	 constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
		@InjectRepository(Post)
		private readonly postRepository: Repository<Post>, // Inject the Post repository
  ) {}

	async getCommentsForPost(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'], 
      order: { createdAt: 'ASC' }, // Order by oldest first
    });
  }
	
	async createComment(commentDetail: string, postId: number, userId: number): Promise<Comment> {
		// validate that the post exists
		const post = await this.postRepository.findOne({
			where: { id: postId },
			relations: ['user'], 
		});

		if (!post) {
			throw new NotFoundException(`Post with ID ${postId} not found`);
		}

		const comment = this.commentRepository.create({
      commentDetail,
      post: { id: postId }, 
      user: { id: userId },
      postId,
      userId
    });
    return this.commentRepository.save(comment);
  }

}
