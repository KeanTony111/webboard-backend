import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(username: string): Promise<any> {
    // Validate username
    if (!username || username.length < 3) {
      throw new HttpException('Username must be at least 3 characters', HttpStatus.BAD_REQUEST);
    }

    // Check if username exists
    const existingUser = await this.userRepository.findOne({ where: { username } });

    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    // Create new user
    const newUser = this.userRepository.create({ username });

    const savedUser = await this.userRepository.save(newUser);

    //Generate JWT
    const payload = { sub: savedUser.id, username: savedUser.username };
    const jwt = await this.jwtService.signAsync(payload);

    return {
      access_token: jwt
    }; 
  }

	async signIn(username: string): Promise<any> {
    // Find user
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new HttpException('Invalid username', HttpStatus.UNAUTHORIZED);
    }

    //Generate JWT
    const payload = { sub: user.id, username: user.username };
    const jwt = await this.jwtService.signAsync(payload);

    return {
        access_token: jwt
    };
  }
}
