import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: true, credentials: true })
  const port = Number(process.env.PORT ?? 8080)
  await app.listen(port)
}

bootstrap().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
