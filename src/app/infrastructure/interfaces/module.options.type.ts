// Types
import { HttpInstanceType } from "@root/app/infrastructure/interfaces/http-instance.type";

export interface BridgeModuleOptions extends HttpInstanceType {
  isGlobal?: boolean;
}
