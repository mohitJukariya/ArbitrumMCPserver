import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import {
    ArbitrumBalance,
    ArbitrumTransaction,
    ArbitrumBlock,
    ArbitrumStats,
    ArbitrumTxReceipt,
    McpToolResult,
    GetBalanceParams,
    GetTransactionParams,
    GetBlockParams,
    GetTransactionHistoryParams,
    GetContractAbiParams,
    GetTokenBalanceParams,
    GetGasPriceParams,
    GetLatestBlockParams,
    ValidateAddressParams,
} from '../types';

@Injectable()
export class ArbitrumService {
    private readonly baseUrl = 'https://api.arbiscan.io/api';
    private readonly apiKey: string;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('ARBISCAN_API_KEY') || '';
    }

    async getBalance({ address }: GetBalanceParams): Promise<McpToolResult> {
        try {
            const response = await axios.get<ArbitrumBalance>(
                `${this.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.apiKey}`
            );

            const balanceInEth = parseFloat(response.data.result) / Math.pow(10, 18);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            address,
                            balance: response.data.result,
                            balanceInEth: balanceInEth.toFixed(6),
                            status: response.data.status,
                            message: response.data.message,
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching balance: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getTransaction({ txHash }: GetTransactionParams): Promise<McpToolResult> {
        try {
            const response = await axios.get(
                `${this.baseUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${this.apiKey}`
            );

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(response.data, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching transaction: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getTransactionReceipt({ txHash }: GetTransactionParams): Promise<McpToolResult> {
        try {
            const response = await axios.get<{ result: ArbitrumTxReceipt }>(
                `${this.baseUrl}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${this.apiKey}`
            );

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(response.data, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching transaction receipt: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getBlock({ blockNumber = 'latest' }: GetBlockParams): Promise<McpToolResult> {
        try {
            const response = await axios.get<{ result: ArbitrumBlock }>(
                `${this.baseUrl}?module=proxy&action=eth_getBlockByNumber&tag=${blockNumber}&boolean=true&apikey=${this.apiKey}`
            );

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(response.data, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching block: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getLatestBlock({ }: GetLatestBlockParams): Promise<McpToolResult> {
        try {
            const response = await axios.get(
                `${this.baseUrl}?module=proxy&action=eth_blockNumber&apikey=${this.apiKey}`
            );

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            latestBlockNumber: response.data.result,
                            latestBlockDecimal: parseInt(response.data.result, 16),
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching latest block: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getTransactionHistory({
        address,
        startBlock = '0',
        endBlock = '99999999',
        page = '1',
        offset = '10',
    }: GetTransactionHistoryParams): Promise<McpToolResult> {
        try {
            const response = await axios.get<{ result: ArbitrumTransaction[] }>(
                `${this.baseUrl}?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${offset}&sort=desc&apikey=${this.apiKey}`
            );

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(response.data, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching transaction history: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getContractAbi({ address }: GetContractAbiParams): Promise<McpToolResult> {
        try {
            const response = await axios.get(
                `${this.baseUrl}?module=contract&action=getabi&address=${address}&apikey=${this.apiKey}`
            );

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(response.data, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching contract ABI: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getTokenBalance({
        contractAddress,
        address,
    }: GetTokenBalanceParams): Promise<McpToolResult> {
        try {
            const response = await axios.get(
                `${this.baseUrl}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${this.apiKey}`
            );

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(response.data, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching token balance: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getGasPrice({ }: GetGasPriceParams): Promise<McpToolResult> {
        try {
            const response = await axios.get(
                `${this.baseUrl}?module=proxy&action=eth_gasPrice&apikey=${this.apiKey}`
            );

            const gasPriceWei = parseInt(response.data.result, 16);
            const gasPriceGwei = gasPriceWei / Math.pow(10, 9);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            gasPriceHex: response.data.result,
                            gasPriceWei,
                            gasPriceGwei: gasPriceGwei.toFixed(2),
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching gas price: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getEthSupply(): Promise<McpToolResult> {
        try {
            const response = await axios.get<ArbitrumStats>(
                `${this.baseUrl}?module=stats&action=ethsupply&apikey=${this.apiKey}`
            );

            const supplyInEth = parseFloat(response.data.result) / Math.pow(10, 18);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            totalSupply: response.data.result,
                            totalSupplyInEth: supplyInEth.toFixed(2),
                            status: response.data.status,
                            message: response.data.message,
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching ETH supply: ${error.message}`,
                    },
                ],
            };
        }
    }

    async validateAddress({ address }: ValidateAddressParams): Promise<McpToolResult> {
        try {
            const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            address,
                            isValid,
                            format: isValid ? 'valid Ethereum address' : 'invalid address format',
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error validating address: ${error.message}`,
                    },
                ],
            };
        }
    }
}
