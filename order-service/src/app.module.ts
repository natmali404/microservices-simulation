import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './web/controllers/order.controller';
import { CreateOrderHandler } from './app/handlers/create-order.handler';
import { OrderRepository } from './infrastructure/persistence/order.repository';

import { ORDER_REPOSITORY } from './domain/repositories/order.repository.interface';

//import { Order } from './domain/entities/order.entity';
import { OrderEntity } from './infrastructure/persistence/order.entity.schema';
import { DeleteOrderHandler } from './app/handlers/delete-order.handler';
import { GetAllOrdersHandler } from './app/handlers/get-all-orders.handler';
import { GetOrderHandler } from './app/handlers/get-order.handler';
import { UpdateOrderHandler } from './app/handlers/update-order.handler';

import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDERS_RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
          ],
          queue: 'orders_queue',
          queueOptions: { durable: true },
          exchange: 'orders_exchange',
          routingKey: 'order.created',
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
      entities: [OrderEntity],
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    TypeOrmModule.forFeature([OrderEntity]), // Rejestracja repozytorium
    CqrsModule,
  ],
  controllers: [
    OrderController, // <- Dodaj tutaj OrderController
  ],
  providers: [
    CreateOrderHandler,
    DeleteOrderHandler,
    GetAllOrdersHandler,
    GetOrderHandler,
    UpdateOrderHandler,
    //OrderRepository,
    {
      provide: ORDER_REPOSITORY, //token
      useClass: OrderRepository,
    },
  ],
})
export class AppModule {}
