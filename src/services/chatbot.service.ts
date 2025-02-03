import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import axios from 'axios';

dotenv.config();

// Define la interfaz para los productos
interface Product {
    displayTitle: string;
    embeddingText: string;
    url: string;
    imageUrl: string;
    productType: string;
    discount: string;
    price: string;
    variants: string;
    createDate: string;
  }
//Define la interfaz para el cambio de moneda
  interface ExchangeRates {
    rates: { [key: string]: number };
}
//Define la interfaz para OpenAi
interface OpenAIResponse {
  choices: {
    message: {
      content: string | null;
    };
  }[];
}


@Injectable()
export class ChatbotService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    
  }

  //async processQuery(query: string): Promise<string> {
  //  // Lógica para interactuar con OpenAI y las herramientas
  //  return "Respuesta del chatbotsdst";
  //}
    
  
  // Función para buscar productos en el CSV
  async searchProducts(query: string): Promise<Product[]> {
    console.log(query)
    const results: Product[] = []; // Declara el tipo de results
  
    return new Promise((resolve, reject) => {
      // Verifica si el archivo existe
      if (!fs.existsSync('products_list.csv')) {
        reject(new Error('El archivo CSV no existe en la ruta especificada.'));
        return;
      }
  
      // Lee el archivo CSV
      fs.createReadStream('products_list.csv')
        .pipe(csv())
        .on('data', (data: Product) => { // Añade el tipo a "data"
          try {
            results.push(data); // Ahora TypeScript sabe que "data" es de tipo "Product"
          } catch (error) {
            console.log('Error al procesar una fila del CSV: ' + error.message)
          }
        })
        .on('end', () => {
          // Filtra los productos
          const filteredProducts = results.filter((product) => {
            return product.displayTitle?.toLowerCase().includes(query.toLowerCase()) || 
                   product.embeddingText?.toLowerCase().includes(query.toLowerCase());
                
          });
          resolve(filteredProducts.slice(0, 2));
        })
        .on('error', (error) => {
          
        });
    });
  }

// Función para convertir monedas
async convertCurrencies(amount: number, from: string, to: string): Promise<string> {
    const apiKey = process.env.OPENEXCHANGE_API_KEY;
    const url = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;

    try {
      const response = await axios.get<ExchangeRates>(url);
      const rates = response.data.rates;
      if (!rates[from] || !rates[to]) {
        throw new Error('Moneda no soportada');
      }
      return `$ ${amount * (rates[to] / rates[from])}`; 
    } catch (error) {
      throw new Error('Error al obtener las tasas de cambio');
    }
  }




  //Conexion iteraccion con openapi

  async processQuery(query: string): Promise<string> {
    try {
      // Paso 1: Primera llamada a OpenAI para determinar la herramienta
      const toolResponse: OpenAIResponse = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tienes las siguientes funciones disponibles: 
                      1. searchProducts(query) - Para buscar productos.
                      2. convertCurrencies(amount, from, to) - Para convertir monedas.
                      Indica qué función deseas usar para resolver la consulta del usuario.`,
          },
          {
            role: 'user',
            content: query,
          },
        ],
      });
  
      const toolCall = toolResponse.choices[0].message?.content;
      if (!toolCall) {
        return 'No se pudo determinar la herramienta a utilizar. Por favor, intenta reformular tu pregunta.';
      }
  
      // Paso 2: Ejecutar la herramienta correspondiente
      let result: string;
      if (toolCall.includes('searchProducts')) {
        const products = await this.searchProducts(query);
        result = products
          .map(
            (product) =>
              `Producto: ${product.displayTitle}, Precio: ${product.price}, URL: ${product.url}`,
          )
          .join('\n');
      } else if (toolCall.includes('convertCurrencies')) {
        // Extraer parámetros de la consulta (ejemplo: "Convertir 100 USD a EUR")
        const amountMatch = query.match(/\d+/);
        const fromMatch = query.match(/[A-Z]{3}/g);
        if (!amountMatch || !fromMatch || fromMatch.length < 2) {
          throw new Error('Formato de conversión no válido.');
        }
        const amount = parseFloat(amountMatch[0]);
        const from = fromMatch[0];
        const to = fromMatch[1];
        result = await this.convertCurrencies(amount, from, to);
      } else {
        result = 'No se pudo determinar la herramienta adecuada.';
      }
  
      // Paso 3: Segunda llamada a OpenAI para generar la respuesta final
      const finalResponse = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Un usuario pregunta: ${query}. Elegiste ejecutar la función ${toolCall}. El resultado fue: ${result}. Formula una respuesta final.`,
          },
        ],
      });
  
      return finalResponse.choices[0].message?.content || 'No se pudo obtener una respuesta';
    } catch (error) {
      console.error('Error en processQuery:', error);
      throw new Error('Hubo un error al procesar tu consulta.');
    }
  }



}

