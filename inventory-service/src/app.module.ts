import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { FINAL_ORDER_REPOSITORY } from './domain/repositories/final-order.repository.interface';
import { FinalOrderEntity } from './infrastructure/persistence/final-order.entity.schema';
import { FinalOrderRepository } from './infrastructure/persistence/final-order.repository';

import { FinalOrderController } from './web/controllers/final-order.controller';
import { PaymentEventsListener } from './web/controllers/payment-events.listener';

import { CreateFinalOrderHandler } from './app/handlers/create-final-order.handler';
import { DeleteFinalOrderHandler } from './app/handlers/delete-final-order.handler';
import { GetAllFinalOrdersHandler } from './app/handlers/get-all-final-orders.handler';
import { GetFinalOrderHandler } from './app/handlers/get-final-order.handler';
import { UpdateFinalOrderHandler } from './app/handlers/update-final-order.handler';
import { PaymentCreatedHandler } from './app/handlers/payment-created.handler';

import { InventoryTrackerService } from './domain/services/inventory-tracker.service';

@Module({
  imports: [
    ClientsModule.register([
      //receiver client
      {
        name: 'FINAL_ORDERS_RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
          ],
          queue: 'inventory_queue',
          queueOptions: { durable: true },
          exchange: 'orders_exchange',
          routingKey: 'order.paid',
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
      entities: [FinalOrderEntity],
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    TypeOrmModule.forFeature([FinalOrderEntity]), //repo register
    CqrsModule,
  ],
  controllers: [FinalOrderController, PaymentEventsListener],
  providers: [
    InventoryTrackerService,
    PaymentCreatedHandler,
    CreateFinalOrderHandler,
    DeleteFinalOrderHandler,
    GetAllFinalOrdersHandler,
    GetFinalOrderHandler,
    UpdateFinalOrderHandler,
    {
      provide: FINAL_ORDER_REPOSITORY,
      useClass: FinalOrderRepository,
    },
  ],
})
export class AppModule {}
