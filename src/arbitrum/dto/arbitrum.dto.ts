import { z } from 'zod';

export const GetBalanceDto = z.object({
    address: z.string().describe('Ethereum address to check balance for'),
});

export const GetTransactionDto = z.object({
    txHash: z.string().describe('Transaction hash to lookup'),
});

export const GetBlockDto = z.object({
    blockNumber: z.string().optional().describe('Block number (hex or decimal) or "latest"'),
});

export const GetTransactionHistoryDto = z.object({
    address: z.string().describe('Address to get transaction history for'),
    startBlock: z.string().optional().describe('Starting block number'),
    endBlock: z.string().optional().describe('Ending block number'),
    page: z.string().optional().describe('Page number'),
    offset: z.string().optional().describe('Number of transactions per page'),
});

export const GetContractAbiDto = z.object({
    address: z.string().describe('Contract address to get ABI for'),
});

export const GetTokenBalanceDto = z.object({
    contractAddress: z.string().describe('Token contract address'),
    address: z.string().describe('Address to check token balance for'),
});

export const GetGasPriceDto = z.object({});

export const GetLatestBlockDto = z.object({});

export const ValidateAddressDto = z.object({
    address: z.string().describe('Address to validate'),
});

export type GetBalanceParams = z.infer<typeof GetBalanceDto>;
export type GetTransactionParams = z.infer<typeof GetTransactionDto>;
export type GetBlockParams = z.infer<typeof GetBlockDto>;
export type GetTransactionHistoryParams = z.infer<typeof GetTransactionHistoryDto>;
export type GetContractAbiParams = z.infer<typeof GetContractAbiDto>;
export type GetTokenBalanceParams = z.infer<typeof GetTokenBalanceDto>;
export type GetGasPriceParams = z.infer<typeof GetGasPriceDto>;
export type GetLatestBlockParams = z.infer<typeof GetLatestBlockDto>;
export type ValidateAddressParams = z.infer<typeof ValidateAddressDto>;
