import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	//sign up
	async signUp(username: string): Promise<any> {
		return this.authService.signUp(username);
	}

	//sign in
	async signIn(username: string): Promise<any> {
		return this.authService.signIn(username);
	}
}
