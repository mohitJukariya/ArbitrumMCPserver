export interface ArbitrumBalance {
    status: string;
    message: string;
    result: string;
}

export interface ArbitrumTransaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
}

export interface ArbitrumBlock {
    difficulty: string;
    extraData: string;
    gasLimit: string;
    gasUsed: string;
    hash: string;
    logsBloom: string;
    miner: string;
    mixHash: string;
    nonce: string;
    number: string;
    parentHash: string;
    receiptsRoot: string;
    sha3Uncles: string;
    size: string;
    stateRoot: string;
    timestamp: string;
    totalDifficulty: string;
    transactions: string[] | ArbitrumTransaction[];
    transactionsRoot: string;
    uncles: string[];
}

export interface ArbitrumStats {
    status: string;
    message: string;
    result: string;
}

export interface ArbitrumTxReceipt {
    blockHash: string;
    blockNumber: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    from: string;
    gasUsed: string;
    logs: any[];
    logsBloom: string;
    status: string;
    to: string;
    transactionHash: string;
    transactionIndex: string;
}

export interface McpToolResult {
    content: Array<{
        type: 'text';
        text: string;
    }>;
}

export interface GetBalanceParams {
    address: string;
}

export interface GetTransactionParams {
    txHash: string;
}

export interface GetBlockParams {
    blockNumber?: string;
}

export interface GetTransactionHistoryParams {
    address: string;
    startBlock?: string;
    endBlock?: string;
    page?: string;
    offset?: string;
}

export interface GetContractAbiParams {
    address: string;
}

export interface GetTokenBalanceParams {
    contractAddress: string;
    address: string;
}

export interface GetGasPriceParams { }

export interface GetLatestBlockParams { }

export interface ValidateAddressParams {
    address: string;
}
