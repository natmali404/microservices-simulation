// src/web/controllers/notification.controller.ts
import {
  Body,
  Controller,
  //Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
//import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { UpdateNotificationDto } from '../dtos/update-notification.dto';
import { DeleteNotificationCommand } from '../../domain/commands/delete-notification.command';
import { GetAllNotificationsQuery } from '../../domain/queries/get-all-notifications.query';
import { UpdateNotificationCommand } from '../../domain/commands/update-notification.command';
//import { CreateNotificationCommand } from '../../domain/commands/create-notification.command';
import { GetNotificationQuery } from '../../domain/queries/get-notification.query';
import { NotificationResponseDto } from '../dtos/notification-response.dto';
//import { v4 as uuidv4 } from 'uuid';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  //ten mikroserwis nie powinien miec posta bo otwrzymuje zamowienia z innego mikroserwisu

  // @Post()
  // async createNotification(@Body() dto: CreateNotificationDto) {
  //   const notificationId = uuidv4();
  //   await this.commandBus.execute(
  //     new CreateNotificationCommand(notificationId, dto.customerId, dto.notificationDescription),
  //   );
  //   return {
  //     status: 'Notification created',
  //     notificationId,
  //     timestamp: new Date().toISOString(),
  //   };
  // }

  @Get(':id')
  async getNotification(
    @Param('id') id: string,
  ): Promise<NotificationResponseDto> {
    return this.queryBus.execute(new GetNotificationQuery(id));
  }

  @Patch(':id')
  async updateNotification(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    await this.commandBus.execute(
      new UpdateNotificationCommand(id, dto.newNotificationType),
    );
    return { status: 'Notification updated' };
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteNotificationCommand(id));
    return { status: 'Notification deleted' };
  }

  @Get()
  async getAllNotifications(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<NotificationResponseDto[]> {
    return this.queryBus.execute(new GetAllNotificationsQuery(page, limit));
  }
}
