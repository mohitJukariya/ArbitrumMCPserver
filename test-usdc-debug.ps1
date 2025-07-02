# Test USDC token balance with detailed debugging
$usdcContract = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"  # USDC on Arbitrum
$testAddress = "0xB0477Be65b4341dDCA52a919b2662c30eA474000"    # Test account

Write-Host "=== Testing USDC Token Balance Debug ===" -ForegroundColor Green
Write-Host "Contract: $usdcContract (USDC on Arbitrum)" -ForegroundColor Yellow
Write-Host "Address: $testAddress" -ForegroundColor Yellow
Write-Host ""

# Test the getTokenBalance endpoint (MCP JSON-RPC format)
$uri = "http://localhost:4000/api/mcp"
$body = @{
    jsonrpc = "2.0"
    id = 1
    method = "tools/call"
    params = @{
        name = "getTokenBalance"
        arguments = @{
            contractAddress = $usdcContract
            address = $testAddress
        }
    }
} | ConvertTo-Json -Depth 4

Write-Host "Making request to getTokenBalance..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Body $body -ContentType "application/json"
    
    Write-Host "=== RESPONSE ===" -ForegroundColor Green
    if ($response.result -and $response.result.content -and $response.result.content[0]) {
        $responseText = $response.result.content[0].text
        Write-Host "Response Text:" -ForegroundColor Yellow
        Write-Host $responseText -ForegroundColor White
        
        # Parse the JSON content
        $result = $responseText | ConvertFrom-Json
        
        Write-Host ""
        Write-Host "=== ANALYSIS ===" -ForegroundColor Yellow
        Write-Host "Token Name: $($result.tokenInfo.name)" -ForegroundColor Cyan
        Write-Host "Token Symbol: $($result.tokenInfo.symbol)" -ForegroundColor Cyan
        Write-Host "Token Decimals: $($result.tokenInfo.decimals)" -ForegroundColor Cyan
        Write-Host "Raw Balance: $($result.balance.raw)" -ForegroundColor Cyan
        Write-Host "Formatted Balance: $($result.balance.formatted)" -ForegroundColor Cyan
        Write-Host "Full Precision: $($result.balance.fullPrecision)" -ForegroundColor Cyan
        
        # Check if defaults are being used
        if ($result.tokenInfo.name -eq "Unknown Token") {
            Write-Host "WARNING: Using default token name!" -ForegroundColor Red
        }
        if ($result.tokenInfo.symbol -eq "UNKNOWN") {
            Write-Host "WARNING: Using default token symbol!" -ForegroundColor Red
        }
        if ($result.tokenInfo.decimals -eq 18) {
            Write-Host "WARNING: Using default decimals (18)!" -ForegroundColor Red
        }
        
        if ($result.tokenInfo.name -eq "USD Coin" -and $result.tokenInfo.symbol -eq "USDC" -and $result.tokenInfo.decimals -eq 6) {
            Write-Host "SUCCESS: USDC token info parsed correctly!" -ForegroundColor Green
        }
    } else {
        Write-Host "Unexpected response structure:" -ForegroundColor Red
        $response | ConvertTo-Json -Depth 10
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== RAW API CALLS DEBUG ===" -ForegroundColor Yellow
Write-Host "Let's also test the raw API calls to see what the API returns..."

# Set your API key here (you can also set it as environment variable)
$apiKey = $env:ARBISCAN_API_KEY
if (-not $apiKey) {
    Write-Host "Warning: ARBISCAN_API_KEY environment variable not set. API calls may be rate limited." -ForegroundColor Yellow
    $apiKey = ""
}

$baseUrl = "https://api.arbiscan.io/api"

Write-Host ""
Write-Host "1. Testing token balance call..." -ForegroundColor Cyan
$balanceUrl = "$baseUrl" + "?module=account&action=tokenbalance&contractaddress=$usdcContract&address=$testAddress&tag=latest&apikey=$apiKey"
try {
    $balanceResp = Invoke-RestMethod -Uri $balanceUrl
    Write-Host "Balance Response: $($balanceResp | ConvertTo-Json -Depth 3)" -ForegroundColor White
} catch {
    Write-Host "Balance API Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing decimals call..." -ForegroundColor Cyan
$decimalsUrl = "$baseUrl" + "?module=proxy&action=eth_call&to=$usdcContract&data=0x313ce567&tag=latest&apikey=$apiKey"
try {
    $decimalsResp = Invoke-RestMethod -Uri $decimalsUrl
    Write-Host "Decimals Response: $($decimalsResp | ConvertTo-Json -Depth 3)" -ForegroundColor White
    if ($decimalsResp.result -and $decimalsResp.result -ne "0x") {
        $decimalsValue = [Convert]::ToInt32($decimalsResp.result, 16)
        Write-Host "Parsed Decimals: $decimalsValue" -ForegroundColor Green
    }
} catch {
    Write-Host "Decimals API Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing name call..." -ForegroundColor Cyan
$nameUrl = "$baseUrl" + "?module=proxy&action=eth_call&to=$usdcContract&data=0x06fdde03&tag=latest&apikey=$apiKey"
try {
    $nameResp = Invoke-RestMethod -Uri $nameUrl
    Write-Host "Name Response: $($nameResp | ConvertTo-Json -Depth 3)" -ForegroundColor White
    if ($nameResp.result -and $nameResp.result -ne "0x") {
        Write-Host "Raw Name Hex: $($nameResp.result)" -ForegroundColor White
        # Try to decode hex to see if we can parse it
        try {
            $nameHex = $nameResp.result.Substring(2)  # Remove 0x
            $bytes = [byte[]]@()
            for ($i = 0; $i -lt $nameHex.Length; $i += 2) {
                $bytes += [Convert]::ToByte($nameHex.Substring($i, 2), 16)
            }
            $nameStr = [System.Text.Encoding]::UTF8.GetString($bytes).Trim([char]0)
            Write-Host "Attempted Name Decode: '$nameStr'" -ForegroundColor Green
        } catch {
            Write-Host "Name decode failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "Name API Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Testing symbol call..." -ForegroundColor Cyan
$symbolUrl = "$baseUrl" + "?module=proxy&action=eth_call&to=$usdcContract&data=0x95d89b41&tag=latest&apikey=$apiKey"
try {
    $symbolResp = Invoke-RestMethod -Uri $symbolUrl
    Write-Host "Symbol Response: $($symbolResp | ConvertTo-Json -Depth 3)" -ForegroundColor White
    if ($symbolResp.result -and $symbolResp.result -ne "0x") {
        Write-Host "Raw Symbol Hex: $($symbolResp.result)" -ForegroundColor White
        # Try to decode hex
        try {
            $symbolHex = $symbolResp.result.Substring(2)  # Remove 0x
            $bytes = [byte[]]@()
            for ($i = 0; $i -lt $symbolHex.Length; $i += 2) {
                $bytes += [Convert]::ToByte($symbolHex.Substring($i, 2), 16)
            }
            $symbolStr = [System.Text.Encoding]::UTF8.GetString($bytes).Trim([char]0)
            Write-Host "Attempted Symbol Decode: '$symbolStr'" -ForegroundColor Green
        } catch {
            Write-Host "Symbol decode failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "Symbol API Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Green
