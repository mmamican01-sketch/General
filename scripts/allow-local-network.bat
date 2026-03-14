@echo off
:: Run this file as Administrator (Right-click -> Run as administrator)
:: Allows your phone to access the dev server on the same WiFi

netsh advfirewall firewall add rule name="Astro Dev 4321" dir=in action=allow protocol=TCP localport=4321
netsh advfirewall firewall add rule name="Astro Dev 4322" dir=in action=allow protocol=TCP localport=4322
netsh advfirewall firewall add rule name="Astro Dev 4323" dir=in action=allow protocol=TCP localport=4323

echo.
echo Done! Check terminal for Network URL (e.g. http://192.168.68.110:4323)
echo.
echo Make sure: 1) Dev server is running (npm run dev:site)
echo            2) Phone is on same WiFi as your PC
echo.
pause
