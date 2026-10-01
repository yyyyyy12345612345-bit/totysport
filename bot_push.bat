@echo off
chcp 65001 >nul
title 🤖 TOTY SPORT - GITHUB UPLOADER BOT
cd /d "%~dp0"

%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0bot_push.ps1"

if %errorlevel% neq 0 (
    echo.
    echo حدث خطأ أثناء تشغيل البوت. اضغط أي زر للمتابعة...
    pause >nul
)
