import { NestFactory } from "@nestjs/core";
import { ExecutionContext, Logger, ValidationPipe } from "@nestjs/common";
// Utilities
import { assignMetadata } from "@root/app/utils/assign-metadata";
// MiddleWares
import { ClsMiddleware, ClsService } from "nestjs-cls";
// Types
import { FastifyRequest } from "fastify";
// Filters
import { GlobalHttpCatchExceptionsFilter } from "@root/app/api/filters";
// Modules
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;
  await app.listen(port);

  app.use(
    new ClsMiddleware({
      saveReq: true,
      saveRes: true,
      generateId: true,
      idGenerator: (req: FastifyRequest) => {
        const traceId = req.headers["x-trace-id"] as string;
        req.headers["x-trace-id"] = traceId;

        return traceId;
      },
      setup(cls: ClsService, context: ExecutionContext) {
        assignMetadata(cls, context, true);
      },
    }).use,
  );
  app.useGlobalFilters(new GlobalHttpCatchExceptionsFilter());

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

(async () => {
  await bootstrap();
})();
