@echo off
title FrpX Builder
cls
echo.
echo   ================================
echo        FrpX Builder (Wails)
echo   ================================
echo.

taskkill /F /IM FrpX.exe >nul 2>&1
timeout /t 1 /nobreak >nul

set PATH=%USERPROFILE%\sdk\go\bin;%USERPROFILE%\go\bin;C:\msys64\mingw64\bin;%PATH%
set CGO_ENABLED=1

echo   [1/3] Tidy modules ...
cd /d "%~dp0"
go mod tidy >nul 2>&1
echo         - Done

echo.
echo   [2/3] Building FrpX.exe ...
if not exist "build\windows" mkdir "build\windows"
if exist "%~dp0assets\icon.ico" (
    copy /Y "%~dp0assets\icon.ico" "build\windows\icon.ico" >nul
)

wails build -ldflags "-s -w -H windowsgui"
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
for %%A in ("build\bin\FrpX.exe") do (
    echo     Path: %~dp0build\bin\FrpX.exe
    echo     Size: %%~zA bytes
)
echo   -------------------------------
echo.
echo   ================================
echo           DONE!
echo   ================================
echo.
pause
