import { DynamicModule, Module } from "@nestjs/common";
// Modules
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
// Services
import { DatabaseConfigService } from "@root/app/persistance/config/database-config.service";
// Entities
import { User } from "@root/app/persistance/entities";
import { City } from "@root/app/persistance/entities/city.entity";
// Repositories
import { UserRepository } from "@root/app/persistance/repositories";
import { EventStoreService } from "@root/app/persistance/config/eventstore.service";
import { EventstoreRepository } from "@root/app/persistance/repositories/eventstore.repository";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
    }),
    TypeOrmModule.forFeature([User, City]),
  ],
  providers: [UserRepository, EventStoreService, EventstoreRepository],
  exports: [UserRepository, EventStoreService, EventstoreRepository],
})
export class PersistenceModule {
  static registerAsync(options: Record<string, any>): DynamicModule {
    const config = {
      provide: "ES_CONFIG",
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
    const transformers = {
      provide: "TRANSFORMERS",
      useValue: options.transformers,
    };
    const subscriptions = {
      provide: "SUBSCRIPTIONS",
      useValue: options.subscriptions,
    };
    return {
      module: PersistenceModule,
      imports: options.imports,
      global: true,
      providers: [config, transformers, subscriptions],
      exports: [
        options.imports.find(
          (i: Record<string, string>) => i.name === "CqrsModule",
        ),
        config,
        transformers,
        subscriptions,
      ],
    };
  }
}
