import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for cross-origin requests
    app.use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    }));

    // Global prefix for API routes
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 4000;
    await app.listen(port);

    console.log(`🚀 Arbitrum MCP Server is running on: http://localhost:${port}`);
    console.log(`📊 Health check available at: http://localhost:${port}/api/health`);
    console.log(`🔧 MCP endpoint available at: http://localhost:${port}/api/mcp`);
}

bootstrap();
