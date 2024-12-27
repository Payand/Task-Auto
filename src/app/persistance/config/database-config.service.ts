import { Injectable } from "@nestjs/common";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
// Services
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProduction: boolean =
      this.configService.get<string>("MODE") !== "DEV";

    return {
      type: "postgres",
      host: this.configService.get<string>("POSTGRES_HOST"),
      port: parseInt(
        this.configService.get<string>("POSTGRES_PORT") ?? "5432",
        10,
      ),
      username: this.configService.get<string>("POSTGRES_USER"),
      password: this.configService.get<string>("POSTGRES_PASSWORD"),
      database: this.configService.get<string>("POSTGRES_DB"),
      autoLoadEntities: true,
      synchronize: true,

      // entities: ["dist/**/*.entity{.ts,.js}"],
      // If you run in dev mode with ts-node, you might do:
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],

      migrationsTableName: "migration",
      // Same note on .ts or .js migrations:
      // migrations: ["dist/src/migration/*.js"],
      // or `migrations: ['src/migration/*.ts']` in dev.
      migrations: ["src/migration/*.ts"],

      ssl: isProduction,
      // For real production with SSL, you may need extra config like:
      //   extra: { ssl: { rejectUnauthorized: false } }
      // depending on your DB provider.
    };
  }
}
