import os from "os";
const nets = Object.values(os.networkInterfaces()).flat();
const ip = nets.find((i) => i.family === "IPv4" && !i.internal)?.address || "localhost";

console.log(`
  Local:
  Astro:      http://localhost:4321/en/
  Dashboard:  http://localhost:3100

  Internal (LAN) - use IP ${ip}:
  Astro:      http://${ip}:4321/en/
  Dashboard:  http://${ip}:3100

  Login: admin / change-this-password

  If internal host doesn't work: allow ports 4321, 3100 in Windows Firewall
  (Run as Admin: netsh advfirewall firewall add rule name="Al Farhan Dev" dir=in action=allow protocol=TCP localport=4321,3100)
`);
