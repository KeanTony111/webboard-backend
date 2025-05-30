import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { ormconfig } from './config/ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunitiesModule } from './communities/communities.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { SearchModule } from './search/search.module';

const appModules = [
  UsersModule,
  AuthModule,
  CommunitiesModule,
  PostsModule,
  CommentsModule,
  SearchModule
]
const config = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormconfig),
    ...appModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
