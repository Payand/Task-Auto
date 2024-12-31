import { ICommand } from "@root/app/api/interfaces";
// DTOs
import { SignUpUserRequestDto } from "src/app/api/controllers/users/dtos";

export class SignUpUserCommand implements ICommand<SignUpUserRequestDto> {
  constructor(public readonly data: SignUpUserRequestDto) {}
}
