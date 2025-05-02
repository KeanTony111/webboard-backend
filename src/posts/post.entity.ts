import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Timestamp } from 'typeorm';
import { User } from '../auth/user.entity';
import { Community } from '../communities/community.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  detail: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Community, community => community.id)
  @JoinColumn({ name: 'community_id' }) 
  community: Community;

  @Column({ name: 'user_id' })  
  userId: number;

  @Column({ name: 'community_id' })  
  communityId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Timestamp;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Timestamp;
}