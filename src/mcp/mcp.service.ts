import { Injectable } from '@nestjs/common';
import { ArbitrumService } from '../arbitrum/arbitrum.service';

@Injectable()
export class McpService {
    constructor(private arbitrumService: ArbitrumService) { }

    async listTools() {
        return {
            tools: [
                {
                    name: 'getBalance',
                    description: 'Get ETH balance for any address',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            address: {
                                type: 'string',
                                description: 'Ethereum address to check balance for',
                            },
                        },
                        required: ['address'],
                    },
                },
                {
                    name: 'getTransaction',
                    description: 'Get transaction details by hash',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            txHash: {
                                type: 'string',
                                description: 'Transaction hash to lookup',
                            },
                        },
                        required: ['txHash'],
                    },
                },
                {
                    name: 'getTransactionReceipt',
                    description: 'Get transaction receipt by hash',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            txHash: {
                                type: 'string',
                                description: 'Transaction hash to get receipt for',
                            },
                        },
                        required: ['txHash'],
                    },
                },
                {
                    name: 'getBlock',
                    description: 'Get block information by number',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            blockNumber: {
                                type: 'string',
                                description: 'Block number (hex or decimal) or "latest"',
                            },
                        },
                        required: [],
                    },
                },
                {
                    name: 'getLatestBlock',
                    description: 'Get latest block number',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
                {
                    name: 'getTransactionHistory',
                    description: 'Get transaction history for an address',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            address: {
                                type: 'string',
                                description: 'Address to get transaction history for',
                            },
                            startBlock: {
                                type: 'string',
                                description: 'Starting block number',
                            },
                            endBlock: {
                                type: 'string',
                                description: 'Ending block number',
                            },
                            page: {
                                type: 'string',
                                description: 'Page number',
                            },
                            offset: {
                                type: 'string',
                                description: 'Number of transactions per page',
                            },
                        },
                        required: ['address'],
                    },
                },
                {
                    name: 'getContractAbi',
                    description: 'Get ABI for a contract address',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            address: {
                                type: 'string',
                                description: 'Contract address to get ABI for',
                            },
                        },
                        required: ['address'],
                    },
                },
                {
                    name: 'getTokenBalance',
                    description: 'Get token balance for an address',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            contractAddress: {
                                type: 'string',
                                description: 'Token contract address',
                            },
                            address: {
                                type: 'string',
                                description: 'Address to check token balance for',
                            },
                        },
                        required: ['contractAddress', 'address'],
                    },
                },
                {
                    name: 'getGasPrice',
                    description: 'Get current gas price',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
                {
                    name: 'getEthSupply',
                    description: 'Get total ETH supply on Arbitrum',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
                {
                    name: 'validateAddress',
                    description: 'Validate Ethereum address format',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            address: {
                                type: 'string',
                                description: 'Address to validate',
                            },
                        },
                        required: ['address'],
                    },
                },
            ],
        };
    }

    async callTool(name: string, args: any) {
        const tools = {
            getBalance: () => this.arbitrumService.getBalance(args),
            getTransaction: () => this.arbitrumService.getTransaction(args),
            getTransactionReceipt: () => this.arbitrumService.getTransactionReceipt(args),
            getBlock: () => this.arbitrumService.getBlock(args),
            getLatestBlock: () => this.arbitrumService.getLatestBlock(args),
            getTransactionHistory: () => this.arbitrumService.getTransactionHistory(args),
            getContractAbi: () => this.arbitrumService.getContractAbi(args),
            getTokenBalance: () => this.arbitrumService.getTokenBalance(args),
            getGasPrice: () => this.arbitrumService.getGasPrice(args),
            getEthSupply: () => this.arbitrumService.getEthSupply(),
            validateAddress: () => this.arbitrumService.validateAddress(args),
        };

        const tool = tools[name];
        if (!tool) {
            throw new Error(`Tool "${name}" not found`);
        }

        return await tool();
    }
}
