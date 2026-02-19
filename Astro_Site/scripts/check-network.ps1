# Diagnostic script - run from normal PowerShell (no admin needed)
# Helps troubleshoot ERR_CONNECTION_TIMED_OUT

Write-Host "`n=== Al Farhan Network Diagnostic ===" -ForegroundColor Cyan
Write-Host ""

# 1. Your IP addresses
Write-Host "1. Your IP addresses (use one of these to connect):" -ForegroundColor Yellow
try {
    $ips = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | 
        Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.*" }
    if ($ips) {
        $ips | ForEach-Object { Write-Host "   http://$($_.IPAddress):4321 (Astro)  |  http://$($_.IPAddress):3100 (Dashboard)" }
    } else {
        Write-Host "   Run: ipconfig" 
    }
} catch {
    Write-Host "   Run: ipconfig  (look for IPv4 Address under your network adapter)"
}
Write-Host ""

# 2. Check if ports are listening
Write-Host "2. Port status (4321, 3100):" -ForegroundColor Yellow
$port4321 = Get-NetTCPConnection -LocalPort 4321 -State Listen -ErrorAction SilentlyContinue
$port3100 = Get-NetTCPConnection -LocalPort 3100 -State Listen -ErrorAction SilentlyContinue
if ($port4321) { Write-Host "   Port 4321: LISTENING (Astro dev is running)" -ForegroundColor Green } else { Write-Host "   Port 4321: NOT listening - run 'npm run dev:all'" -ForegroundColor Red }
if ($port3100) { Write-Host "   Port 3100: LISTENING (Dashboard dev is running)" -ForegroundColor Green } else { Write-Host "   Port 3100: NOT listening - run 'npm run dev:all'" -ForegroundColor Red }
Write-Host ""

# 3. Firewall rules
Write-Host "3. Firewall rules for ports 4321, 3100:" -ForegroundColor Yellow
$rules = netsh advfirewall firewall show rule name=all | Select-String -Pattern "Al Farhan" -Context 0,5
if ($rules) { Write-Host "   Rules found. If still blocked, run allow-firewall.ps1 as Administrator." -ForegroundColor Green } 
else { Write-Host "   No Al Farhan rules found. Run as Admin: .\scripts\allow-firewall.ps1" -ForegroundColor Red }
Write-Host ""

# 4. Quick test
Write-Host "4. Quick local test:" -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:4321" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "   localhost:4321 - OK" -ForegroundColor Green
} catch {
    Write-Host "   localhost:4321 - Not reachable (is dev server running?)" -ForegroundColor Red
}
try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:3100" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "   localhost:3100 - OK" -ForegroundColor Green
} catch {
    Write-Host "   localhost:3100 - Not reachable (is dev server running?)" -ForegroundColor Red
}
Write-Host ""
Write-Host "If localhost works but 192.168.x.x doesn't: Windows Firewall is blocking. Run allow-firewall.ps1 as Administrator." -ForegroundColor Cyan
