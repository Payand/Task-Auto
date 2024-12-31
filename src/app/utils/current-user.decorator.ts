import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { omit, pick } from "ramda";

export function kindOf(inp: any): string {
  return Object.prototype.toString.call(inp).slice(8, -1).toLowerCase();
}

export type IUser = {
  id: string;
  username: string;
};

type IUserProps = keyof IUser;
export const GetUser = createParamDecorator<IUserProps | Array<IUserProps>>(
  (prop, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();
    const pureUser = omit(["password"])(user) as IUser;

    if (Array.isArray(prop)) {
      return pick<IUser, IUserProps>(prop, pureUser);
    } else if (kindOf(prop) === "string") {
      return pureUser[prop];
    }

    return pureUser;
  },
);
