import { Controller, Get } from '@nestjs/common'

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      service: 'payplay-oc-v2',
      status: 'ok',
      execution: 'AUTHORIZED_WITH_HOLD',
      physicalBinding: 'HOLD',
    }
  }
}
