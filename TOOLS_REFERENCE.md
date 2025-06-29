# Arbitrum MCP Server - Tools Reference

This document provides a comprehensive list of all 21 available tools in the Arbitrum MCP Server, including their input parameters and output formats.

## Server Information
- **Base URL**: `http://localhost:4000/api/mcp`
- **Method**: `POST`
- **Content-Type**: `application/json`

## Tool Usage Pattern
```json
{
  "method": "tools/call",
  "params": {
    "name": "toolName",
    "arguments": {
      // tool-specific parameters
    }
  }
}
```

---

## 1. getBalance
**Description**: Get ETH balance for any address with automatic wei-to-ETH conversion

**Input Parameters**:
```typescript
{
  address: string; // Ethereum address to check balance for
}
```

**Output Format**:
```json
{
  "address": "0x...",
  "balance": {
    "wei": "1000000000000000000",
    "eth": "1.000000",
    "ethFullPrecision": "1.0",
    "formatted": "1 ETH"
  },
  "network": "Arbitrum",
  "status": "1",
  "message": "OK"
}
```

---

## 2. getTransaction
**Description**: Get transaction details by hash

**Input Parameters**:
```typescript
{
  txHash: string; // Transaction hash to lookup
}
```

**Output Format**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockHash": "0x...",
    "blockNumber": "0x...",
    "from": "0x...",
    "gas": "0x...",
    "gasPrice": "0x...",
    "hash": "0x...",
    "input": "0x...",
    "nonce": "0x...",
    "to": "0x...",
    "transactionIndex": "0x...",
    "value": "0x...",
    "v": "0x...",
    "r": "0x...",
    "s": "0x..."
  }
}
```

---

## 3. getTransactionReceipt
**Description**: Get transaction receipt by hash

**Input Parameters**:
```typescript
{
  txHash: string; // Transaction hash to get receipt for
}
```

**Output Format**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockHash": "0x...",
    "blockNumber": "0x...",
    "contractAddress": null,
    "cumulativeGasUsed": "0x...",
    "from": "0x...",
    "gasUsed": "0x...",
    "logs": [],
    "logsBloom": "0x...",
    "status": "0x1",
    "to": "0x...",
    "transactionHash": "0x...",
    "transactionIndex": "0x..."
  }
}
```

---

## 4. getBlock
**Description**: Get block information by number

**Input Parameters**:
```typescript
{
  blockNumber?: string; // Block number (hex or decimal) or "latest" (optional, defaults to "latest")
}
```

