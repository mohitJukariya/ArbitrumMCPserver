// Test script for MCP server
const testRequests = async () => {
  const baseUrl = 'http://localhost:4000/api';
  
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('Health:', healthData);
    
    // Test MCP tools/list
    console.log('\nTesting MCP tools/list...');
    const toolsResponse = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      })
    });
    const toolsData = await toolsResponse.json();
    console.log('Tools:', JSON.stringify(toolsData, null, 2));
    
    // Test initialize
    console.log('\nTesting MCP initialize...');
    const initResponse = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'initialize',
        params: {}
      })
    });
    const initData = await initResponse.json();
    console.log('Initialize:', JSON.stringify(initData, null, 2));
    
    // Test validateAddress tool
    console.log('\nTesting validateAddress tool...');
    const validateResponse = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'validateAddress',
          arguments: {
            address: '0x742d35Cc6634C0532925a3b8D7389F7Aa6b99D2b'
          }
        }
      })
    });
    const validateData = await validateResponse.json();
    console.log('Validate Address:', JSON.stringify(validateData, null, 2));
    
  } catch (error) {
    console.error('Error testing server:', error);
  }
};

// Run tests if this is run directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testRequests();
}
