@echo off
cd /d "%~dp0"
echo Dang mo TOEIC Quest tai http://localhost:5173 bang Coc Coc
echo Dong cua so nay de tat web.
set "COCCOC=C:\Program Files\CocCoc\Browser\Application\browser.exe"
if exist "%COCCOC%" (
  start "" /min cmd /c "timeout /t 3 >nul && start "" "%COCCOC%" http://localhost:5173"
) else (
  echo Khong tim thay Coc Coc, mo bang trinh duyet mac dinh.
  start "" /min cmd /c "timeout /t 3 >nul && start http://localhost:5173"
)
npm run dev
pause
