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
    GetMultiBalanceParams,
    GetERC20TransfersParams,
    GetERC721TransfersParams,
    GetInternalTransactionsParams,
    GetContractSourceParams,
    GetTokenInfoParams,
    GetGasOracleParams,
    GetTransactionStatusParams,
    GetContractCreationParams,
    GetAddressTypeParams,
    ArbitrumERC20Transfer,
    ArbitrumERC721Transfer,
    ArbitrumInternalTransaction,
    ArbitrumContractSource,
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

            const balanceWei = response.data.result;
            const balanceInEth = parseFloat(balanceWei) / Math.pow(10, 18);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            address,
                            balance: {
                                wei: balanceWei,
                                eth: balanceInEth.toFixed(6),
                                ethFullPrecision: balanceInEth.toString(),
                                formatted: `${balanceInEth.toFixed(18).replace(/\.?0+$/, '')} ETH`,
                            },
                            network: 'Arbitrum',
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
            // First get the token balance
            const balanceResponse = await axios.get(
                `${this.baseUrl}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${this.apiKey}`
            );

            // Get token decimals
            const decimalsResponse = await axios.get(
                `${this.baseUrl}?module=proxy&action=eth_call&to=${contractAddress}&data=0x313ce567&tag=latest&apikey=${this.apiKey}`
            );

            // Get token name
            const nameResponse = await axios.get(
                `${this.baseUrl}?module=proxy&action=eth_call&to=${contractAddress}&data=0x06fdde03&tag=latest&apikey=${this.apiKey}`
            );

            // Get token symbol
            const symbolResponse = await axios.get(
                `${this.baseUrl}?module=proxy&action=eth_call&to=${contractAddress}&data=0x95d89b41&tag=latest&apikey=${this.apiKey}`
            );

            const rawBalance = balanceResponse.data.result;
            let decimals = 18; // Default to 18 if we can't fetch
            let tokenName = 'Unknown Token';
            let tokenSymbol = 'UNKNOWN';

            // Parse decimals from hex response
            if (decimalsResponse.data.result && decimalsResponse.data.result !== '0x') {
                decimals = parseInt(decimalsResponse.data.result, 16);
            }

            // Parse token name from hex response
            if (nameResponse.data.result && nameResponse.data.result !== '0x') {
                try {
                    const nameHex = nameResponse.data.result.slice(2);
                    const nameBuffer = Buffer.from(nameHex, 'hex');
                    // Skip the first 64 characters (32 bytes) which contain length info
                    const nameStart = nameBuffer.readUInt32BE(28); // Length is at offset 28-31
                    const nameData = nameBuffer.slice(32, 32 + nameStart);
                    tokenName = nameData.toString('utf8').replace(/\0/g, '');
                } catch (e) {
                    // Keep default if parsing fails
                }
            }

            // Parse token symbol from hex response
            if (symbolResponse.data.result && symbolResponse.data.result !== '0x') {
                try {
                    const symbolHex = symbolResponse.data.result.slice(2);
                    const symbolBuffer = Buffer.from(symbolHex, 'hex');
                    const symbolStart = symbolBuffer.readUInt32BE(28);
                    const symbolData = symbolBuffer.slice(32, 32 + symbolStart);
                    tokenSymbol = symbolData.toString('utf8').replace(/\0/g, '');
                } catch (e) {
                    // Keep default if parsing fails
                }
            }

            // Convert balance using token decimals
            const balanceInTokenUnits = parseFloat(rawBalance) / Math.pow(10, decimals);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            contractAddress,
                            address,
                            tokenInfo: {
                                name: tokenName,
                                symbol: tokenSymbol,
                                decimals: decimals,
                            },
                            balance: {
                                raw: rawBalance,
                                formatted: balanceInTokenUnits.toFixed(decimals > 6 ? 6 : decimals),
                                fullPrecision: balanceInTokenUnits.toString(),
                            },
                            status: balanceResponse.data.status,
                            message: balanceResponse.data.message,
                        }, null, 2),
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

    async getMultiBalance({ addresses }: GetMultiBalanceParams): Promise<McpToolResult> {
        try {
            const addressList = addresses.join(',');
            const response = await axios.get(
                `${this.baseUrl}?module=account&action=balancemulti&address=${addressList}&tag=latest&apikey=${this.apiKey}`
            );

            const formattedBalances = response.data.result.map((item: any) => {
                const balanceInEth = parseFloat(item.balance) / Math.pow(10, 18);
                return {
                    address: item.account,
                    balance: {
                        wei: item.balance,
                        eth: balanceInEth.toFixed(6),
                        ethFullPrecision: balanceInEth.toString(),
                        formatted: `${balanceInEth.toFixed(18).replace(/\.?0+$/, '')} ETH`,
                    },
                    network: 'Arbitrum',
                };
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            totalAddresses: addresses.length,
                            balances: formattedBalances,
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
                        text: `Error fetching multi balance: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getERC20Transfers({
        address,
        contractAddress,
        startBlock = '0',
        endBlock = '99999999',
        page = '1',
        offset = '10',
    }: GetERC20TransfersParams): Promise<McpToolResult> {
        try {
            let url = `${this.baseUrl}?module=account&action=tokentx&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${offset}&sort=desc&apikey=${this.apiKey}`;

            if (contractAddress) {
                url += `&contractaddress=${contractAddress}`;
            }

            const response = await axios.get<{ status: string; message: string; result: ArbitrumERC20Transfer[] }>(url);

            // Process and format the transfers with proper decimal conversion
            const formattedTransfers = response.data.result.map((transfer: ArbitrumERC20Transfer) => {
                const decimals = parseInt(transfer.tokenDecimal) || 18;
                const valueInTokenUnits = parseFloat(transfer.value) / Math.pow(10, decimals);

                return {
                    ...transfer,
                    formattedValue: {
                        raw: transfer.value,
                        formatted: valueInTokenUnits.toFixed(decimals > 6 ? 6 : decimals),
                        fullPrecision: valueInTokenUnits.toString(),
                        symbol: transfer.tokenSymbol,
                    },
                    timestamp: new Date(parseInt(transfer.timeStamp) * 1000).toISOString(),
                    blockNumber: parseInt(transfer.blockNumber),
                };
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            address,
                            contractAddress: contractAddress || 'All ERC-20 tokens',
                            totalTransfers: formattedTransfers.length,
                            transfers: formattedTransfers,
                            status: response.data.status,
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching ERC-20 transfers: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getERC721Transfers({
        address,
        contractAddress,
        startBlock = '0',
        endBlock = '99999999',
        page = '1',
        offset = '10',
    }: GetERC721TransfersParams): Promise<McpToolResult> {
        try {
            let url = `${this.baseUrl}?module=account&action=tokennfttx&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${offset}&sort=desc&apikey=${this.apiKey}`;

            if (contractAddress) {
                url += `&contractaddress=${contractAddress}`;
            }

            const response = await axios.get<{ status: string; message: string; result: ArbitrumERC721Transfer[] }>(url);

            const formattedTransfers = response.data.result.map((transfer: ArbitrumERC721Transfer) => ({
                ...transfer,
                timestamp: new Date(parseInt(transfer.timeStamp) * 1000).toISOString(),
                blockNumber: parseInt(transfer.blockNumber),
                tokenID: transfer.tokenID,
                nftInfo: {
                    name: transfer.tokenName,
                    symbol: transfer.tokenSymbol,
                    tokenId: transfer.tokenID,
                },
            }));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            address,
                            contractAddress: contractAddress || 'All ERC-721 tokens',
                            totalTransfers: formattedTransfers.length,
                            transfers: formattedTransfers,
                            status: response.data.status,
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching ERC-721 transfers: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getInternalTransactions({
        address,
        txHash,
        startBlock = '0',
        endBlock = '99999999',
        page = '1',
        offset = '10',
    }: GetInternalTransactionsParams): Promise<McpToolResult> {
        try {
            let url = `${this.baseUrl}?module=account&action=txlistinternal&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${offset}&sort=desc&apikey=${this.apiKey}`;

            if (address) {
                url += `&address=${address}`;
            } else if (txHash) {
                url += `&txhash=${txHash}`;
            }

            const response = await axios.get<{ status: string; message: string; result: ArbitrumInternalTransaction[] }>(url);

            const formattedTransactions = response.data.result.map((tx: ArbitrumInternalTransaction) => {
                const valueInEth = parseFloat(tx.value) / Math.pow(10, 18);

                return {
                    ...tx,
                    timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
                    blockNumber: parseInt(tx.blockNumber),
                    formattedValue: {
                        wei: tx.value,
                        eth: valueInEth.toFixed(6),
                        ethFullPrecision: valueInEth.toString(),
                        formatted: `${valueInEth.toFixed(18).replace(/\.?0+$/, '')} ETH`,
                    },
                    success: tx.isError === '0',
                };
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            queryType: address ? 'by_address' : 'by_transaction',
                            address: address || null,
                            txHash: txHash || null,
                            totalTransactions: formattedTransactions.length,
                            transactions: formattedTransactions,
                            status: response.data.status,
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching internal transactions: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getContractSource({ address }: GetContractSourceParams): Promise<McpToolResult> {
        try {
            const response = await axios.get(
                `${this.baseUrl}?module=contract&action=getsourcecode&address=${address}&apikey=${this.apiKey}`
            );

            const sourceData = response.data.result[0];

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            contractAddress: address,
                            contractInfo: {
                                name: sourceData.ContractName,
                                compiler: sourceData.CompilerVersion,
                                optimized: sourceData.OptimizationUsed === '1',
                                runs: sourceData.Runs,
                                evmVersion: sourceData.EVMVersion,
                                licenseType: sourceData.LicenseType,
                                isProxy: sourceData.Proxy === '1',
                                implementation: sourceData.Implementation || null,
                            },
                            sourceCode: sourceData.SourceCode,
                            abi: sourceData.ABI ? JSON.parse(sourceData.ABI) : null,
                            constructorArguments: sourceData.ConstructorArguments,
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
                        text: `Error fetching contract source: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getTokenInfo({ contractAddress }: GetTokenInfoParams): Promise<McpToolResult> {
        try {
            // Get token supply
            const supplyResponse = await axios.get(
                `${this.baseUrl}?module=stats&action=tokensupply&contractaddress=${contractAddress}&apikey=${this.apiKey}`
            );

            // Get token decimals, name, and symbol (reusing existing logic)
            const [decimalsResponse, nameResponse, symbolResponse] = await Promise.all([
                axios.get(`${this.baseUrl}?module=proxy&action=eth_call&to=${contractAddress}&data=0x313ce567&tag=latest&apikey=${this.apiKey}`),
                axios.get(`${this.baseUrl}?module=proxy&action=eth_call&to=${contractAddress}&data=0x06fdde03&tag=latest&apikey=${this.apiKey}`),
                axios.get(`${this.baseUrl}?module=proxy&action=eth_call&to=${contractAddress}&data=0x95d89b41&tag=latest&apikey=${this.apiKey}`)
            ]);

            let decimals = 18;
            let tokenName = 'Unknown Token';
            let tokenSymbol = 'UNKNOWN';

            // Parse responses (reusing existing parsing logic)
            if (decimalsResponse.data.result && decimalsResponse.data.result !== '0x') {
                decimals = parseInt(decimalsResponse.data.result, 16);
            }

            if (nameResponse.data.result && nameResponse.data.result !== '0x') {
                try {
                    const nameHex = nameResponse.data.result.slice(2);
                    const nameBuffer = Buffer.from(nameHex, 'hex');
                    const nameStart = nameBuffer.readUInt32BE(28);
                    const nameData = nameBuffer.slice(32, 32 + nameStart);
                    tokenName = nameData.toString('utf8').replace(/\0/g, '');
                } catch (e) {
                    // Keep default
                }
            }

            if (symbolResponse.data.result && symbolResponse.data.result !== '0x') {
                try {
                    const symbolHex = symbolResponse.data.result.slice(2);
                    const symbolBuffer = Buffer.from(symbolHex, 'hex');
                    const symbolStart = symbolBuffer.readUInt32BE(28);
                    const symbolData = symbolBuffer.slice(32, 32 + symbolStart);
                    tokenSymbol = symbolData.toString('utf8').replace(/\0/g, '');
                } catch (e) {
                    // Keep default
                }
            }

            const rawSupply = supplyResponse.data.result;
            const formattedSupply = parseFloat(rawSupply) / Math.pow(10, decimals);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            contractAddress,
                            tokenInfo: {
                                name: tokenName,
                                symbol: tokenSymbol,
                                decimals: decimals,
                                totalSupply: {
                                    raw: rawSupply,
                                    formatted: formattedSupply.toFixed(decimals > 6 ? 6 : decimals),
                                    fullPrecision: formattedSupply.toString(),
                                },
                            },
                            status: supplyResponse.data.status,
                            message: supplyResponse.data.message,
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching token info: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getGasOracle({ }: GetGasOracleParams): Promise<McpToolResult> {
        try {
            const response = await axios.get(
                `${this.baseUrl}?module=gastracker&action=gasoracle&apikey=${this.apiKey}`
            );

            const oracleData = response.data.result;

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            gasOracle: {
                                safe: {
                                    gasPrice: oracleData.SafeGasPrice,
                                    gwei: parseFloat(oracleData.SafeGasPrice),
                                    wei: parseFloat(oracleData.SafeGasPrice) * Math.pow(10, 9),
                                    estimatedTime: 'Slow (>10 minutes)',
                                },
                                standard: {
                                    gasPrice: oracleData.ProposeGasPrice,
                                    gwei: parseFloat(oracleData.ProposeGasPrice),
                                    wei: parseFloat(oracleData.ProposeGasPrice) * Math.pow(10, 9),
                                    estimatedTime: 'Standard (~3 minutes)',
                                },
                                fast: {
                                    gasPrice: oracleData.FastGasPrice,
                                    gwei: parseFloat(oracleData.FastGasPrice),
                                    wei: parseFloat(oracleData.FastGasPrice) * Math.pow(10, 9),
                                    estimatedTime: 'Fast (<2 minutes)',
                                },
                            },
                            network: 'Arbitrum',
                            status: response.data.status,
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching gas oracle: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getTransactionStatus({ txHash }: GetTransactionStatusParams): Promise<McpToolResult> {
        try {
            // Get transaction details and receipt
            const [txResponse, receiptResponse] = await Promise.all([
                axios.get(`${this.baseUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${this.apiKey}`),
                axios.get(`${this.baseUrl}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${this.apiKey}`)
            ]);

            const tx = txResponse.data.result;
            const receipt = receiptResponse.data.result;

            if (!tx) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                txHash,
                                status: 'not_found',
                                message: 'Transaction not found',
                            }, null, 2),
                        },
                    ],
                };
            }

            const status = receipt ? (receipt.status === '0x1' ? 'success' : 'failed') : 'pending';
            const confirmations = receipt ? parseInt(receipt.blockNumber, 16) : 0;

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            txHash,
                            status: status,
                            details: {
                                blockNumber: tx.blockNumber ? parseInt(tx.blockNumber, 16) : null,
                                blockHash: tx.blockHash,
                                transactionIndex: tx.transactionIndex ? parseInt(tx.transactionIndex, 16) : null,
                                from: tx.from,
                                to: tx.to,
                                value: {
                                    wei: tx.value,
                                    eth: (parseInt(tx.value, 16) / Math.pow(10, 18)).toFixed(6),
                                },
                                gasLimit: parseInt(tx.gas, 16),
                                gasPrice: {
                                    wei: parseInt(tx.gasPrice, 16),
                                    gwei: (parseInt(tx.gasPrice, 16) / Math.pow(10, 9)).toFixed(2),
                                },
                                gasUsed: receipt ? parseInt(receipt.gasUsed, 16) : null,
                                confirmations: confirmations,
                                success: receipt ? receipt.status === '0x1' : null,
                            },
                            network: 'Arbitrum',
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching transaction status: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getContractCreation({ contractAddresses }: GetContractCreationParams): Promise<McpToolResult> {
        try {
            const addressList = contractAddresses.join(',');
            const response = await axios.get(
                `${this.baseUrl}?module=contract&action=getcontractcreation&contractaddresses=${addressList}&apikey=${this.apiKey}`
            );

            const formattedResults = response.data.result.map((contract: any) => ({
                contractAddress: contract.contractAddress,
                creatorAddress: contract.contractCreator,
                txHash: contract.txHash,
                creationDetails: {
                    creator: contract.contractCreator,
                    transactionHash: contract.txHash,
                },
            }));

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            totalContracts: contractAddresses.length,
                            contracts: formattedResults,
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
                        text: `Error fetching contract creation: ${error.message}`,
                    },
                ],
            };
        }
    }

    async getAddressType({ address }: GetAddressTypeParams): Promise<McpToolResult> {
        try {
            // Check if address has code (contract) or not (EOA)
            const response = await axios.get(
                `${this.baseUrl}?module=proxy&action=eth_getCode&address=${address}&tag=latest&apikey=${this.apiKey}`
            );

            const code = response.data.result;
            const isContract = code && code !== '0x' && code.length > 2;

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            address,
                            addressType: {
                                type: isContract ? 'contract' : 'eoa',
                                description: isContract ? 'Smart Contract' : 'Externally Owned Account',
                                hasCode: isContract,
                                codeSize: isContract ? (code.length - 2) / 2 : 0, // bytes
                            },
                            network: 'Arbitrum',
                            status: response.data.status,
                        }, null, 2),
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error checking address type: ${error.message}`,
                    },
                ],
            };
        }
    }
}
