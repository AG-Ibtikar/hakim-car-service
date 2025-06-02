import { Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';
import { FirebaseService } from './services/firebase.service';

@Module({
  providers: [S3Service, FirebaseService],
  exports: [S3Service, FirebaseService],
})
export class SharedModule {}