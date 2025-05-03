import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, NotFoundException, HttpStatus,UsePipes, ValidationPipe  } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { Community } from './community.entity';
import { CreateCommunityDto } from './dto/create-community.dto'; 
import { UpdateCommunityDto } from './dto/update-community.dto';  

@Controller('communities')
export class CommunitiesController {
	constructor(private readonly communitiesService: CommunitiesService) {}

	@Get()
  async getAllCommunities(): Promise<Community[]> {
    return this.communitiesService.getAllCommunities();
  }

	@Get(':id')
  async getCommunityById(@Param('id', ParseIntPipe) id: number): Promise<Community> {
    try {
      return await this.communitiesService.getCommunityById(id);
    } catch (e) {
			if (e instanceof NotFoundException) {
				throw e; 
			}
			throw new NotFoundException(`Community with id ${id} not found`);
    }
  }

	@Post()
  @UsePipes(new ValidationPipe())
  async createCommunity(@Body() createCommunityDto: CreateCommunityDto): Promise<Community> {
    return this.communitiesService.createCommunity(createCommunityDto.name, createCommunityDto.description);
  }

	@Put(':id')
	@UsePipes(new ValidationPipe())
  async updateCommunity(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommunityDto: UpdateCommunityDto, 
  ): Promise<Community> {
    try {
      return await this.communitiesService.updateCommunity(id, updateCommunityDto.name, updateCommunityDto.description);
			
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e; 
      }
			throw new NotFoundException(`Community with id ${id} not found`);
    }
  }

	@Delete(':id')
  async deleteCommunity(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      await this.communitiesService.deleteCommunity(id);
      return { status: 'success', message: `Community with ID ${id} deleted successfully` }; // Return success message
    } catch (e) {
       if (e instanceof NotFoundException) {
          throw e; 
       }
			 throw new NotFoundException(`Community with id ${id} not found`);
    }
  }
}
