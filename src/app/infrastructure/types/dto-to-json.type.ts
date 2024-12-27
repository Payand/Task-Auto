import { NonFunctionProperties } from "@root/app/infrastructure/types/non-function-properties";

type EncryptedCredentials = {
  encryptedCredentials: string;
};
export type DtoToJSON<
  T,
  WithEC extends boolean = false,
> = NonFunctionProperties<WithEC extends true ? T & EncryptedCredentials : T>;