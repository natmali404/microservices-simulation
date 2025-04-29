export class UpdateNotificationCommand {
  constructor(
    public readonly notificationId: string,
    public readonly newNotificationType: 'email' | 'sms' | 'push',
  ) {}
}
