# Test script for debugging getTokenBalance method
# This script tests USDC balance fetching and examines each API response

# Configuration
$baseUrl = "http://localhost:3000/api"
$testAddress = "0x1234567890123456789012345678901234567890"  # Replace with actual address
$usdcContractAddress = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"  # USDC on Arbitrum
$arbiscanBaseUrl = "https://api.arbiscan.io/api"
$apiKey = ""  # Will use the server's API key

Write-Host "=== Testing getTokenBalance Method Debug ===" -ForegroundColor Green
Write-Host "Test Address: $testAddress" -ForegroundColor Yellow
Write-Host "USDC Contract: $usdcContractAddress" -ForegroundColor Yellow
Write-Host ""

# Test 1: Call the server's getTokenBalance endpoint
Write-Host "1. Testing server getTokenBalance endpoint..." -ForegroundColor Cyan
try {
    $serverResponse = Invoke-RestMethod -Uri "$baseUrl/getTokenBalance" -Method POST -Headers @{
        "Content-Type" = "application/json"
    } -Body (@{
        contractAddress = $usdcContractAddress
        address = $testAddress
    } | ConvertTo-Json)
    
    Write-Host "Server Response:" -ForegroundColor Green
    $serverResponse.content[0].text | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
} catch {
    Write-Host "Error calling server endpoint: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" + "="*50 + "`n"

# Test 2: Manual API calls to debug each step
Write-Host "2. Manual API calls to debug each component..." -ForegroundColor Cyan

# Function to make API calls with proper error handling
function Test-ApiCall {
    param($url, $description)
    
    Write-Host "Testing: $description" -ForegroundColor Yellow
    Write-Host "URL: $url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method GET
        Write-Host "Status: $($response.status)" -ForegroundColor Green
        Write-Host "Message: $($response.message)" -ForegroundColor Green
        Write-Host "Result: $($response.result)" -ForegroundColor Green
        
        if ($response.result -and $response.result -ne "0x") {
            Write-Host "✓ Got valid response data" -ForegroundColor Green
        } else {
            Write-Host "✗ Empty or null response" -ForegroundColor Red
        }
        
        return $response
    } catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
    Write-Host ""
}

# Test balance call
$balanceResponse = Test-ApiCall "$arbiscanBaseUrl" + "?module=account&action=tokenbalance&contractaddress=$usdcContractAddress&address=$testAddress&tag=latest&apikey=$apiKey" "Token Balance"

# Test decimals call  
$decimalsResponse = Test-ApiCall "$arbiscanBaseUrl" + "?module=proxy&action=eth_call&to=$usdcContractAddress&data=0x313ce567&tag=latest&apikey=$apiKey" "Token Decimals"

# Test name call
$nameResponse = Test-ApiCall "$arbiscanBaseUrl" + "?module=proxy&action=eth_call&to=$usdcContractAddress&data=0x06fdde03&tag=latest&apikey=$apiKey" "Token Name"

# Test symbol call
$symbolResponse = Test-ApiCall "$arbiscanBaseUrl" + "?module=proxy&action=eth_call&to=$usdcContractAddress&data=0x95d89b41&tag=latest&apikey=$apiKey" "Token Symbol"

Write-Host "`n" + "="*50 + "`n"

# Test 3: Parse the hex responses manually
Write-Host "3. Manual parsing of hex responses..." -ForegroundColor Cyan

# Parse decimals
if ($decimalsResponse -and $decimalsResponse.result -and $decimalsResponse.result -ne "0x") {
    $decimalsHex = $decimalsResponse.result
    $decimalsDecimal = [Convert]::ToInt32($decimalsHex, 16)
    Write-Host "Decimals - Hex: $decimalsHex, Decimal: $decimalsDecimal" -ForegroundColor Green
} else {
    Write-Host "Decimals - Using default: 18" -ForegroundColor Red
    $decimalsDecimal = 18
}

