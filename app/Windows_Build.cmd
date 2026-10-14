@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Bitte Node.js LTS kostenlos von https://nodejs.org/ installieren.
  pause
  exit /b 1
)
if not exist node_modules (
  call npm ci --no-audit --no-fund
  if errorlevel 1 goto :error
)
call npm test
if errorlevel 1 goto :error
call npm run build
if errorlevel 1 goto :error
echo Fertig. Den INHALT von dist auf GitHub Pages hochladen.
pause
exit /b 0
:error
echo Fehler. Bitte die angezeigte Fehlermeldung pruefen.
pause
exit /b 1
