import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	//sign up
	@Post('signup')
	async signUp(@Body('username')username: string): Promise<any> {
		return this.authService.signUp(username);
	}

	//sign in
	@Post('signin')
	async signIn(@Body('username')username: string): Promise<any> {
		return this.authService.signIn(username);
	}
}
