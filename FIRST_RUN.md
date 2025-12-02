# First Run Setup

Before running the application for the first time, make sure the temporary download directory exists.

## Create Temp Directory

Run this command in PowerShell or Command Prompt:

```powershell
mkdir "C:\Users\pedro\Documents\temp"
```

Or manually create the folder:
1. Open File Explorer
2. Navigate to `C:\Users\pedro\Documents\`
3. Create a new folder named `temp`

## Then Install & Run

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Run the application
npm start
```

## How It Works

**Download Process:**
1. 📥 Files download to `C:\Users\pedro\Documents\temp` (temporary)
2. ✅ Verified downloads are moved to `C:\Users\pedro\Documents\sentences\[Class]\[Year]\[Month]\[Date]`
3. 🧹 Temp folder is cleaned after each scrape

**Why use a temp folder?**
- Failed downloads don't mess up your organized storage
- Easy to verify and validate files before moving
- Clean separation between "in-progress" and "completed" downloads
- Automatic cleanup prevents disk space issues

## Troubleshooting

**"Permission denied" error:**
- Make sure the temp folder exists
- Check you have write permissions to `C:\Users\pedro\Documents\`
- Try running as Administrator

**"Folder not found" error:**
- Create the temp directory as shown above
- Verify the path is correct

**Files not moving to final location:**
- Check your Google Drive is mounted at `G:\`
- Verify permissions for the JulgadosBackup folder

