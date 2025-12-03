@echo off
echo Creating desktop shortcut...
echo.

REM Try VBScript first (more reliable on Windows)
if exist "%~dp0create-shortcut.vbs" (
    cscript //nologo "%~dp0create-shortcut.vbs"
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo Success! Check your desktop for "Julgados Automation"
        echo.
        pause
        exit /b 0
    )
)

REM Fallback to PowerShell
powershell.exe -ExecutionPolicy Bypass -File "%~dp0create-shortcut.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to create shortcut!
    echo Please check the error messages above.
    echo.
    pause
    exit /b 1
)
echo.
pause