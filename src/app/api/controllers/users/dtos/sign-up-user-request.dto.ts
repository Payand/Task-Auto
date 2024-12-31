import { IsString, IsNotEmpty } from "class-validator";

export class SignUpUserRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
