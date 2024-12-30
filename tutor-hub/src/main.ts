import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('This is the API documentation for our NestJS application.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    // origin: 'https://tutor-hub-react-front-ge8kxm9sl-hermons-projects-a9b361c1.vercel.app'
  };
  app.enableCors(corsOptions);
  await app.listen(3000);
}
bootstrap();
