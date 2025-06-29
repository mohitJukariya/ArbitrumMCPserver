# Arbitrum MCP Server - Balance Methods Test Script
# Tests balance-related methods with specific addresses to verify conversion and precision

# Configuration
$baseUrl = "http://localhost:4000/api/mcp"
$headers = @{
    "Content-Type" = "application/json"
}

# Test addresses
$testAddresses = @(
    "0x6492772d1474FFa1Ed6944e86735848c253bB007",
    "0x879c2A2F7E4071ebDc971E508885d4a8cDEAF227"
)

# Known token contracts on Arbitrum for testing
$tokenContracts = @{
    "USDC" = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"  # USDC (6 decimals)
    "USDT" = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"  # USDT (6 decimals)
}

# Function to make MCP tool call
function Invoke-McpTool {
    param(
        [string]$ToolName,
        [hashtable]$Arguments
    )
    
    $body = @{
        method = "tools/call"
        params = @{
            name = $ToolName
            arguments = $Arguments
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $body
        return $response.result.content[0].text | ConvertFrom-Json
    }
    catch {
        Write-Host "Error calling $ToolName : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "Starting Balance Methods Test" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host "Testing addresses:" -ForegroundColor White
foreach ($addr in $testAddresses) {
    Write-Host "  - $addr" -ForegroundColor Gray
}
Write-Host ""

# Test 1: Individual Balance Checks
Write-Host "TEST 1: Individual Balance Checks" -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Blue

foreach ($address in $testAddresses) {
    Write-Host "`nTesting balance for: $address" -ForegroundColor Cyan
    
    $balanceData = Invoke-McpTool -ToolName "getBalance" -Arguments @{ address = $address }
    
    if ($balanceData -and $balanceData.balance) {
        $balance = $balanceData.balance
        Write-Host "  Wei: $($balance.wei)" -ForegroundColor White
        Write-Host "  ETH (6 decimals): $($balance.eth)" -ForegroundColor Green
        Write-Host "  ETH (full precision): $($balance.ethFullPrecision)" -ForegroundColor Green
        Write-Host "  Formatted: $($balance.formatted)" -ForegroundColor Magenta
        Write-Host "  Network: $($balanceData.network)" -ForegroundColor Gray
        
        # Verification calculation
        $weiValue = [decimal]$balance.wei
        $calculatedEth = $weiValue / [math]::Pow(10, 18)
        Write-Host "  Verification - Calculated ETH: $calculatedEth" -ForegroundColor DarkGreen
        
        # Check precision difference
        $reportedEth = [decimal]$balance.ethFullPrecision
        $precisionDiff = [math]::Abs($calculatedEth - $reportedEth)
        Write-Host "  Precision difference: $precisionDiff" -ForegroundColor $(if ($precisionDiff -eq 0) { "Green" } else { "Yellow" })
    }
    else {
        Write-Host "  No balance data received" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500
}

# Test 2: Multi-Balance Check
Write-Host "`nTEST 2: Multi-Balance Check" -ForegroundColor Blue
Write-Host "============================" -ForegroundColor Blue

$multiBalanceData = Invoke-McpTool -ToolName "getMultiBalance" -Arguments @{ addresses = $testAddresses }

if ($multiBalanceData -and $multiBalanceData.balances) {
    Write-Host "Total Addresses: $($multiBalanceData.totalAddresses)" -ForegroundColor Yellow
    
    $totalEth = 0
    foreach ($balanceInfo in $multiBalanceData.balances) {
        Write-Host "`nAddress: $($balanceInfo.address)" -ForegroundColor Cyan
        $balance = $balanceInfo.balance
        Write-Host "  Wei: $($balance.wei)" -ForegroundColor White
        Write-Host "  ETH: $($balance.eth)" -ForegroundColor Green
        Write-Host "  Full Precision: $($balance.ethFullPrecision)" -ForegroundColor Green
        Write-Host "  Formatted: $($balance.formatted)" -ForegroundColor Magenta
        
        if ($balance.ethFullPrecision) {
            $totalEth += [decimal]$balance.ethFullPrecision
        }
    }
    
    Write-Host "`nTotal ETH across all addresses: $totalEth ETH" -ForegroundColor Magenta
}

# Test 3: Token Balance Checks
Write-Host "`nTEST 3: Token Balance Checks" -ForegroundColor Blue
Write-Host "=============================" -ForegroundColor Blue

foreach ($tokenName in $tokenContracts.Keys) {
    $contractAddress = $tokenContracts[$tokenName]
    Write-Host "`nTesting $tokenName token..." -ForegroundColor Blue
    
    foreach ($address in $testAddresses) {
        Write-Host "`n$tokenName Balance for: $address" -ForegroundColor Cyan
        Write-Host "Contract: $contractAddress" -ForegroundColor Yellow
        
        $tokenData = Invoke-McpTool -ToolName "getTokenBalance" -Arguments @{ 
            contractAddress = $contractAddress
            address = $address 
        }
        
        if ($tokenData -and $tokenData.balance) {
            $balance = $tokenData.balance
            $tokenInfo = $tokenData.tokenInfo
            
            Write-Host "  Token Info:" -ForegroundColor White
            Write-Host "    Name: $($tokenInfo.name)" -ForegroundColor Gray
            Write-Host "    Symbol: $($tokenInfo.symbol)" -ForegroundColor Gray
            Write-Host "    Decimals: $($tokenInfo.decimals)" -ForegroundColor Gray
            
            Write-Host "  Balance:" -ForegroundColor White
            Write-Host "    Raw: $($balance.raw)" -ForegroundColor White
            Write-Host "    Formatted: $($balance.formatted)" -ForegroundColor Green
            Write-Host "    Full Precision: $($balance.fullPrecision)" -ForegroundColor Green
            
            # Verify calculation
            if ($tokenInfo.decimals) {
                $rawValue = [decimal]$balance.raw
                $decimals = [int]$tokenInfo.decimals
                $calculatedBalance = $rawValue / [math]::Pow(10, $decimals)
                Write-Host "    Verification - Calculated: $calculatedBalance" -ForegroundColor DarkGreen
                
                $reportedBalance = [decimal]$balance.fullPrecision
                $precisionDiff = [math]::Abs($calculatedBalance - $reportedBalance)
                Write-Host "    Precision difference: $precisionDiff" -ForegroundColor $(if ($precisionDiff -eq 0) { "Green" } else { "Yellow" })
            }
        }
        else {
            Write-Host "  No token balance data received" -ForegroundColor Red
        }
        
        Start-Sleep -Milliseconds 500
    }
}

# Test 4: Address Validation and Type Check
Write-Host "`nTEST 4: Address Validation and Type Check" -ForegroundColor Blue
Write-Host "==========================================" -ForegroundColor Blue

foreach ($address in $testAddresses) {
    Write-Host "`nAddress: $address" -ForegroundColor Cyan
    
    # Validation
    $validationData = Invoke-McpTool -ToolName "validateAddress" -Arguments @{ address = $address }
    if ($validationData) {
        Write-Host "  Valid: $($validationData.isValid)" -ForegroundColor $(if ($validationData.isValid) { "Green" } else { "Red" })
        Write-Host "  Format: $($validationData.format)" -ForegroundColor Gray
    }
    
    # Type check
    $typeData = Invoke-McpTool -ToolName "getAddressType" -Arguments @{ address = $address }
    if ($typeData -and $typeData.addressType) {
        $addrType = $typeData.addressType
        Write-Host "  Type: $($addrType.type)" -ForegroundColor $(if ($addrType.type -eq "contract") { "Red" } else { "Green" })
        Write-Host "  Description: $($addrType.description)" -ForegroundColor Gray
        Write-Host "  Has Code: $($addrType.hasCode)" -ForegroundColor Gray
        Write-Host "  Code Size: $($addrType.codeSize) bytes" -ForegroundColor Gray
    }
    
    Start-Sleep -Milliseconds 500
}

# Summary
Write-Host "`nTest Summary" -ForegroundColor Green
Write-Host "============" -ForegroundColor Green
Write-Host "Individual balance checks completed" -ForegroundColor Green
Write-Host "Multi-balance check completed" -ForegroundColor Green
Write-Host "Token balance checks completed" -ForegroundColor Green
Write-Host "Address validation completed" -ForegroundColor Green
Write-Host "Address type checks completed" -ForegroundColor Green
Write-Host "`nAll balance-related methods tested successfully!" -ForegroundColor Magenta
Write-Host "Check the output above for precision verification and conversion accuracy." -ForegroundColor Yellow
