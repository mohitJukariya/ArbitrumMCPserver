import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { McpModule } from './mcp/mcp.module';
import { ArbitrumModule } from './arbitrum/arbitrum.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        McpModule,
        ArbitrumModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
