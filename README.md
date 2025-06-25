# Arbitrum MCP Server

A Model Context Protocol (MCP) server built with NestJS that provides tools for interacting with the Arbitrum blockchain via HTTP transport.

## Features

This MCP server provides the following tools:

1. **getBalance** - Get ETH balance for any address
2. **getTransaction** - Get transaction details by hash
3. **getTransactionReceipt** - Get transaction receipt by hash
4. **getBlock** - Get block information by number
5. **getLatestBlock** - Get latest block number
6. **getTransactionHistory** - Get transaction history for an address
7. **getContractAbi** - Get ABI for a contract address
8. **getTokenBalance** - Get token balance for an address
9. **getGasPrice** - Get current gas price
10. **getEthSupply** - Get total ETH supply on Arbitrum
11. **validateAddress** - Validate Ethereum address format

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Arbiscan API key (free from https://arbiscan.io/apis)

### Installation

1. Clone or download the project
```bash
cd arbitrumServer
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Add your Arbiscan API key to `.env`:
```
ARBISCAN_API_KEY=your_actual_api_key_here
PORT=4000
NODE_ENV=development
```

### Running the Server

```bash
# Development mode with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The server will start on http://localhost:4000

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and health information.

### MCP Endpoint
```
POST /api/mcp
```
Main endpoint for all MCP protocol communication.

## MCP Protocol Usage

All MCP requests follow the JSON-RPC 2.0 protocol format:

```json
{
  "jsonrpc": "2.0",
  "id": <unique_id>,
  "method": "<method_name>",
  "params": <parameters>
}
```

### Initialization

Before using tools, initialize the connection:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {}
}
```

### List Available Tools

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {}
}
```

### Tool Usage Examples

#### 1. Get Balance
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "getBalance",
    "arguments": {
      "address": "0x742d35Cc6634C0532925a3b8D7389F7Aa6b99D2b"
    }
  }
}
```

#### 2. Get Latest Block
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "getLatestBlock",
    "arguments": {}
  }
}
```

#### 3. Get Transaction History
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "getTransactionHistory",
    "arguments": {
      "address": "0x742d35Cc6634C0532925a3b8D7389F7Aa6b99D2b",
      "page": "1",
      "offset": "10"
    }
  }
}
```

#### 4. Get Transaction Details
```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "tools/call",
  "params": {
    "name": "getTransaction",
    "arguments": {
      "txHash": "0x1234567890abcdef..."
    }
  }
}
```

#### 5. Get Gas Price
```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "getGasPrice",
    "arguments": {}
  }
}
```

#### 6. Validate Address
```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "method": "tools/call",
  "params": {
    "name": "validateAddress",
    "arguments": {
      "address": "0x742d35Cc6634C0532925a3b8D7389F7Aa6b99D2b"
    }
  }
}
```

## Testing

The project includes a test script to verify all endpoints:

```bash
node test-server.js
```

Or test individual endpoints using curl:

```bash
# Health check
curl http://localhost:4000/api/health

# List tools
curl -X POST http://localhost:4000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# Validate address
curl -X POST http://localhost:4000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"validateAddress","arguments":{"address":"0x742d35Cc6634C0532925a3b8D7389F7Aa6b99D2b"}}}'
```

## Client Integration

To integrate this MCP server with your client application:

1. **Start the server** on your desired port
2. **Initialize the connection** using the `/initialize` method
3. **List available tools** using `/tools/list`
4. **Call tools** using `/tools/call` with the appropriate arguments
5. **Handle responses** in your client application

The server returns all tool results in the standard MCP format:

```json
{
  "jsonrpc": "2.0",
  "id": <request_id>,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "<JSON_data_here>"
      }
    ]
  }
}
```

## Project Structure

```
src/
├── arbitrum/              # Arbitrum blockchain service
│   ├── dto/              # Data transfer objects
│   ├── arbitrum.service.ts
│   └── arbitrum.module.ts
├── mcp/                  # MCP protocol implementation
│   ├── mcp.controller.ts
│   ├── mcp.service.ts
│   └── mcp.module.ts
├── types/                # TypeScript type definitions
├── app.module.ts         # Main application module
├── app.controller.ts     # Health check controller
├── app.service.ts        # Application service
└── main.ts              # Application entry point
```

## Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run lint` - Lint the code
- `npm run format` - Format the code

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ARBISCAN_API_KEY` | Your Arbiscan API key | Yes |
| `PORT` | Server port (default: 4000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Error Handling

The server returns standard JSON-RPC 2.0 error responses:

```json
{
  "jsonrpc": "2.0",
  "id": <request_id>,
  "error": {
    "code": <error_code>,
    "message": "<error_message>",
    "data": "<additional_error_info>"
  }
}
```

Common error codes:
- `-32601`: Method not found
- `-32603`: Internal error
- `-32602`: Invalid params

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the ISC License.
