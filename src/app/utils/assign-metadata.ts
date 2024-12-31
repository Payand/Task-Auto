import { ClsService } from "nestjs-cls";
import { ExecutionContext } from "@nestjs/common";

export function assignMetadata(
  cls: ClsService,
  context: ExecutionContext,
  fromGuard = false,
) {
  const request = fromGuard ? context : context.switchToHttp().getRequest();
  const { "device-id": deviceId = "" } = request.headers;
  const host: string =
    request.headers.host ?? request.headers["x-forwarded-host"];
  const { id: userId, username, detail = {} } = request.user || {};
  const traceId = cls.getId();
  const { ip: loginIp } = detail;
  const userAgent = request.headers["user-agent"];

  cls.set("metadata", {
    userId,
    username,
    deviceId,
    host,
    traceId,
    parentTraceId: traceId,
    loginIp,
    device: {
      userAgent,
    },
    parentSpan: "API",
    isTest: false,
    isLoggable: true,
    checkDestServiceReachable: false,
    sentAt: Date.now(),
    expiresIn: "1 minute",
  });
}
