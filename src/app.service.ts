import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Arbitrum MCP Server with HTTP Transport!';
    }
}
