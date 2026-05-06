import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsService } from './application/services/events/events.service';
import { BookingsService } from './application/services/bookings/bookings.service';
import { PaymentService } from './application/services/payment/payment.service';
import { PaymentGatewayService } from './infrastructure/external/payment-gateway/payment-gateway.service';
import { NotificationService } from './infrastructure/external/notification/notification.service';
import { EventsController } from './presentation/controllers/events/events.controller';
import { BookingsController } from './presentation/controllers/bookings/bookings.controller';
import { RefundsController } from './presentation/controllers/refunds/refunds.controller';

@Module({
  imports: [],
  controllers: [AppController, EventsController, BookingsController, RefundsController],
  providers: [AppService, EventsService, BookingsService, PaymentService, PaymentGatewayService, NotificationService],
})
export class AppModule {}
