import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
      ],
      queue: 'notifications_queue',
      queueOptions: {
        durable: true,
      },
      exchange: 'orders_exchange',
      routingKey: 'order.paid',
      noAck: false,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
      ],
      queue: 'notifications_queue',
      queueOptions: {
        durable: true,
      },
      exchange: 'orders_exchange',
      routingKey: 'order.declined',
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3004);
}
bootstrap();
