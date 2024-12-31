import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
// Utilities
import { isObject } from "@root/app/utils/is-object.util";
// Types
import { FastifyReply, FastifyRequest } from "fastify";

interface ExceptionResponse {
  message?: string | Record<string, string>;
  errorType?: string;
  status?: number;
}

function isExceptionResponse(response: unknown): response is ExceptionResponse {
  return (
    response &&
    typeof response === "object" &&
    ("message" in response || "errorType" in response || "status" in response)
  );
}

@Catch()
export class GlobalHttpCatchExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : ((typeof (exception as { status?: number }).status === "number"
            ? (exception as { status?: number }).status
            : (exception as { error?: { status?: number } })?.error?.status) ??
          HttpStatus.INTERNAL_SERVER_ERROR);

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    const responseMessage = isExceptionResponse(exceptionResponse)
      ? exceptionResponse.message
      : exception instanceof Error
        ? exception.message
        : "An unknown error occurred";

    const errorType = isExceptionResponse(exceptionResponse)
      ? exceptionResponse.errorType
      : "unknown";

    const xCorrelationId = request.headers["x-correlation-id"] || "";
    const timestamp = new Date().toISOString();

    let messageValue = "";
    if (isObject(responseMessage)) {
      messageValue =
        responseMessage.error ?? responseMessage.description ?? "Unknown error";
    } else {
      messageValue = responseMessage as string;
    }

    const isJsonError: boolean = messageValue.includes("in JSON at position");
    if (isJsonError) {
      messageValue = "فرمت داده‌های ورودی صحیح نمی‌باشد!";
    } else {
      messageValue = messageValue.startsWith("Cannot ")
        ? "مسیر مورد نظر وجود ندارد!"
        : messageValue;
    }

    response.status(status).header("X-Correlation-Id", xCorrelationId).send({
      statusCode: status,
      timestamp,
      path: request.url,
      message: messageValue,
      code: errorType,
      traceId: xCorrelationId,
    });
  }
}
