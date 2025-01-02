import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as net from 'net';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';


async function findAvailablePort(startPort: number, endPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const checkPort = (port: number) => {
      if (port > endPort) {
        reject(new Error(`No available port between ${startPort} and ${endPort}`));
        return;
      }
      
      const server = net.createServer();

      server.once('error', () => {
        checkPort(port + 1);
      });

      server.once('listening', () => {
        server.close(() => resolve(port));
      });

      server.listen(port);
    };

    checkPort(startPort);
  });
}

async function bootstrap() {
  const startPort = 8000;
  const endPort = 8005;
  const port = await findAvailablePort(startPort, endPort).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
  const app = await NestFactory.create(AppModule);

  // Use cookie parser middleware to parse cookies from incoming requests
  app.use(cookieParser());

  // Set the global prefix for all routes
  app.setGlobalPrefix('api/');

  // Enable CORS to allow requests from different origins
    app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });



  // Swagger API documentation configuration
  const config =new DocumentBuilder()
        .setTitle('Nwiki Core API')
        .setDescription('API for managing and retrieving content from Nwiki')
        .setVersion('1.0.0')
        .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);



  // Start the application on the specified
  await app.listen(port);

  // Log the URL of the running application to the console
  console.log(`Application is running on port  \n http://127.0.0.1:${port}/api`);
}
bootstrap();
