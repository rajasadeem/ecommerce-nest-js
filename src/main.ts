import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './config/env.config';
import { UseGlobalPipes } from './config/globalpipes.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  UseGlobalPipes(app);

  const port = envConfig.port;

  await app.listen(port, () => {
    console.log(`server running: http://localhost:${port}`);
  });
}
bootstrap();
