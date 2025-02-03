import { Module } from '@nestjs/common';
import { ChatbotController } from './controllers/chatbot.controller';
import { ChatbotService } from './services/chatbot.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';



@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class AppModule {}
