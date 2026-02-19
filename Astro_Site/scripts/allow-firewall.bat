@echo off
:: Run as Administrator: Right-click -> Run as administrator
:: Or: Open CMD as Admin, cd to Astro_Site, run: scripts\allow-firewall.bat

netsh advfirewall firewall delete rule name="Al Farhan Astro 4321" 2>nul
netsh advfirewall firewall delete rule name="Al Farhan Dashboard 3100" 2>nul

netsh advfirewall firewall add rule name="Al Farhan Astro 4321" dir=in action=allow protocol=TCP localport=4321
netsh advfirewall firewall add rule name="Al Farhan Dashboard 3100" dir=in action=allow protocol=TCP localport=3100

echo.
echo Firewall rules added. Ports 4321 and 3100 are now allowed.
echo.
pause
