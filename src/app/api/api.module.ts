import { ExecutionContext, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PersistenceModule } from "@root/app/persistance/persistence.module";
import { InfrastructureModule } from "@root/app/infrastructure/infrastructure.module";
import { CityController } from "@root/app/api/controllers/users/city.controller";
import { AuthController } from "@root/app/api/controllers/cities/auth.controller";
import { EventHandlers } from "@root/app/api/controllers/users/events/handlers";
import { CommandHandlers } from "@root/app/api/controllers/users/commands/handlers";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClsInterceptor, ClsModule, ClsService } from "nestjs-cls";
import { randomUUID } from "node:crypto";
import { assignMetadata } from "@root/app/utils/assign-metadata";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { UserSignedUpEvent } from "@root/app/api/controllers/users/events/impl/user-signed-up.event";
import { QueryHandlers } from "@root/app/api/controllers/users/queries/handlers";
import { GlobalHttpCatchExceptionsFilter } from "@root/app/api/filters";

@Module({
  imports: [
    CqrsModule,
    InfrastructureModule.registerAsync({
      isGlobal: true,
    }),
    ClsModule.forRootAsync({
      global: true,
      useFactory: () => ({
        interceptor: {
          mount: true,
          generateId: true,
          idGenerator: (ctx: ExecutionContext) => {
            const req = ctx.switchToHttp().getRequest();
            const traceId = req.headers["x-trace-id"] ?? randomUUID();
            req.headers["x-trace-id"] = traceId;

            return traceId;
          },
          setup(cls: ClsService, context: ExecutionContext) {
            assignMetadata(cls, context);
          },
        },
      }),
    }),
    PersistenceModule.registerAsync({
      imports: [ConfigModule, CqrsModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        username: configService.get("EVENTSTORE_USERNAME", "admin"),
        password: configService.get("EVENTSTORE_PASSWORD", "changeit"),
        hostname: configService.get("EVENTSTORE_HOSTNAME", "localhost"),
        port: parseInt(configService.get("EVENTSTORE_PORT", "1113"), 10),
      }),
      subscriptions: {
        signUp: "$sig-user",
      },
      transformers: {
        UserSignedUpEvent: (event: any) => {
          new UserSignedUpEvent(event.data.userId, event.data.username);
        },
      },
    }),
  ],
  controllers: [AuthController, CityController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClsInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpCatchExceptionsFilter,
    },
  ],
})
export class ApiModule {}
