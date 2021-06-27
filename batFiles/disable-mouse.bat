@echo off
set key="HKEY_LOCAL_MACHINE\system\CurrentControlSet\Services\Mouclass"
set key="HKEY_LOCAL_MACHINE\system\CurrentControlSet\Services\Mouclass"
reg delete %key%
reg delete %key%
reg add %key% /v Start /t REG_DWORD /d 4
reg add %key% /v Start /t REG_DWORD /d 4