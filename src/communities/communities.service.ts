import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from './communities.entity';

@Injectable()
export class CommunitiesService {
	constructor(
		@InjectRepository(Community)
		private readonly communityRepository: Repository<Community>,
	) {}

	async getAllCommunities(): Promise<Community[]> {
    return this.communityRepository.find();
  }

	async getCommunityById(id: number): Promise<Community> {
    const community = await this.communityRepository.findOne({ where: {id} });
    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }
    return community;
  }

	async createCommunity(name: string, description?: string): Promise<Community> {
    const community = this.communityRepository.create({ name, description });
    return this.communityRepository.save(community);
  }

  async updateCommunity(id: number, name?: string, description?: string): Promise<Community> {
    const community = await this.communityRepository.findOne({ where: {id} });
    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }

    if (name) {
      community.name = name;
    }
    if (description) {
      community.description = description;
    }

    return this.communityRepository.save(community);
  }

	async deleteCommunity(id: number): Promise<void> {
    const community = await this.communityRepository.findOne({ where: {id} });
    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }
    await this.communityRepository.remove(community); 
  }
}
