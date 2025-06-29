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

export interface GetMultiBalanceParams {
    addresses: string[];
}

export interface GetERC20TransfersParams {
    address: string;
    contractAddress?: string;
    startBlock?: string;
    endBlock?: string;
    page?: string;
    offset?: string;
}

export interface GetERC721TransfersParams {
    address: string;
    contractAddress?: string;
    startBlock?: string;
    endBlock?: string;
    page?: string;
    offset?: string;
}

export interface GetInternalTransactionsParams {
    address?: string;
    txHash?: string;
    startBlock?: string;
    endBlock?: string;
    page?: string;
    offset?: string;
}

export interface GetContractSourceParams {
    address: string;
}

export interface GetTokenInfoParams {
    contractAddress: string;
}

export interface GetGasOracleParams { }

export interface GetTransactionStatusParams {
    txHash: string;
}

export interface GetContractCreationParams {
    contractAddresses: string[];
}

export interface GetAddressTypeParams {
    address: string;
}

export interface ArbitrumERC20Transfer {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    value: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
    transactionIndex: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;
    input: string;
    confirmations: string;
}

export interface ArbitrumERC721Transfer {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    tokenID: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
    transactionIndex: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;
    input: string;
    confirmations: string;
}

export interface ArbitrumInternalTransaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    from: string;
    to: string;
    value: string;
    contractAddress: string;
    input: string;
    type: string;
    gas: string;
    gasUsed: string;
    traceId: string;
    isError: string;
    errCode: string;
}

export interface ArbitrumContractSource {
    SourceCode: string;
    ABI: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    EVMVersion: string;
    Library: string;
    LicenseType: string;
    Proxy: string;
    Implementation: string;
    SwarmSource: string;
}
