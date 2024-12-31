import { ICommand as ICqrsCommand } from "@nestjs/cqrs";

export interface ICommand<T> extends ICqrsCommand {
  data: T;
}
