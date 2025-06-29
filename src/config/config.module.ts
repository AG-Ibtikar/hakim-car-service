import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import validate from './env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {} 