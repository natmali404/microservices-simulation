import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PAYMENT_REPOSITORY } from './domain/repositories/payment.repository.interface';
import { PaymentEntity } from './infrastructure/persistence/payment.entity.schema';
import { PaymentRepository } from './infrastructure/persistence/payment.repository';

import { PaymentController } from './web/controllers/payment.controller';
import { PaymentEventsListener } from './web/controllers/payment-events.listener';

import { CreatePaymentHandler } from './app/handlers/create-payment.handler';
import { DeletePaymentHandler } from './app/handlers/delete-payment.handler';
import { GetAllPaymentsHandler } from './app/handlers/get-all-payments.handler';
import { GetPaymentHandler } from './app/handlers/get-payment.handler';
import { UpdatePaymentHandler } from './app/handlers/update-payment.handler';
import { CommissionCreatedHandler } from './app/handlers/commission-created.handler';

@Module({
  imports: [
    ClientsModule.register([
      //receiver client
      {
        name: 'PAYMENTS_RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
          ],
          queue: 'payments_queue',
          queueOptions: { durable: true },
          exchange: 'orders_exchange',
          routingKey: 'order.accepted',
          noAck: false,
        },
      },
      //sender client
      {
        name: 'INVENTORY_SENDER_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
          ],
          exchange: 'orders_exchange',
          queue: 'inventory_queue',
          routingKey: 'order.paid',
        },
      },
      {
        name: 'NOTIFICATION_SENDER_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
          ],
          exchange: 'orders_exchange',
          queue: 'notifications_queue',
          routingKey: 'order.paid',
        },
      },
    ]),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [PaymentEntity],
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    TypeOrmModule.forFeature([PaymentEntity]), //repo register
    CqrsModule,
  ],
  controllers: [PaymentController, PaymentEventsListener],
  providers: [
    CommissionCreatedHandler,
    CreatePaymentHandler,
    DeletePaymentHandler,
    GetAllPaymentsHandler,
    GetPaymentHandler,
    UpdatePaymentHandler,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentRepository,
    },
  ],
})
export class AppModule {}
