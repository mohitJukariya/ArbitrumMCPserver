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
                {
                    name: 'getMultiBalance',
                    description: 'Get ETH balances for multiple addresses at once',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            addresses: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Array of Ethereum addresses to check balances for',
                            },
                        },
                        required: ['addresses'],
                    },
                },
                {
                    name: 'getERC20Transfers',
                    description: 'Get ERC-20 token transfers for an address',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            address: {
                                type: 'string',
                                description: 'Address to get token transfers for',
                            },
                            contractAddress: {
                                type: 'string',
                                description: 'Optional: specific token contract address',
                            },
                            startBlock: {
                                type: 'string',
                                description: 'Starting block number (default: 0)',
                            },
                            endBlock: {
                                type: 'string',
                                description: 'Ending block number (default: 99999999)',
                            },
                            page: {
                                type: 'string',
                                description: 'Page number (default: 1)',
                            },
                            offset: {
                                type: 'string',
                                description: 'Number of transfers per page (default: 10)',
                            },
                        },
                        required: ['address'],
                    },
                },
                {
                    name: 'getERC721Transfers',
                    description: 'Get ERC-721 (NFT) token transfers for an address',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            address: {
                                type: 'string',
                                description: 'Address to get NFT transfers for',
                            },
                            contractAddress: {
                                type: 'string',
                                description: 'Optional: specific NFT contract address',
                            },
                            startBlock: {
                                type: 'string',
                                description: 'Starting block number (default: 0)',
                            },
                            endBlock: {
                                type: 'string',
                                description: 'Ending block number (default: 99999999)',
                            },
                            page: {
                                type: 'string',
                                description: 'Page number (default: 1)',
                            },
                            offset: {
                                type: 'string',
                                description: 'Number of transfers per page (default: 10)',
                            },
                        },
                        required: ['address'],
                    },
                },
                {
                    name: 'getInternalTransactions',
                    description: 'Get internal transactions by address or transaction hash',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            address: {
                                type: 'string',
                                description: 'Address to get internal transactions for',
                            },
                            txHash: {
                                type: 'string',
                                description: 'Transaction hash to get internal transactions for',
                            },
                            startBlock: {
                                type: 'string',
                                description: 'Starting block number (default: 0)',
                            },
                            endBlock: {
                                type: 'string',
                                description: 'Ending block number (default: 99999999)',
                            },
                            page: {
                                type: 'string',
                                description: 'Page number (default: 1)',
                            },
                            offset: {
                                type: 'string',
                                description: 'Number of transactions per page (default: 10)',
                            },
                        },
                        required: [],
                    },
                },
                {
                    name: 'getContractSource',
                    description: 'Get verified contract source code and ABI',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            address: {
                                type: 'string',
                                description: 'Contract address to get source code for',
                            },
                        },
                        required: ['address'],
                    },
                },
                {
                    name: 'getTokenInfo',
                    description: 'Get detailed information about a token contract',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            contractAddress: {
                                type: 'string',
                                description: 'Token contract address to get info for',
                            },
                        },
                        required: ['contractAddress'],
                    },
                },
                {
                    name: 'getGasOracle',
                    description: 'Get gas price recommendations from Gas Oracle',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
                {
                    name: 'getTransactionStatus',
                    description: 'Get detailed transaction status and receipt',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            txHash: {
                                type: 'string',
                                description: 'Transaction hash to get status for',
                            },
                        },
                        required: ['txHash'],
                    },
                },
                {
                    name: 'getContractCreation',
                    description: 'Get contract creation transaction details',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            contractAddresses: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Array of contract addresses to get creation info for',
                            },
                        },
                        required: ['contractAddresses'],
                    },
                },
                {
                    name: 'getAddressType',
                    description: 'Determine if an address is a contract or EOA (externally owned account)',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            address: {
                                type: 'string',
                                description: 'Address to check type for',
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
            getMultiBalance: () => this.arbitrumService.getMultiBalance(args),
            getERC20Transfers: () => this.arbitrumService.getERC20Transfers(args),
            getERC721Transfers: () => this.arbitrumService.getERC721Transfers(args),
            getInternalTransactions: () => this.arbitrumService.getInternalTransactions(args),
            getContractSource: () => this.arbitrumService.getContractSource(args),
            getTokenInfo: () => this.arbitrumService.getTokenInfo(args),
            getGasOracle: () => this.arbitrumService.getGasOracle(args),
            getTransactionStatus: () => this.arbitrumService.getTransactionStatus(args),
            getContractCreation: () => this.arbitrumService.getContractCreation(args),
            getAddressType: () => this.arbitrumService.getAddressType(args),
        };

        const tool = tools[name];
        if (!tool) {
            throw new Error(`Tool "${name}" not found`);
        }

        return await tool();
    }
}
