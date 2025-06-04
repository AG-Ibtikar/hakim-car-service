import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { ServicesModule } from './services/services.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AppConfigModule } from './config/config.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    BookingsModule,
    ServicesModule,
    VehiclesModule,
    ReviewsModule,
    NotificationsModule,
    ServiceRequestsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
