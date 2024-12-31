import { AggregateRoot } from "@nestjs/cqrs";

export class User extends AggregateRoot {
  public id: string;
  public username: string;

  constructor() {
    super();
    this.autoCommit = true;
  }
}
