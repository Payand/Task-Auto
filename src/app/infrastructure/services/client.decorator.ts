import { Inject } from "@nestjs/common";
// Constants
import { ZIPPOPTAM_MODULE_NAME } from "@root/app/infrastructure/constants";

export const InjectBridgeClient = (): ReturnType<typeof Inject> =>
  Inject(ZIPPOPTAM_MODULE_NAME);
