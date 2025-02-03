import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from '../services/chatbot.service';
import { ApiBody, ApiResponse, ApiTags, ApiOperation  } from '@nestjs/swagger';
import { ChatbotQueryDto } from '../dto/chatbot-query.dto';


@ApiTags('Chatbot') 
@Controller('chatbot') 
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('search')
  @ApiOperation({ summary: 'Search Products' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string', example: 'iPhone', description: 'The search string' },
      },
      required: ['query'], // El campo 'query' es obligatorio
    },
  })
  async searchProducts(@Body() body: { query: string }): Promise<any[]> {
    const { query } = body;
    return this.chatbotService.searchProducts(query);
  }

  @Post('convert')
  @ApiOperation({ summary: 'Convert Currency' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 100 },
        from: { type: 'string', example: 'USD' },
        to: { type: 'string', example: 'EUR' },
      },
    },
  })
  async convertCurrencies(
    @Body('amount') amount: number,
    @Body('from') from: string,
    @Body('to') to: string,
  ): Promise<string> {
    return await this.chatbotService.convertCurrencies(amount, from, to);
  }

  @Post('queryy')
  @ApiOperation({ summary: 'Process general query' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string', example: 'Am I looking for a phone?', description: 'The users query' },
      },
      required: ['query'],
    },
  })
  @ApiResponse({ status: 200, description: 'Respuesta del chatbot', type: String }) // Tipa la respuesta como String
  async handleQuery(@Body() chatbotQueryDto: ChatbotQueryDto): Promise<string> {
    return this.chatbotService.processQuery(chatbotQueryDto.query);
  }
}