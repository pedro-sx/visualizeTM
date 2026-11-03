@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 22 ou superior em https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo Preparando o site pela primeira vez...
  call npm install
  if errorlevel 1 pause & exit /b 1
)

start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"
call npm run dev
if errorlevel 1 (
  echo.
  echo Nao foi possivel iniciar o site. Mantenha esta janela aberta para ler o erro.
  pause
)
