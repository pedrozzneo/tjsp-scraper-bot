# Create desktop shortcut for Julgados Automation
# You can move this shortcut anywhere on your desktop after creation

try {
    $scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $shortcutPath = Join-Path $desktopPath "Julgados Automation.lnk"
    
    Write-Host "Creating shortcut..." -ForegroundColor Yellow
    Write-Host "Project path: $scriptPath" -ForegroundColor Gray
    Write-Host "Desktop path: $desktopPath" -ForegroundColor Gray
    
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($shortcutPath)
    $Shortcut.TargetPath = "powershell.exe"
    $Shortcut.Arguments = "-WindowStyle Hidden -Command `"cd '$scriptPath'; npm start`""
    $Shortcut.WorkingDirectory = $scriptPath
    $Shortcut.Description = "Launch Julgados Automation Desktop App"
    $Shortcut.WindowStyle = 7  # Minimized/Hidden
    $Shortcut.Save()
    
    if (Test-Path $shortcutPath) {
        Write-Host "`n✅ Desktop shortcut created successfully!" -ForegroundColor Green
        Write-Host "📁 Location: $shortcutPath" -ForegroundColor Cyan
        Write-Host "`n💡 Tip: You can drag this shortcut anywhere on your desktop!" -ForegroundColor Yellow
    } else {
        Write-Host "`n❌ ERROR: Shortcut file was not created!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "`n❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Stack trace: $($_.ScriptStackTrace)" -ForegroundColor Gray
    exit 1
}