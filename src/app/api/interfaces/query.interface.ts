import { IQuery as ICqrsQuery } from "@nestjs/cqrs";

export interface IQuery<T> extends ICqrsQuery {
  data: T;
}
