# Refactoring Notes

## Global Variables Removal

**Date:** December 2, 2025

### Problem
The original code used global variables (`driver`, `result`, `download_dir`) which:
- Made the code harder to test
- Created implicit dependencies
- Polluted the global namespace
- Made function behavior less predictable

### Solution
Refactored to use proper parameter passing and return values.

---

## Changes Made

### Before (with globals):
```python
result = None
download_dir = r"C:\Users\pedro\Documents\temp"
driver = None

def scrape(classe, date, download_dir):
    global result
    global driver
    # ... function body
```

### After (clean parameters):
```python
def scrape(driver, classe, date, download_dir, result):
    """
    Args:
        driver: Selenium WebDriver instance
        classe: Class name to scrape
        date: Date to scrape
        download_dir: Download directory path
        result: Previous result WebElement
    
    Returns:
        tuple: (driver, result) Updated driver and result
    """
    # ... function body
    return driver, result
```

---

## Function Signatures

### `scrape(driver, classe, date, download_dir, result)`
**Parameters:**
- `driver`: WebDriver instance (can be reset/replaced)
- `classe`: Class name to scrape
- `date`: Date in DD/MM/YYYY format
- `download_dir`: Temporary download directory path
- `result`: Previous result WebElement (for staleness checking)

**Returns:**
- `(driver, result)`: Tuple of updated driver and result

**Purpose:** Scrapes data for a single class and date combination.

---

### `solve_errors(driver, download_dir, result)`
**Parameters:**
- `driver`: WebDriver instance
- `download_dir`: Temporary download directory path
- `result`: Current result WebElement

**Returns:**
- `(driver, result)`: Tuple of updated driver and result

**Purpose:** Retries failed scraping attempts from the error log.

---

### `main(classe, start_date_str, end_date_str, download_directory=None)`
**Parameters:**
- `classe`: Single class name to scrape
- `start_date_str`: Start date in DD/MM/YYYY format
- `end_date_str`: End date in DD/MM/YYYY format
- `download_directory`: Optional custom download directory (default: `C:\Users\pedro\Documents\temp`)

**Returns:** None (prints output and exits)

**Purpose:** Main entry point that orchestrates the scraping process.

---

## Benefits

### 1. **Cleaner Code**
- No global state pollution
- Explicit dependencies through parameters
- Clear data flow

### 2. **Better Testability**
- Functions can be tested in isolation
- No hidden global state to mock
- Pure function behavior (mostly)

### 3. **Improved Maintainability**
- Function signatures document their dependencies
- Easier to understand data flow
- Less coupling between functions

### 4. **Type Safety**
- Clear input/output contracts
- Easier to add type hints in the future
- Better IDE autocomplete support

### 5. **Recursion Safety**
- When `scrape()` calls itself recursively (timeout case), it properly returns updated values
- No risk of stale global references

---

## Data Flow

```
main()
  │
  ├─ Initializes: driver, result, download_dir
  │
  ├─ Loop: for each date
  │   │
  │   └─ scrape(driver, classe, date, download_dir, result)
  │       │
  │       ├─ Returns: (updated_driver, updated_result)
  │       │
  │       └─ On timeout: recursively calls itself with reset driver
  │
  └─ solve_errors(driver, download_dir, result)
      │
      └─ For each error: calls scrape()
          │
          └─ Returns: (updated_driver, updated_result)
```

---

## Migration Notes

### Old Code Pattern:
```python
global driver
driver = d.reset(driver, download_dir)
scrape(classe, date, download_dir)
```

### New Code Pattern:
```python
driver = d.reset(driver, download_dir)
driver, result = scrape(driver, classe, date, download_dir, result)
```

### Key Differences:
1. No `global` declarations needed
2. Functions return updated state
3. Caller must capture return values
4. State mutations are explicit

---

## Future Improvements

Potential enhancements for even cleaner code:

1. **Create a ScraperContext class:**
   ```python
   class ScraperContext:
       def __init__(self, driver, download_dir):
           self.driver = driver
           self.download_dir = download_dir
           self.result = None
   ```

2. **Add type hints:**
   ```python
   def scrape(driver: WebDriver, classe: str, date: str, 
              download_dir: str, result: Optional[WebElement]) -> Tuple[WebDriver, Optional[WebElement]]:
   ```

3. **Extract retry logic:**
   ```python
   @retry(max_attempts=3)
   def scrape_with_retry(...):
   ```

4. **Better error handling:**
   - Return error objects instead of raising exceptions
   - Use Result/Either pattern for explicit error handling

