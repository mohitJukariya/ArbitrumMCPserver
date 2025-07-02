# Test script for getTokenBalance method
# This script will test the USDC token balance and verify if API responses are working correctly

# USDC contract address on Arbitrum
$usdcContract = "0xA0b86a33E6441a8c577e5Df1E0F2B09D1d8fE70D"

# Test account address (you can provide a specific address)
# Using a known address with USDC balance for testing
$testAccount = "0x1234567890123456789012345678901234567890"  # Replace with actual address

# Server URL
$serverUrl = "http://localhost:3000/api"

Write-Host "=== Testing getTokenBalance Method ===" -ForegroundColor Green
Write-Host "Contract Address (USDC): $usdcContract"
Write-Host "Account Address: $testAccount"
Write-Host ""

# Test the getTokenBalance endpoint
try {
    $body = @{
        tool = "getTokenBalance"
        arguments = @{
            contractAddress = $usdcContract
            address = $testAccount
        }
    } | ConvertTo-Json -Depth 3

    Write-Host "Making request to server..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $serverUrl -Method POST -Body $body -ContentType "application/json"
    
    Write-Host "Response received:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
    # Parse the response to check for defaults
    $responseText = $response.content[0].text
    $responseObj = $responseText | ConvertFrom-Json
    
    Write-Host "`n=== Analysis ===" -ForegroundColor Cyan
    Write-Host "Token Name: $($responseObj.tokenInfo.name)"
    Write-Host "Token Symbol: $($responseObj.tokenInfo.symbol)"
    Write-Host "Token Decimals: $($responseObj.tokenInfo.decimals)"
    Write-Host "Raw Balance: $($responseObj.balance.raw)"
    Write-Host "Formatted Balance: $($responseObj.balance.formatted)"
    
    # Check if we're getting default values
    if ($responseObj.tokenInfo.name -eq "Unknown Token") {
        Write-Host "WARNING: Using default token name - API might not be returning name" -ForegroundColor Red
    } else {
        Write-Host "SUCCESS: Got actual token name from API" -ForegroundColor Green
    }
    
    if ($responseObj.tokenInfo.symbol -eq "UNKNOWN") {
        Write-Host "WARNING: Using default token symbol - API might not be returning symbol" -ForegroundColor Red
    } else {
        Write-Host "SUCCESS: Got actual token symbol from API" -ForegroundColor Green
    }
    
    if ($responseObj.tokenInfo.decimals -eq 18) {
        Write-Host "WARNING: Using default decimals (18) - might be default or actual" -ForegroundColor Yellow
    } else {
        Write-Host "SUCCESS: Got non-default decimals from API: $($responseObj.tokenInfo.decimals)" -ForegroundColor Green
    }

} catch {
    Write-Host "Error making request: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the server is running on port 3000" -ForegroundColor Yellow
}

Write-Host "`n=== Manual API Tests ===" -ForegroundColor Cyan
Write-Host "Let's test the individual API calls to debug the issue..."

# Test individual API calls to debug
$apiKey = $env:ARBISCAN_API_KEY
if (-not $apiKey) {
    Write-Host "WARNING: ARBISCAN_API_KEY environment variable not set" -ForegroundColor Yellow
    $apiKey = ""
}

$baseUrl = "https://api.arbiscan.io/api"

try {
    Write-Host "`n1. Testing token balance API call..." -ForegroundColor Yellow
    $balanceUrl = "$baseUrl?module=account&action=tokenbalance&contractaddress=$usdcContract&address=$testAccount&tag=latest&apikey=$apiKey"
    $balanceResponse = Invoke-RestMethod -Uri $balanceUrl
    Write-Host "Balance Response:"
    $balanceResponse | ConvertTo-Json | Write-Host
    
    Write-Host "`n2. Testing decimals API call..." -ForegroundColor Yellow
    $decimalsUrl = "$baseUrl?module=proxy&action=eth_call&to=$usdcContract&data=0x313ce567&tag=latest&apikey=$apiKey"
    $decimalsResponse = Invoke-RestMethod -Uri $decimalsUrl
    Write-Host "Decimals Response:"
    $decimalsResponse | ConvertTo-Json | Write-Host
    
    if ($decimalsResponse.result -and $decimalsResponse.result -ne "0x") {
        $decimals = [Convert]::ToInt32($decimalsResponse.result, 16)
        Write-Host "Parsed Decimals: $decimals" -ForegroundColor Green
    } else {
        Write-Host "No decimals data returned or empty result" -ForegroundColor Red
    }
    
    Write-Host "`n3. Testing name API call..." -ForegroundColor Yellow
    $nameUrl = "$baseUrl?module=proxy&action=eth_call&to=$usdcContract&data=0x06fdde03&tag=latest&apikey=$apiKey"
    $nameResponse = Invoke-RestMethod -Uri $nameUrl
    Write-Host "Name Response:"
    $nameResponse | ConvertTo-Json | Write-Host
    
    Write-Host "`n4. Testing symbol API call..." -ForegroundColor Yellow
    $symbolUrl = "$baseUrl?module=proxy&action=eth_call&to=$usdcContract&data=0x95d89b41&tag=latest&apikey=$apiKey"
    $symbolResponse = Invoke-RestMethod -Uri $symbolUrl
    Write-Host "Symbol Response:"
    $symbolResponse | ConvertTo-Json | Write-Host

} catch {
    Write-Host "Error in manual API testing: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
Write-Host "Please provide the actual account address and run this script to test with real data."
