import { Injectable } from "@nestjs/common";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
// Services
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.configService.getOrThrow<string>("POSTGRES_HOST"),
      port: parseInt(
        this.configService.get<string>("POSTGRES_PORT") ?? "5432",
        10,
      ),
      username: this.configService.getOrThrow<string>("POSTGRES_USER"),
      password: this.configService.getOrThrow<string>("POSTGRES_PASSWORD"),
      database: this.configService.getOrThrow<string>("POSTGRES_DB"),
      autoLoadEntities: true,
      synchronize: true,

      entities: [__dirname + "/../**/*.entity{.ts,.js}"],

      migrationsTableName: "migration",

      migrations: ["src/migration/*.ts"],

      ssl: false,
    };
  }
}
