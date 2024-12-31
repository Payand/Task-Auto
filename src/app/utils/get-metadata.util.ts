import { ClsService, ClsServiceManager } from "nestjs-cls";

export interface Metadata {
  /**
   * @description The trace ID of the request
   */
  traceId?: string;

  userId?: string;

  /**
   * @description The User's Device's Login session ID. Comes from Authorizer service
   */
  sessionId?: string;

  /**
   * @description The username of the request
   */
  username?: string;

  /**
   * @description The device ID of the request
   * @default ""
   */
  deviceId?: string;

  /**
   * @description The IP of the request
   */
  ip: string;

  /**
   * @description The tenant host of the request (if any)
   * @default ""
   */
  host: string;

  /**
   * @description If set to true, the service will not send the message
   * @default false
   */
  isTest?: boolean;

  /**
   * @description If set to true, the service will not log the message
   * @default true
   */
  isLoggable?: boolean;

  /**
   * @description The sent at of the request - when it was sent by the source service
   */
  sentAt?: number;
}

export function getMetadata(updatedFields: Partial<Metadata> = {}) {
  const cls: ClsService = ClsServiceManager.getClsService();

  const data = cls.get("metadata");

  return {
    ...data,
    ...updatedFields,
  };
}
