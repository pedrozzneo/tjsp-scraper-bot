Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get the script directory
scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)
desktopPath = WshShell.SpecialFolders("Desktop")
shortcutPath = desktopPath & "\Julgados Automation.lnk"

' Create shortcut
Set Shortcut = WshShell.CreateShortcut(shortcutPath)
Shortcut.TargetPath = "powershell.exe"
Shortcut.Arguments = "-WindowStyle Hidden -Command ""cd '" & scriptPath & "'; npm start"""
Shortcut.WorkingDirectory = scriptPath
Shortcut.Description = "Launch Julgados Automation Desktop App"
Shortcut.WindowStyle = 7  ' Minimized/Hidden
Shortcut.Save

WScript.Echo "Desktop shortcut created successfully!" & vbCrLf & vbCrLf & "Location: " & shortcutPath & vbCrLf & vbCrLf & "You can now drag it anywhere on your desktop!"

