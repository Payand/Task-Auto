import { IQuery } from "@nestjs/cqrs";

export class GetMe implements IQuery {
    constructor(
        public readonly userId: string,
    ){}
}
