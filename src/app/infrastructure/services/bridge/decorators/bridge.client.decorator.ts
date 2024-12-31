import { Inject } from "@nestjs/common";
// Constants
import { ZIPPOPTAM_MODULE_NAME } from "src/app/infrastructure/services/bridge/constants";

export const InjectBridgeClient = (): ReturnType<typeof Inject> =>
  Inject(ZIPPOPTAM_MODULE_NAME);
