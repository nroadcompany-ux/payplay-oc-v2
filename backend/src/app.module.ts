import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'
import { CoreMockController } from './core-mock.controller'

@Module({
  controllers: [HealthController, CoreMockController],
})
export class AppModule {}
