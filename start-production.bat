@echo off
setlocal
cd /d "%~dp0"

echo [Restaura] Launching Unified Full-Stack Production Server...
call npm run build
start http://localhost:5005
node backend/server.js
pause
