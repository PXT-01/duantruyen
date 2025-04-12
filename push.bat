@echo off
cd /d %~dp0
git add .
git commit -m "Auto update at %date% %time%"
git push origin truyentranh
pause
