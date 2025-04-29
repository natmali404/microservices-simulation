// src/infrastructure/repositories/order.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepositoryInterface } from '../../domain/repositories/order.repository.interface';
import { Order } from '../../domain/entities/order.entity';
import { OrderEntity } from '../persistence/order.entity.schema'; // Twoja encja

@Injectable()
export class OrderRepository implements OrderRepositoryInterface {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  // Implementacja metody save
  async save(order: Order): Promise<void> {
    const orderEntity = new OrderEntity();
    orderEntity.orderId = order.orderId;
    orderEntity.customerId = order.customerId;
    orderEntity.orderDescription = order.orderDescription;

    await this.orderRepository.save(orderEntity); // Zapisz do bazy danych
  }

  // Implementacja metody findById
  async findById(orderId: string): Promise<Order | null> {
    const order = await this.orderRepository.findOne({ where: { orderId } });
    return order
      ? new Order(order.orderId, order.customerId, order.orderDescription)
      : null;
  }

  // Implementacja metody findAll
  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.find();
    return orders.map(
      (order) =>
        new Order(order.orderId, order.customerId, order.orderDescription),
    );
  }

  // Implementacja metody delete
  async delete(orderId: string): Promise<void> {
    await this.orderRepository.delete({ orderId });
  }

  // Implementacja metody findAllPaginated
  async findAllPaginated(skip: number, take: number): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      skip,
      take,
    });
    return orders.map(
      (order) =>
        new Order(order.orderId, order.customerId, order.orderDescription),
    );
  }
}
