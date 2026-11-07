Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "d:\BuzzNews\runDailyNewsUpdate.bat" & Chr(34), 0
Set WshShell = Nothing
