import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto'; 
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	//sign up
	@Post('signup')
	 async signUp(@Body() SignUpDto: SignUpDto) { 
    return this.authService.signUp(SignUpDto.username);
  }

	//sign in
	@Post('signin')
	@UsePipes(new ValidationPipe())
	async signIn(@Body() signInDto: SignInDto) { 
		return this.authService.signIn(signInDto.username);
	}

}
