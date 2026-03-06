@echo off
cd /d C:\react\nextjs-login

set PORT=3001
set LOGFILE=server-log.txt

echo ===================================== >> %LOGFILE%
echo Starting server %date% %time% >> %LOGFILE%
echo ===================================== >> %LOGFILE%

:loop

node --trace-uncaught node_modules/next/dist/bin/next start >> %LOGFILE% 2>&1

echo. >> %LOGFILE%
echo ===================================== >> %LOGFILE%
echo Server crashed %date% %time% >> %LOGFILE%
echo ===================================== >> %LOGFILE%
echo. >> %LOGFILE%

timeout /t 5
goto loop