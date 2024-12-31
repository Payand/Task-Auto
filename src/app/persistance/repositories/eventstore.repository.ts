// Decorators
import { Injectable } from "@nestjs/common";
// Services
import { EventStoreService } from "@root/app/persistance/config/eventstore.service";
// Models
import { User } from "@root/app/api/model/user.model";

@Injectable()
export class EventstoreRepository {
  constructor(private readonly eventStore: EventStoreService) {}

  async findOneById(id: string) {
    try {
      const user = new User();
      for await (const event of this.eventStore.readStreamFromStart(
        `signUp-${id}`,
      )) {
        user.apply(event, true);
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
