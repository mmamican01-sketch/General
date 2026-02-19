# Run as Administrator to allow Astro (4321) and Dashboard (3100) on internal network
# Right-click PowerShell -> Run as Administrator, then: cd "path\to\Astro_Site"; .\scripts\allow-firewall.ps1

$rule1 = "Al Farhan Astro 4321"
$rule2 = "Al Farhan Dashboard 3100"

# Remove existing rules
netsh advfirewall firewall delete rule name="$rule1" 2>$null
netsh advfirewall firewall delete rule name="$rule2" 2>$null

# Add rules -  for home/office networks
netsh advfirewall firewall add rule name="$rule1" dir=in action=allow protocol=TCP localport=4321
netsh advfirewall firewall add rule name="$rule2" dir=in action=allow protocol=TCP localport=3100
Write-Host "`nFirewall rules added. Ports 4321 and 3100 are now allowed on Private and Public networks." -ForegroundColor Green
Write-Host "`nYour IP addresses:" -ForegroundColor Cyan
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.*" } | ForEach-Object { Write-Host "  $($_.IPAddress) ($($_.InterfaceAlias))" }
