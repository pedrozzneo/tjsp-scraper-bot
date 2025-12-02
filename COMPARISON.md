# Before vs After Refactoring

## Global Variables Elimination

### ❌ Before (with globals)

```python
# Global state - can be modified anywhere
result = None
download_dir = r"C:\Users\pedro\Documents\temp"
driver = None

def scrape(classe, date, download_dir):
    # Access globals implicitly
    global result
    global driver
    
    form.fill_filters(driver, classe, date)
    result = link.present(driver, classe, date, result)
    
    if timeTaken > timedelta(seconds=10):
        driver = d.reset(driver, download_dir)
        scrape(classe, date, download_dir)  # Recursion relies on globals
        return
    
    # ... rest of function

def main(classe, start_date_str, end_date_str, download_directory=None):
    global driver
    global download_dir
    
    driver = d.set(download_dir)
    # ... rest of function
    scrape(classe, date, download_dir)  # Modifies globals
```

**Problems:**
- 🔴 Hidden dependencies on global state
- 🔴 Hard to test in isolation
- 🔴 Unpredictable side effects
- 🔴 Race conditions in concurrent scenarios
- 🔴 Difficult to reason about data flow

---

### ✅ After (clean parameters)

```python
# No global state!

def scrape(driver, classe, date, download_dir, result):
    """
    All dependencies explicit in signature.
    Returns updated state instead of modifying globals.
    """
    form.fill_filters(driver, classe, date)
    result = link.present(driver, classe, date, result)
    
    if timeTaken > timedelta(seconds=10):
        driver = d.reset(driver, download_dir)
        return scrape(driver, classe, date, download_dir, result)  # Returns new state
    
    return driver, result  # Explicit return

def main(classe, start_date_str, end_date_str, download_directory=None):
    # Local variables only
    download_dir = download_directory if download_directory else r"C:\Users\pedro\Documents\temp"
    driver = d.set(download_dir)
    result = None
    
    # ... rest of function
    driver, result = scrape(driver, classe, date, download_dir, result)  # Captures returned state
```

**Benefits:**
- ✅ Explicit dependencies in function signature
- ✅ Easy to test - just pass parameters
- ✅ Predictable behavior
- ✅ Safe for concurrent execution
- ✅ Clear data flow

---

## Code Quality Comparison

| Aspect | Before (Globals) | After (Parameters) |
|--------|-----------------|-------------------|
| **Testability** | Hard - need to mock globals | Easy - pass test values |
| **Readability** | Medium - hidden dependencies | High - explicit contracts |
| **Maintainability** | Low - implicit coupling | High - clear boundaries |
| **Debugging** | Hard - trace global mutations | Easy - follow parameters |
| **Thread Safety** | None | Better (still has shared error log) |
| **Function Purity** | Impure - side effects everywhere | More pure - explicit I/O |

---

## Real-World Example

### Testing the old code:
```python
# ❌ Difficult - need to manage globals
def test_scrape_old():
    global driver, result
    driver = MockDriver()
    result = None
    
    scrape("Ação Civil Pública", "01/12/2025", "C:\\temp")
    
    # Did it work? Check globals? What if another test modified them?
    assert result is not None
```

### Testing the new code:
```python
# ✅ Easy - pass parameters, check returns
def test_scrape_new():
    mock_driver = MockDriver()
    result = None
    
    new_driver, new_result = scrape(
        mock_driver, 
        "Ação Civil Pública", 
        "01/12/2025", 
        "C:\\temp",
        result
    )
    
    # Clear input/output contract
    assert new_result is not None
    assert new_driver is not None
```

---

## Function Call Comparison

### Before:
```python
# Implicit state changes
scrape(classe, date, download_dir)
# What changed? Who knows! 🤷
```

### After:
```python
# Explicit state returns
driver, result = scrape(driver, classe, date, download_dir, result)
# Clear: driver and result may have changed ✅
```

---

## Recursive Call Comparison

### Before:
```python
if timeTaken > timedelta(seconds=10):
    driver = d.reset(driver, download_dir)
    scrape(classe, date, download_dir)  # Global driver used/modified
    return  # What does this return? Nothing explicit
```

### After:
```python
if timeTaken > timedelta(seconds=10):
    driver = d.reset(driver, download_dir)
    return scrape(driver, classe, date, download_dir, result)  # Pass new driver, return its result
    # Clear: propagate the result up the call stack
```

---

## Documentation Quality

### Before:
```python
def scrape(classe, date, download_dir):
    # Missing: what about driver and result?
    pass
```

### After:
```python
def scrape(driver, classe, date, download_dir, result):
    """
    Scrape data for a single class and date.
    
    Args:
        driver: Selenium WebDriver instance
        classe: Class name to scrape
        date: Date to scrape (DD/MM/YYYY)
        download_dir: Download directory path
        result: Previous result WebElement
    
    Returns:
        tuple: (driver, result) Updated driver and result
    """
    pass
```

---

## Summary

The refactoring eliminates global state pollution by:
1. ✅ Making all dependencies explicit in function signatures
2. ✅ Returning updated state instead of modifying globals
3. ✅ Enabling better testing and debugging
4. ✅ Improving code readability and maintainability
5. ✅ Following functional programming principles where possible

**Result:** Cleaner, more maintainable, and more testable code! 🎉

