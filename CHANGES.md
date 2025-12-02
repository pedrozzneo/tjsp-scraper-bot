# Recent Changes

## Download Directory Configuration

**Date:** December 2, 2025

### Changes Made

The temporary download directory has been hardcoded to simplify the user interface:

#### Frontend Changes
- **Removed**: Download directory input field from `frontend/index.html`
- **Updated**: `frontend/renderer.js` to always use `C:\Users\pedro\Documents\temp`
- **Simplified**: User interface now only requires class selection and date range

#### Backend Changes
- **Updated**: Default temporary download directory in `backend/app.py` to `C:\Users\pedro\Documents\temp`
- **Maintained**: CLI `--download-dir` argument still available for advanced users

#### Main Process Changes
- **Updated**: `main.js` to always pass the download directory to Python subprocess

#### Documentation Updates
- **Updated**: `README.md` to reflect new temp download path
- **Updated**: `SETUP.md` to reflect new default path and clarify the workflow

### User Impact

**Before:**
- User could optionally specify custom download directory
- Default was `G:\Meu Drive\JulgadosBackup\moveDir`

**After:**
- Temporary download directory is always `C:\Users\pedro\Documents\temp`
- Cleaner, simpler UI with one less field
- More consistent behavior

### Technical Notes

**Download Workflow:**
1. Files are **temporarily downloaded** to `C:\Users\pedro\Documents\temp`
2. After successful download, files are **automatically moved** to final storage at `C:\Users\pedro\Documents\sentences\[Class]\[Year]\[Month]\[Date]`
3. The temp folder is **cleaned up** after each scrape operation

This two-step process ensures:
- Failed downloads don't pollute the final storage
- Files are only moved when complete and verified
- Temp directory stays clean between operations

### For Developers

If you need to change the temporary download directory in the future:

1. **Frontend**: Update the hardcoded path in `frontend/renderer.js` (line ~32)
2. **Backend**: Update the default in `backend/app.py` (line ~10)
3. **CLI**: Can still override with `--download-dir` argument

```javascript
// frontend/renderer.js
const downloadDir = 'C:\\Users\\pedro\\Documents\\temp';
```

```python
# backend/app.py
download_dir = r"C:\Users\pedro\Documents\temp"
```

