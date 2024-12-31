import { BaseEvent } from "@root/app/api/controllers/users/events/impl/base.event";

export class UserSignedUpEvent extends BaseEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
  ) {
    super();
    this.eventType = Object.getPrototypeOf(this).constructor.name;
  }
}
