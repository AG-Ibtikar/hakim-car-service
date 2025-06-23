import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
