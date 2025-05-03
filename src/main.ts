import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import { HttpExceptionFilter } from './common/filters/http-exception.filter'; 

async function bootstrap() {
const config = configuration();
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  await app.listen(config.port ?? 3001);
}
bootstrap();
