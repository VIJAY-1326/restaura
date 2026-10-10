@echo off
setlocal
cd /d "%~dp0"

echo [Restaura] Pushing codebase to github.com/VIJAY-1326/restaura.git...
git branch -M main
git push -u origin main
pause
