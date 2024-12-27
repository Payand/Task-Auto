import { Module } from "@nestjs/common";
// Modules
import { ApiModule } from "@root/app/api/api.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApiModule,
  ],
})
export class AppModule {}
