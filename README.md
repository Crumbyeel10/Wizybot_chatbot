
# Wizybot Chatbot

Wizybot Chatbot es una aplicación diseñada para buscar productos y convertir el valor de una moneda utilizando la API de finalización de chat de OpenAI con llamada de funciones..

## Requisitos previos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes:

📦 Dependencias principales:
NestJS (@nestjs/cli, @nestjs/schematics, @nestjs/testing) - Framework para construir aplicaciones en Node.js con TypeScript.
Axios (@types/axios) - Cliente HTTP basado en promesas.
Express (@types/express) - Framework minimalista para aplicaciones web en Node.js.
Supertest (supertest, @types/supertest) - Librería para pruebas de integración HTTP.

🛠️ Herramientas de desarrollo:
TypeScript (typescript, ts-node, ts-loader, tsconfig-paths) - Lenguaje de programación tipado basado en JavaScript.
ESLint y Prettier (eslint, eslint-config-prettier, eslint-plugin-prettier, @eslint/eslintrc, @eslint/js, typescript-eslint) - Herramientas de linting y formateo de código.
Jest y TS-Jest (jest, ts-jest, @types/jest) - Framework para pruebas unitarias.
Source Map Support (source-map-support) - Permite mejorar la depuración con soporte para mapas de código fuente.
SWC (@swc/cli, @swc/core) - Compilador rápido para TypeScript y JavaScript.

## Instalación

Sigue estos pasos para configurar el entorno de desarrollo:

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Crumbyeel10/Wizybot_chatbot.git
   cd Wizybot_chatbot

2.🔧 Instalación de dependencias:
Para instalar todas las dependencias necesarias, ejecuta el siguiente comando:

npm install

-Si deseas instalar solo las dependencias de desarrollo:

npm install --only=dev

3. Configurar variables de entorno:

Crea un archivo .env en la raíz del proyecto con las siguientes variables:

OPENAI_API_KEY_WIZZYBOT=tu_clave_api_de_openai
OPEN_EXCHANGE_API_KEY=tu_clave_api_de_open_exchange

Asegúrate de reemplazar tu_clave_api_de_openai y tu_clave_api_de_open_exchange con tus claves API correspondientes.

4.Ejecución
Para ejecutar la aplicación  utiliza el siguiente comando:

npm run start


Uso de la API
La aplicación expone un endpoint para interactuar con el chatbot:

Endpoint: /chatbot

Método HTTP: POST

URL: http://localhost:3000/chatbot



5.📡 API - Endpoints del Chatbot
El chatbot expone los siguientes endpoints para búsqueda de productos, conversión de divisas y procesamiento de consultas generales.

🔍 Buscar Productos
- Endpoint: POST /chatbot/search
- Descripción: Busca productos en la base de datos según una cadena de búsqueda.
- Cuerpo de la solicitud (JSON):
 json:
{
  "query": "iPhone"
}


Respuesta (JSON):

[
  {
    "id": 1,
    "name": "iPhone 13",
    "price": 999.99
  },
  {
    "id": 2,
    "name": "iPhone 14",
    "price": 1099.99
  }
]



6. 💱 Conversión de Moneda
Endpoint: POST /chatbot/convert
Descripción: Convierte una cantidad de una moneda a otra utilizando tasas de cambio en tiempo real.
Cuerpo de la solicitud (JSON):

{
  "amount": 100,
  "from": "USD",
  "to": "EUR"
}


Respuesta (JSON):

{
  "convertedAmount": "92.50 EUR"
}

7. 🤖 Procesar Consulta General
Endpoint: POST /chatbot/queryy
Descripción: Procesa una consulta general del usuario y devuelve una respuesta generada por el chatbot.
Cuerpo de la solicitud (JSON):

{
  "query": "Am I looking for a phone?"
}

Respuesta (JSON):

{
  "response": "It sounds like you are searching for a phone. Do you need recommendations?"
}


8. Cada uno de estos endpoints está documentado en Swagger, por lo que puedes acceder a la documentación interactiva en:

http://localhost:3000/api-docs#/
