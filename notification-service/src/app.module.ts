import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NOTIFICATION_REPOSITORY } from './domain/repositories/notification.repository.interface';
import { NotificationEntity } from './infrastructure/persistence/notification.entity.schema';
import { NotificationRepository } from './infrastructure/persistence/notification.repository';

import { NotificationController } from './web/controllers/notification.controller';
import { NotificationEventsListener } from './web/controllers/notification-events.listener';

// import { CreateNotificationHandler } from './app/handlers/create-notification.handler';
import { DeleteNotificationHandler } from './app/handlers/delete-notification.handler';
import { GetAllNotificationsHandler } from './app/handlers/get-all-notifications.handler';
import { GetNotificationHandler } from './app/handlers/get-notification.handler';
import { UpdateNotificationHandler } from './app/handlers/update-notification.handler';
// import { CommissionCreatedHandler } from './app/handlers/commission-created.handler';
import { NotificationHandler } from './app/handlers/notification.handler';

@Module({
  imports: [
    ClientsModule.register([
      //first receiver client
      {
        name: 'PAID_RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
          ],
          queue: 'notifications_queue',
          queueOptions: { durable: true },
          exchange: 'orders_exchange',
          routingKey: 'order.accepted',
          noAck: false,
        },
      },
      //second receiver cliend
      {
        name: 'DECLINED_RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
          ],
          queue: 'notifications_queue',
          queueOptions: { durable: true },
          exchange: 'orders_exchange',
          routingKey: 'order.declined',
          noAck: false,
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
      entities: [NotificationEntity],
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    TypeOrmModule.forFeature([NotificationEntity]), //repo register
    CqrsModule,
  ],
  controllers: [NotificationController, NotificationEventsListener],
  providers: [
    NotificationHandler,
    // CreateNotificationHandler,
    DeleteNotificationHandler,
    GetAllNotificationsHandler,
    GetNotificationHandler,
    UpdateNotificationHandler,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationRepository,
    },
  ],
})
export class AppModule {}
