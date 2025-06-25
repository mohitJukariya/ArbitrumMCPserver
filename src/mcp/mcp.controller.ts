import { Controller, Post, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { McpService } from './mcp.service';

interface McpRequest {
    jsonrpc: string;
    id: string | number;
    method: string;
    params?: any;
}

interface McpResponse {
    jsonrpc: string;
    id: string | number;
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

@Controller('mcp')
export class McpController {
    constructor(private mcpService: McpService) { }

    @Post()
    async handleMcpRequest(
        @Body() request: McpRequest,
        @Headers() headers: any,
    ): Promise<McpResponse> {
        try {
            // Handle different MCP methods
            switch (request.method) {
                case 'tools/list':
                    const tools = await this.mcpService.listTools();
                    return {
                        jsonrpc: request.jsonrpc,
                        id: request.id,
                        result: tools,
                    };

                case 'tools/call':
                    const { name, arguments: args } = request.params;

                    const result = await this.mcpService.callTool(name, args);
                    return {
                        jsonrpc: request.jsonrpc,
                        id: request.id,
                        result,
                    };

                case 'initialize':
                    return {
                        jsonrpc: request.jsonrpc,
                        id: request.id,
                        result: {
                            protocolVersion: '2024-11-05',
                            capabilities: {
                                tools: {},
                            },
                            serverInfo: {
                                name: 'Arbitrum Analytics Service',
                                version: '1.0.0',
                            },
                        },
                    };

                case 'ping':
                    return {
                        jsonrpc: request.jsonrpc,
                        id: request.id,
                        result: {},
                    };

                default:
                    return {
                        jsonrpc: request.jsonrpc,
                        id: request.id,
                        error: {
                            code: -32601,
                            message: `Method "${request.method}" not found`,
                        },
                    };
            }
        } catch (error) {
            return {
                jsonrpc: request.jsonrpc,
                id: request.id,
                error: {
                    code: -32603,
                    message: 'Internal error',
                    data: error.message,
                },
            };
        }
    }
}
