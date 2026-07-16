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

echo   [1/4] Clean old build ...
if exist FrpX.exe (
    del /F /Q FrpX.exe
    echo         - Deleted FrpX.exe
) else (
    echo         - No old build found
)

set PATH=%USERPROFILE%\sdk\go\bin;%USERPROFILE%\go\bin;C:\msys64\mingw64\bin;%PATH%
set CGO_ENABLED=1

echo.
echo   [2/4] Tidy modules ...
cd /d "%~dp0"
go mod tidy
if errorlevel 1 (
    echo         - Module tidy failed, continuing...
)

echo.
echo   [3/4] Building FrpX.exe ...
wails build -ldflags "-s -w -H windowsgui"
if errorlevel 1 (
    echo.
    echo   ================================
    echo       BUILD FAILED
    echo   ================================
    pause
    exit /b 1
)

rem Copy from wails output dir to project root
if exist "build\bin\FrpX.exe" (
    copy /Y "build\bin\FrpX.exe" FrpX.exe >nul
    echo         - Copied to project root
)

echo         - Build OK

echo.
echo   [4/4] Result
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
