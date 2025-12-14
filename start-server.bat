@echo off
echo Starting SIH Project Server...
echo.

REM Get IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP: =%

echo Your IP Address: %IP%
echo.
echo Access URLs:
echo Local: http://localhost:3001
echo Network: http://%IP%:3001
echo.
echo Starting backend server...

cd backend
npm run dev