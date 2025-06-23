import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { ServicesModule } from './services/services.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [UsersModule, AuthModule, BookingsModule, ServicesModule, VehiclesModule, ReviewsModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
