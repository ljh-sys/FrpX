@echo off
:: 防止中文乱码，切换编码页到 UTF-8
chcp 65001 >nul

echo ==============================
echo 正在同步笔记...
echo ==============================
call git pull origin master
echo ==============================
echo 同步成功！
echo ==============================
pause