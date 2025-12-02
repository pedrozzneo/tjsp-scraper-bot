# Troubleshooting Guide

## Common Issues and Solutions

### Issue: Browser Opens, Closes, and Repeats Infinitely

**Symptoms:**
- Electron app launches successfully
- Chrome browser opens
- Form gets filled
- Browser closes and reopens
- Process repeats endlessly

**Causes:**
1. **Timeout loop** - Forms taking longer than 10 seconds to process
2. **Missing directories** - temp or final storage directories don't exist
3. **Encoding issues** - Special characters in class names not being handled correctly

**Solutions:**

#### 1. Check Python Output
Open Electron DevTools (View > Toggle Developer Tools) and check the Console for:
- Python stdout messages
- Python stderr errors
- Process exit codes

#### 2. Verify Directories Exist
```powershell
# Check if temp directory exists
Test-Path "C:\Users\pedro\Documents\temp"

# Check if sentences directory exists
Test-Path "C:\Users\pedro\Documents\sentences"

# Create them if they don't exist
mkdir "C:\Users\pedro\Documents\temp" -Force
mkdir "C:\Users\pedro\Documents\sentences" -Force
```

#### 3. Test Python Script Directly
Run the backend directly to see detailed errors:
```powershell
python backend/app.py --classe "Ação Civil Pública" --start-date "01/12/2025" --end-date "01/12/2025"
```

#### 4. Check for Timeout Issues
If forms consistently take > 10 seconds:
- The script will retry up to 3 times
- After 3 retries, it will continue anyway
- Check your internet connection
- Check if the TJSP website is responding slowly

---

### Issue: Encoding Errors (Strange Characters)

**Symptoms:**
- Class names show as `A├º├úo` instead of `Ação`
- Python crashes with `UnicodeDecodeError`

**Solution:**
The fix is already applied in `main.js`:
```javascript
const pythonProcess = spawn('python', args, {
  env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
});
```

If still having issues:
1. Ensure your terminal supports UTF-8
2. Check Python version: `python --version` (should be 3.8+)
3. Set Windows console to UTF-8:
   ```powershell
   chcp 65001
   ```

---

### Issue: Python Not Found

**Symptoms:**
- Error: `'python' is not recognized`
- Process fails to start

**Solutions:**

#### Option 1: Add Python to PATH
1. Find Python installation: `where python`
2. Add to PATH in System Environment Variables

#### Option 2: Use Full Python Path
Edit `main.js` line ~79:
```javascript
// Instead of 'python', use full path
const pythonProcess = spawn('C:\\Python314\\python.exe', args, {
```

#### Option 3: Use `py` launcher
```javascript
const pythonProcess = spawn('py', ['-3', ...args], {
```

---

### Issue: Chrome Driver Issues

**Symptoms:**
- `SessionNotCreatedException`
- `ChromeDriver version mismatch`

**Solution:**
The `webdriver-manager` should handle this automatically, but if issues persist:

1. **Clear webdriver cache:**
   ```powershell
   rm -r ~\.wdm -Force
   ```

2. **Update Chrome:**
   - Check Chrome version: `chrome://version`
   - Update to latest version

3. **Reinstall webdriver-manager:**
   ```powershell
   pip uninstall webdriver-manager
   pip install webdriver-manager
   ```

---

### Issue: Files Not Moving to Final Location

**Symptoms:**
- Files download to temp directory
- Files don't appear in `sentences` folder
- Temp directory not cleaned up

**Checks:**

1. **Verify sentences directory exists:**
   ```powershell
   mkdir "C:\Users\pedro\Documents\sentences" -Force
   ```

2. **Check permissions:**
   - Right-click on `sentences` folder
   - Properties > Security
   - Ensure your user has "Full Control"

3. **Check console for errors:**
   - Look for "Error while moving files"
   - Check if files already exist (they won't be overwritten)

4. **Check disk space:**
   ```powershell
   Get-PSDrive C | Select-Object Used,Free
   ```

---

### Issue: Electron App Won't Start

**Symptoms:**
- `npm start` fails
- Blank window appears
- Immediate crash

**Solutions:**

1. **Reinstall node modules:**
   ```powershell
   rm -r node_modules -Force
   rm package-lock.json -Force
   npm install
   ```

2. **Check Node.js version:**
   ```powershell
   node --version  # Should be 16+
   ```

3. **Check for port conflicts:**
   - Close other Electron apps
   - Restart your computer

4. **Run in dev mode for debugging:**
   ```powershell
   npm run dev
   ```

---

### Issue: No Output in Console

**Symptoms:**
- Browser opens but no log messages
- Can't tell what's happening

**Solution:**

1. **Open Electron DevTools:**
   - In the Electron app: View > Toggle Developer Tools
   - Or press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)

2. **Check the Console tab for:**
   - `Starting scraper with:` message
   - Python output messages
   - Error messages

3. **Enable verbose logging:**
   Edit `main.js` to add more console.log statements

---

### Issue: Date Validation Errors

**Symptoms:**
- "End date must be after start date" alert
- Dates not being accepted

**Solution:**
- Ensure end date is after start date
- Use the date pickers (don't type dates manually)
- Check that dates are in the future or recent past

---

### Issue: Slow Performance / Timeout

**Symptoms:**
- Forms take very long to fill
- Constant "Forms took too long" messages
- Multiple browser resets

**Solutions:**

1. **Increase timeout limit:**
   Edit `backend/app.py` line ~88:
   ```python
   # Change from 10 seconds to 30 seconds
   if timeTaken > timedelta(seconds=30) and classe != "Usucapião":
   ```

2. **Check internet speed:**
   - TJSP website requires stable connection
   - Test: https://www.speedtest.net/

3. **Reduce date range:**
   - Test with 1-2 days first
   - Expand if working well

4. **Check TJSP website status:**
   - Try accessing https://esaj.tjsp.jus.br/cjpg/ manually
   - May be down for maintenance

---

### Getting More Help

If none of these solutions work:

1. **Capture full error logs:**
   ```powershell
   npm start > output.log 2>&1
   ```

2. **Check the error.log in Python:**
   - Errors are tracked in `backend/error.py`
   - Check terminal output for error summaries

3. **Test each component separately:**
   - Test Python script directly (without Electron)
   - Test Electron UI (without Python)
   - Isolate the failing component

4. **Common debug commands:**
   ```powershell
   # Check Python
   python --version
   python -c "import selenium; print(selenium.__version__)"
   
   # Check Node
   node --version
   npm --version
   
   # Check directories
   Test-Path "C:\Users\pedro\Documents\temp"
   Test-Path "C:\Users\pedro\Documents\sentences"
   
   # List running Chrome instances
   Get-Process chrome
   ```

---

## Prevention Tips

1. **Always test with small date ranges first** (1-2 days)
2. **Monitor the console output** during scraping
3. **Keep Python and Node.js up to date**
4. **Regularly check disk space**
5. **Close other Chrome instances** before running
6. **Run as Administrator** if permission issues occur

---

## Quick Checklist Before Running

- [ ] Temp directory exists: `C:\Users\pedro\Documents\temp`
- [ ] Python installed and in PATH
- [ ] Node modules installed: `npm install`
- [ ] Python dependencies installed: `pip install -r requirements.txt`
- [ ] Chrome browser is up to date
- [ ] Internet connection is stable
- [ ] Selected valid date range (end after start)
- [ ] Selected a class from dropdown

