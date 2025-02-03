import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Importa Swagger


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Chatbot API') // Título de la API
    .setDescription('API para interactuar con el chatbot de Wizybot') // Descripción
    .setVersion('1.0') // Versión de la API
    .build();

  // Genera el documento de Swagger
  const document = SwaggerModule.createDocument(app, config);

  // Configura la ruta para acceder a la documentación
  SwaggerModule.setup('api-docs', app, document);

  // Inicia la aplicación
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();