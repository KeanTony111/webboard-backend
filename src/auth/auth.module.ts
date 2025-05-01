import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { jwtConstants } from './constants'; 
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiration },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports: [AuthService, JwtStrategy,PassportModule], // Export AuthService and JwtModule for use in other modules
})
export class AuthModule {}
