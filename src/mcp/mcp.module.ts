import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';
import { ArbitrumModule } from '../arbitrum/arbitrum.module';

@Module({
    imports: [ArbitrumModule],
    controllers: [McpController],
    providers: [McpService],
})
export class McpModule { }
