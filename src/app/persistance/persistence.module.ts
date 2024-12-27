import { Module } from "@nestjs/common";
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


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
    }),
    TypeOrmModule.forFeature([User, City]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class PersistenceModule {}
