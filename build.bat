@echo off
title FrpX Builder
cls
echo.
echo   ================================
echo          FrpX Builder
echo   ================================
echo.

taskkill /F /IM FrpX.exe >nul 2>&1
taskkill /F /IM FrpX-run.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo   [1/3] Clean old build ...
if exist FrpX.exe (
    del /F /Q FrpX.exe
    echo         - Deleted FrpX.exe
) else (
    echo         - No old build found
)

set PATH=%USERPROFILE%\sdk\go\bin;%USERPROFILE%\go\bin;C:\msys64\mingw64\bin;%PATH%
set CGO_ENABLED=1

echo.
echo   [2/3] Building FrpX.exe ...
cd /d "%~dp0"
go build -ldflags "-s -w -H windowsgui" -o FrpX.exe .
if errorlevel 1 (
    echo.
    echo   ================================
    echo       BUILD FAILED
    echo   ================================
    pause
    exit /b 1
)
echo         - Build OK

echo.
echo   [3/3] Result
echo   -------------------------------
for %%A in (FrpX.exe) do (
    echo     Path: %~dp0FrpX.exe
    echo     Size: %%~zA bytes
)
echo   -------------------------------
echo.
echo   ================================
echo           DONE!
echo   ================================
echo.
pause
