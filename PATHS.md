# File Path Configuration

## Overview

This document explains where files are stored during the scraping process.

---

## Directory Structure

### 1. Temporary Download Directory
**Path:** `C:\Users\pedro\Documents\temp`

**Purpose:** 
- Chrome downloads PDFs here first
- Temporary storage during verification
- Cleared after each scrape operation

**Created by:** 
- Must be created manually before first run
- See `FIRST_RUN.md` for setup instructions

---

### 2. Final Storage Directory
**Path:** `C:\Users\pedro\Documents\sentences\[Class]\[Year]\[Month]\[Date]`

**Purpose:**
- Permanent storage for verified downloads
- Organized by class, year, month, and date

**Structure Example:**
```
C:\Users\pedro\Documents\sentences\
├── Ação Civil Pública\
│   ├── 2025\
│   │   ├── Dezembro\
│   │   │   ├── 01-12-2025\
│   │   │   │   ├── document1.pdf
│   │   │   │   └── document2.pdf
│   │   │   ├── 02-12-2025\
│   │   │   │   └── document3.pdf
├── Ação Civil Coletiva\
│   └── 2025\
│       └── Novembro\
│           └── 30-11-2025\
│               └── document4.pdf
```

**Created by:**
- Automatically created by the application
- Created on-demand when files are moved

---

## File Movement Process

```
┌─────────────────────────────────────┐
│  1. Chrome Downloads                │
│  └─> C:\Users\pedro\Documents\temp  │
└─────────────────────────────────────┘
              │
              │ ✅ Verification
              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Organized Storage                                       │
│  └─> C:\Users\pedro\Documents\sentences\[Class]\...        │
└─────────────────────────────────────────────────────────────┘
              │
              │ 🧹 Cleanup
              ▼
┌─────────────────────────────────────┐
│  3. Temp Directory Cleared          │
│  └─> Ready for next scrape          │
└─────────────────────────────────────┘
```

---

## Code References

### Backend Configuration

**Temporary Directory:**
```python
# backend/app.py (line ~108)
download_dir = download_directory if download_directory else r"C:\Users\pedro\Documents\temp"
```

**Final Storage:**
```python
# backend/files.py (line ~28)
julgadosDir = r"C:\Users\pedro\Documents\sentences"
```

### Frontend Configuration

**Temporary Directory:**
```javascript
// frontend/renderer.js (line ~32)
const downloadDir = 'C:\\Users\\pedro\\Documents\\temp';
```

---

## Special Cases

### Usucapião Class

Files for "Usucapião" class are stored under "Usucapião Especial Coletiva":

```python
# backend/files.py
if classe == "Usucapião":
    classe = "Usucapião Especial Coletiva"
```

**Storage Path:**
```
C:\Users\pedro\Documents\sentences\Usucapião Especial Coletiva\...
```

---

## Month Names

Months are stored using Portuguese names:

| Number | Name |
|--------|------|
| 01 | Janeiro |
| 02 | Fevereiro |
| 03 | Março |
| 04 | Abril |
| 05 | Maio |
| 06 | Junho |
| 07 | Julho |
| 08 | Agosto |
| 09 | Setembro |
| 10 | Outubro |
| 11 | Novembro |
| 12 | Dezembro |

---

## Required Setup

Before first run, create the temp directory:

```powershell
mkdir "C:\Users\pedro\Documents\temp"
```

The `sentences` directory will be created automatically.

---

## Changing Paths

### To change the temporary directory:

1. **Frontend:** Edit `frontend/renderer.js` line ~32
2. **Backend:** Edit `backend/app.py` line ~108

### To change the final storage directory:

1. **Backend:** Edit `backend/files.py` line ~28

---

## Troubleshooting

### "Permission denied" errors
- Check write permissions for both `temp` and `sentences` folders
- Try running as Administrator

### "Path not found" errors
- Ensure `temp` directory exists
- The `sentences` directory should be created automatically

### Files not being organized
- Check the output console for errors
- Verify the `sentences` folder is writable
- Check disk space availability

---

## Disk Space Considerations

- **Temp Directory:** Should always be small (cleared after each scrape)
- **Sentences Directory:** Will grow over time with stored PDFs
- Monitor disk space regularly
- Consider archiving old files if needed

