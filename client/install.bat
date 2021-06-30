@echo off

cd ..

xcopy client\* %HOMEDRIVE%\ProgramData\client\ /E /F /H

pause