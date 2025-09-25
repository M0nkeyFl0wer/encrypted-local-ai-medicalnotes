@echo off
echo.
echo ========================================
echo   ENCRYPTED MEDICAL NOTES SYSTEM
echo   HIPAA Compliant Testing Version
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed on this system.
    echo Please download Node.js from https://nodejs.org/
    echo Choose the LTS version and install it.
    echo Then run this script again.
    pause
    exit /b 1
)

echo Node.js found! Installing dependencies...
call npm install --only=production --silent

if errorlevel 1 (
    echo ERROR: Failed to install dependencies.
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo Starting Medical Notes System...
echo Press Ctrl+C to stop the system when done testing.
echo.
node src/index.js

echo.
echo Medical Notes System has stopped.
echo All medical data remains securely encrypted on this computer.
pause