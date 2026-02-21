@echo off
echo Starting Cyber Awareness App (HTTPS)...
echo.
echo The app will run on https://localhost:5173
echo You may see a security warning - click "Advanced" then "Proceed to localhost"
echo.
cd /d "%~dp0"
call npm run dev
pause
