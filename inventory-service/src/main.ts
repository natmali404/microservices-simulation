import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { InventoryTrackerService } from './domain/services/inventory-tracker.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://ylfjftem:95SRLPi8Voo2pOTkdvI375ELx0V-Zpk2@stingray.rmq.cloudamqp.com/ylfjftem',
      ],
      queue: 'inventory_queue',
      queueOptions: {
        durable: true,
      },
      exchange: 'orders_exchange',
      routingKey: 'order.paid',
      noAck: false,
    },
  });

  await app.init();

  const tracker = app.get(InventoryTrackerService);
  await tracker.onModuleInit();

  await app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();
