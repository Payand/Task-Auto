import { Module } from "@nestjs/common";
// Modules
import { InfrastructureModule } from "@root/app/infrastructure/infrastructure.module";
// Controllers
import { CityController } from "@root/app/api/controllers/city.controller";

@Module({
  imports: [
    InfrastructureModule.registerAsync({
      isGlobal: true,
    }),
  ],
  controllers: [CityController],
  providers: [],
})
export class ApiModule {}
