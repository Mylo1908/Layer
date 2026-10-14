@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Bitte zuerst Node.js LTS kostenlos von https://nodejs.org/ installieren.
  pause
  exit /b 1
)
if not exist node_modules (
  call npm ci --no-audit --no-fund
  if errorlevel 1 goto :error
)
echo Layer startet. Im Browser http://localhost:5173/ oeffnen.
echo Mit STRG+C beenden. Fuer iPhone-Installation die HTTPS-Anleitung lesen.
call npm run dev
pause
exit /b
:error
echo Installation fehlgeschlagen. Internetverbindung und Node-Version pruefen.
pause
exit /b 1
