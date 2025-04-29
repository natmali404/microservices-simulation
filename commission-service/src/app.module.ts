import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { COMMISSION_REPOSITORY } from './domain/repositories/commission.repository.interface';
import { CommissionEntity } from './infrastructure/persistence/commission.entity.schema';
import { CommissionRepository } from './infrastructure/persistence/commission.repository';

import { CommissionController } from './web/controllers/commission.controller';
import { CommissionEventsListener } from './web/controllers/commission-events.listener';

import { CreateCommissionHandler } from './app/handlers/create-commission.handler';
import { DeleteCommissionHandler } from './app/handlers/delete-commission.handler';
import { GetAllCommissionsHandler } from './app/handlers/get-all-commissions.handler';
import { GetCommissionHandler } from './app/handlers/get-commission.handler';
import { UpdateCommissionHandler } from './app/handlers/update-commission.handler';
import { OrderCreatedHandler } from './app/handlers/order-created.handler';

@Module({
  imports: [
    ClientsModule.register([
      //receiver client
      {
        name: 'RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
          ],
          queue: 'orders_queue',
          queueOptions: { durable: true },
          exchange: 'orders_exchange',
          routingKey: 'order.created',
          noAck: false,
        },
      },
      //sender client
      {
        name: 'COMMISSIONS_RABBITMQ_CLIENT_ACCEPTED',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
          ],
          exchange: 'orders_exchange',
          exchangeType: 'direct',
          routingKey: 'order.accepted',
          queue: 'payments_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'COMMISSIONS_RABBITMQ_CLIENT_DECLINED',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
          ],
          exchange: 'orders_exchange',
          exchangeType: 'direct',
          routingKey: 'order.declined',
          queue: 'notifications_queue',
          queueOptions: {
            durable: true,
          },
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
      entities: [CommissionEntity],
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    TypeOrmModule.forFeature([CommissionEntity]), //repo register
    CqrsModule,
  ],
  controllers: [CommissionController, CommissionEventsListener],
  providers: [
    OrderCreatedHandler,
    CreateCommissionHandler,
    DeleteCommissionHandler,
    GetAllCommissionsHandler,
    GetCommissionHandler,
    UpdateCommissionHandler,
    {
      provide: COMMISSION_REPOSITORY,
      useClass: CommissionRepository,
    },
  ],
})
export class AppModule {}
