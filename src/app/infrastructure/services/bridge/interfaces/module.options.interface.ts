import { HttpInstanceInterface } from "@root/app/infrastructure/services/bridge/interfaces/http-instance.interface";

export interface BridgeModuleOptions extends HttpInstanceInterface {
  isGlobal?: boolean;
}