# Parse name (simplified parsing)
if ($nameResponse -and $nameResponse.result -and $nameResponse.result -ne "0x") {
    $nameHex = $nameResponse.result.Substring(2)  # Remove 0x
    Write-Host "Name - Raw hex length: $($nameHex.Length) characters" -ForegroundColor Yellow
    Write-Host "Name - Raw hex: $($nameHex.Substring(0, [Math]::Min(200, $nameHex.Length)))..." -ForegroundColor Gray
    
    try {
        # Try to decode as UTF-8 string
        $nameBytes = [System.Convert]::FromHexString($nameHex)
        
        # Skip the first 32 bytes (length info) and try to extract string
        if ($nameBytes.Length -gt 64) {
            $lengthBytes = $nameBytes[28..31]
            $length = [BitConverter]::ToUInt32($lengthBytes[3..0], 0)  # Big endian
            Write-Host "Name - Extracted length: $length" -ForegroundColor Yellow
            
            if ($length -gt 0 -and $length -lt 100) {
                $nameData = $nameBytes[32..(32 + $length - 1)]
                $tokenName = [System.Text.Encoding]::UTF8.GetString($nameData).Trim([char]0)
                Write-Host "Name - Parsed: '$tokenName'" -ForegroundColor Green
            } else {
                Write-Host "Name - Invalid length, using default" -ForegroundColor Red
                $tokenName = "Unknown Token"
            }
        } else {
            Write-Host "Name - Response too short, using default" -ForegroundColor Red
            $tokenName = "Unknown Token"
        }
    } catch {
        Write-Host "Name - Parse error: $($_.Exception.Message), using default" -ForegroundColor Red
        $tokenName = "Unknown Token"
    }
} else {
    Write-Host "Name - No valid response, using default" -ForegroundColor Red
    $tokenName = "Unknown Token"
}

# Parse symbol (similar to name)
if ($symbolResponse -and $symbolResponse.result -and $symbolResponse.result -ne "0x") {
    $symbolHex = $symbolResponse.result.Substring(2)
    Write-Host "Symbol - Raw hex length: $($symbolHex.Length) characters" -ForegroundColor Yellow
    Write-Host "Symbol - Raw hex: $($symbolHex.Substring(0, [Math]::Min(200, $symbolHex.Length)))..." -ForegroundColor Gray
    
    try {
        $symbolBytes = [System.Convert]::FromHexString($symbolHex)
        
        if ($symbolBytes.Length -gt 64) {
            $lengthBytes = $symbolBytes[28..31]
            $length = [BitConverter]::ToUInt32($lengthBytes[3..0], 0)
            Write-Host "Symbol - Extracted length: $length" -ForegroundColor Yellow
            
            if ($length -gt 0 -and $length -lt 20) {
                $symbolData = $symbolBytes[32..(32 + $length - 1)]
                $tokenSymbol = [System.Text.Encoding]::UTF8.GetString($symbolData).Trim([char]0)
                Write-Host "Symbol - Parsed: '$tokenSymbol'" -ForegroundColor Green
            } else {
                Write-Host "Symbol - Invalid length, using default" -ForegroundColor Red
                $tokenSymbol = "UNKNOWN"
            }
        } else {
            Write-Host "Symbol - Response too short, using default" -ForegroundColor Red
            $tokenSymbol = "UNKNOWN"
        }
    } catch {
        Write-Host "Symbol - Parse error: $($_.Exception.Message), using default" -ForegroundColor Red
        $tokenSymbol = "UNKNOWN"
    }
} else {
    Write-Host "Symbol - No valid response, using default" -ForegroundColor Red
    $tokenSymbol = "UNKNOWN"
}

Write-Host "`n" + "="*50 + "`n"

# Test 4: Calculate balance with parsed values
Write-Host "4. Final balance calculation..." -ForegroundColor Cyan

if ($balanceResponse -and $balanceResponse.result) {
    $rawBalance = $balanceResponse.result
    $balanceInTokenUnits = [double]$rawBalance / [Math]::Pow(10, $decimalsDecimal)
    
    Write-Host "Raw Balance: $rawBalance" -ForegroundColor Green
    Write-Host "Token Info:" -ForegroundColor Green
    Write-Host "  Name: $tokenName" -ForegroundColor White
    Write-Host "  Symbol: $tokenSymbol" -ForegroundColor White
    Write-Host "  Decimals: $decimalsDecimal" -ForegroundColor White
    Write-Host "Formatted Balance: $($balanceInTokenUnits.ToString('F6')) $tokenSymbol" -ForegroundColor Green
} else {
    Write-Host "Could not fetch balance" -ForegroundColor Red
}

Write-Host "`n" + "="*50 + "`n"
Write-Host "Test completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Replace the testAddress variable with a real Arbitrum address that has USDC"
Write-Host "2. Run this script to see detailed debugging information"
Write-Host "3. Compare the server response with the manual API calls"
Write-Host "4. Check if name/symbol/decimals are being parsed correctly"
