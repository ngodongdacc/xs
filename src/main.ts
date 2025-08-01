import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addBearerAuth()
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'jwt',
      in: 'header',
    })
    .addSecurityRequirements('bearer')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  const logger = new Logger('Main');
  const port = process.env.PORT ?? 4000;
  await app
    .listen(port)
    .then(() =>
      logger.verbose(
        'app start with swwagger:: ' + 'http://localhost:' + port + '/api',
      ),
    );
}
bootstrap();