**Output Format**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "difficulty": "0x1",
    "extraData": "0x...",
    "gasLimit": "0x...",
    "gasUsed": "0x...",
    "hash": "0x...",
    "logsBloom": "0x...",
    "miner": "0x...",
    "mixHash": "0x...",
    "nonce": "0x...",
    "number": "0x...",
    "parentHash": "0x...",
    "receiptsRoot": "0x...",
    "sha3Uncles": "0x...",
    "size": "0x...",
    "stateRoot": "0x...",
    "timestamp": "0x...",
    "totalDifficulty": "0x...",
    "transactions": [],
    "transactionsRoot": "0x...",
    "uncles": []
  }
}
```

---

## 5. getLatestBlock
**Description**: Get latest block number with decimal conversion

**Input Parameters**:
```typescript
{} // No parameters required
```

**Output Format**:
```json
{
  "latestBlockNumber": "0x12345678",
  "latestBlockDecimal": 305419896
}
```

---

## 6. getTransactionHistory
**Description**: Get transaction history for an address with pagination

**Input Parameters**:
```typescript
{
  address: string;     // Address to get transaction history for
  startBlock?: string; // Starting block number (optional, default: "0")
  endBlock?: string;   // Ending block number (optional, default: "99999999")
  page?: string;       // Page number (optional, default: "1")
  offset?: string;     // Number of transactions per page (optional, default: "10")
}
```

**Output Format**:
```json
{
  "status": "1",
  "message": "OK",
  "result": [
    {
      "blockNumber": "12345678",
      "timeStamp": "1234567890",
      "hash": "0x...",
      "nonce": "123",
      "blockHash": "0x...",
      "transactionIndex": "0",
      "from": "0x...",
      "to": "0x...",
      "value": "1000000000000000000",
      "gas": "21000",
      "gasPrice": "1000000000",
      "isError": "0",
      "txreceipt_status": "1",
      "input": "0x",
      "contractAddress": "",
      "cumulativeGasUsed": "21000",
      "gasUsed": "21000",
      "confirmations": "100"
    }
  ]
}
```

---

## 7. getContractAbi
**Description**: Get ABI for a contract address

**Input Parameters**:
```typescript
{
  address: string; // Contract address to get ABI for
}
```

**Output Format**:
```json
{
  "status": "1",
  "message": "OK",
  "result": "[{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]"
}
```

---

## 8. getTokenBalance
**Description**: Get token balance for an address with automatic decimal conversion and token info

**Input Parameters**:
```typescript
{
  contractAddress: string; // Token contract address
  address: string;         // Address to check token balance for
}
```

**Output Format**:
```json
{
  "contractAddress": "0x...",
  "address": "0x...",
  "tokenInfo": {
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 6
  },
  "balance": {
    "raw": "1000000",
    "formatted": "1.000000",
    "fullPrecision": "1.0"
  },
  "status": "1",
  "message": "OK"
}
```

---

## 9. getGasPrice
**Description**: Get current gas price with automatic conversions

**Input Parameters**:
```typescript
{} // No parameters required
```

**Output Format**:
```json
{
  "gasPriceHex": "0x5f5e100",
  "gasPriceWei": 100000000,
  "gasPriceGwei": "0.10"
}
```

---

## 10. getEthSupply
**Description**: Get total ETH supply on Arbitrum with conversion

**Input Parameters**:
```typescript
{} // No parameters required
```

**Output Format**:
```json
{
  "totalSupply": "12345678901234567890",
  "totalSupplyInEth": "12.35",
  "status": "1",
  "message": "OK"
}
```

---

## 11. validateAddress
**Description**: Validate Ethereum address format

**Input Parameters**:
```typescript
{
  address: string; // Address to validate
}
```

**Output Format**:
```json
{
  "address": "0x1234567890123456789012345678901234567890",
  "isValid": true,
  "format": "valid Ethereum address"
}
```

---

## 12. getMultiBalance
**Description**: Get ETH balances for multiple addresses at once

**Input Parameters**:
```typescript
{
  addresses: string[]; // Array of Ethereum addresses to check balances for
}
```

**Output Format**:
```json
{
  "totalAddresses": 2,
  "balances": [
    {
      "address": "0x...",
      "balance": {
        "wei": "1000000000000000000",
        "eth": "1.000000",
        "ethFullPrecision": "1.0",
        "formatted": "1 ETH"
      },
      "network": "Arbitrum"
    }
  ],
  "status": "1",
  "message": "OK"
}
```

---

## 13. getERC20Transfers
**Description**: Get ERC-20 token transfers for an address with automatic decimal conversion

**Input Parameters**:
```typescript
{
  address: string;            // Address to get token transfers for
  contractAddress?: string;   // Optional: specific token contract address
  startBlock?: string;        // Starting block number (default: "0")
  endBlock?: string;          // Ending block number (default: "99999999")
  page?: string;              // Page number (default: "1")
  offset?: string;            // Number of transfers per page (default: "10")
}
```

**Output Format**:
```json
{
  "address": "0x...",
  "contractAddress": "0x... or All ERC-20 tokens",
  "totalTransfers": 10,
  "transfers": [
    {
      "blockNumber": 12345678,
      "timeStamp": "1234567890",
      "hash": "0x...",
      "from": "0x...",
      "contractAddress": "0x...",
      "to": "0x...",
      "value": "1000000",
      "tokenName": "USD Coin",
      "tokenSymbol": "USDC",
      "tokenDecimal": "6",
      "formattedValue": {
        "raw": "1000000",
        "formatted": "1.000000",
        "fullPrecision": "1.0",
        "symbol": "USDC"
      },
      "timestamp": "2023-01-01T00:00:00.000Z"
    }
  ],
  "status": "1"
}
```

---

## 14. getERC721Transfers
**Description**: Get ERC-721 (NFT) token transfers for an address with metadata

**Input Parameters**:
```typescript
{
  address: string;            // Address to get NFT transfers for
  contractAddress?: string;   // Optional: specific NFT contract address
  startBlock?: string;        // Starting block number (default: "0")
  endBlock?: string;          // Ending block number (default: "99999999")
  page?: string;              // Page number (default: "1")
  offset?: string;            // Number of transfers per page (default: "10")
}
```

**Output Format**:
```json
{
  "address": "0x...",
  "contractAddress": "0x... or All ERC-721 tokens",
  "totalTransfers": 5,
  "transfers": [
    {
      "blockNumber": 12345678,
      "timeStamp": "1234567890",
      "hash": "0x...",
      "from": "0x...",
      "contractAddress": "0x...",
      "to": "0x...",
      "tokenID": "123",
      "tokenName": "Cool NFTs",
      "tokenSymbol": "COOL",
      "nftInfo": {
        "name": "Cool NFTs",
        "symbol": "COOL",
        "tokenId": "123"
      },
      "timestamp": "2023-01-01T00:00:00.000Z"
    }
  ],
  "status": "1"
}
```

---

## 15. getInternalTransactions
**Description**: Get internal transactions by address or transaction hash with ETH conversion

**Input Parameters**:
```typescript
{
  address?: string;     // Address to get internal transactions for (optional)
  txHash?: string;      // Transaction hash to get internal transactions for (optional)
  startBlock?: string;  // Starting block number (default: "0")
  endBlock?: string;    // Ending block number (default: "99999999")
  page?: string;        // Page number (default: "1")
  offset?: string;      // Number of transactions per page (default: "10")
}
```

**Output Format**:
```json
{
  "queryType": "by_address",
  "address": "0x...",
  "txHash": null,
  "totalTransactions": 3,
  "transactions": [
    {
      "blockNumber": 12345678,
      "timeStamp": "1234567890",
      "hash": "0x...",
      "from": "0x...",
      "to": "0x...",
      "value": "1000000000000000000",
      "contractAddress": "",
      "input": "",
      "type": "call",
      "gas": "2300",
      "gasUsed": "0",
      "traceId": "0",
      "isError": "0",
      "errCode": "",
      "formattedValue": {
        "wei": "1000000000000000000",
        "eth": "1.000000",
        "ethFullPrecision": "1.0",
        "formatted": "1.000000 ETH"
      },
      "success": true,
      "timestamp": "2023-01-01T00:00:00.000Z"
    }
  ],
  "status": "1"
}
```

---

## 16. getContractSource
**Description**: Get verified contract source code and ABI

**Input Parameters**:
```typescript
{
  address: string; // Contract address to get source code for
}
```

**Output Format**:
```json
{
  "address": "0x...",
  "contractInfo": {
    "sourcecode": "pragma solidity ^0.8.0; contract Example { ... }",
    "abi": "[{\"inputs\":[],\"name\":\"symbol\"}]",
    "contractName": "ExampleContract",
    "compilerVersion": "v0.8.19+commit.7dd6d404",
    "optimizationUsed": "1",
    "runs": "200",
    "constructorArguments": "",
    "evmVersion": "Default",
    "library": "",
    "licenseType": "MIT",
    "proxy": "0",
    "implementation": "",
    "swarmSource": ""
  },
  "isVerified": true,
  "status": "1"
}
```

---

## 17. getTokenInfo
**Description**: Get detailed information about a token contract with supply conversion

**Input Parameters**:
```typescript
{
  contractAddress: string; // Token contract address to get info for
}
```

**Output Format**:
```json
{
  "contractAddress": "0x...",
  "tokenInfo": {
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 6,
    "totalSupply": {
      "raw": "1000000000000",
      "formatted": "1000000.000000",
      "fullPrecision": "1000000.0"
    }
  },
  "status": "1",
  "message": "OK"
}
```

---

## 18. getGasOracle
**Description**: Get gas price recommendations from Gas Oracle

**Input Parameters**:
```typescript
{} // No parameters required
```

**Output Format**:
```json
{
  "gasOracle": {
    "safe": {
      "gwei": "0.1",
      "wei": "100000000",
      "estimatedTime": "Slow (>10 minutes)"
    },
    "standard": {
      "gwei": "0.2",
      "wei": "200000000",
      "estimatedTime": "Standard (~3 minutes)"
    },
    "fast": {
      "gwei": "0.3",
      "wei": "300000000",
      "estimatedTime": "Fast (<2 minutes)"
    }
  },
  "network": "Arbitrum",
  "status": "1"
}
```

---

## 19. getTransactionStatus
**Description**: Get detailed transaction status and receipt

**Input Parameters**:
```typescript
{
  txHash: string; // Transaction hash to get status for
}
```

**Output Format**:
```json
{
  "txHash": "0x...",
  "status": {
    "isSuccess": true,
    "isError": false,
    "isPending": false,
    "confirmations": 150
  },
  "receipt": {
    "blockHash": "0x...",
    "blockNumber": "0x...",
    "contractAddress": null,
    "cumulativeGasUsed": "0x...",
    "from": "0x...",
    "gasUsed": "0x...",
    "logs": [],
    "logsBloom": "0x...",
    "status": "0x1",
    "to": "0x...",
    "transactionHash": "0x...",
    "transactionIndex": "0x..."
  },
  "network": "Arbitrum"
}
```

---

## 20. getContractCreation
**Description**: Get contract creation transaction details

**Input Parameters**:
```typescript
{
  contractAddresses: string[]; // Array of contract addresses to get creation info for
}
```

**Output Format**:
```json
{
  "totalContracts": 1,
  "contractCreations": [
    {
      "contractAddress": "0x...",
      "contractCreator": "0x...",
      "txHash": "0x...",
      "creationDetails": {
        "blockNumber": "12345678",
        "timestamp": "2023-01-01T00:00:00.000Z",
        "gasUsed": "500000",
        "gasPrice": "1000000000"
      }
    }
  ],
  "status": "1",
  "message": "OK"
}
```

---

## 21. getAddressType
**Description**: Determine if an address is a contract or EOA (externally owned account)

**Input Parameters**:
```typescript
{
  address: string; // Address to check type for
}
```

**Output Format**:
```json
{
  "address": "0x...",
  "addressType": {
    "type": "contract",
    "description": "Smart Contract",
    "hasCode": true,
    "codeSize": 2593
  },
  "network": "Arbitrum",
  "status": "1"
}
```

---

## Error Response Format
All tools return errors in this standardized format:
```json
{
  "content": [
    {
      "type": "text",
      "text": "Error fetching [tool name]: [error message]"
    }
  ]
}
```

## Notes
- All responses are wrapped in the MCP tool result format with `content[0].text` containing the JSON data
- Addresses should be valid Ethereum addresses (0x followed by 40 hexadecimal characters)
- Transaction hashes should be valid Ethereum transaction hashes (0x followed by 64 hexadecimal characters)
- Block numbers can be in hex format (0x...) or decimal format, or "latest" for the most recent block
- Pagination parameters (page, offset) should be strings representing positive integers
- All tools handle errors gracefully and return descriptive error messages
- Tools automatically convert values between different units (wei/ETH, raw/formatted token amounts)
- Timestamps are converted to ISO 8601 format where applicable
- All numeric values are returned as strings to preserve precision
