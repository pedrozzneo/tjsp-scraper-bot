from datetime import datetime, timedelta
import argparse
import sys
import form 
import link
import files
import error 
import driver as d

def solve_errors(driver, download_dir, result):
    """
    Try to solve errors from the error log.
    
    Args:
        driver: Selenium WebDriver instance
        download_dir: Download directory path
        result: Previous result WebElement
    
    Returns:
        tuple: (driver, result) Updated driver and result
    """
    try:
        # Know how many errors are in the error log
        quantity = len(error.errors)
        print(f"Number of errors to solve: {quantity}")
        
        # If there are no errors, just return
        if quantity == 0:
            return driver, result
        
        # Try to solve each error
        for i in range(quantity):
            classe = error.errors[i].get("classe")
            date = error.errors[i].get("date")
            
            print(f"Trying to solve: {classe} on {date}")

            # Try to solve (no retries for error solving to avoid infinite loops)
            driver, result = scrape(driver, classe, date, download_dir, result, retry_count=0, max_retries=1)
        
        return driver, result
    except:
        raise

def scrape(driver, classe, date, download_dir, result, retry_count=0, max_retries=3):
    """
    Scrape data for a single class and date.
    
    Args:
        driver: Selenium WebDriver instance
        classe: Class name to scrape
        date: Date to scrape (DD/MM/YYYY)
        download_dir: Download directory path
        result: Previous result WebElement
        retry_count: Current retry attempt (internal use)
        max_retries: Maximum number of retries before giving up
    
    Returns:
        tuple: (driver, result) Updated driver and result
    """
    try:
        # Track the time from filling the forms to processing the results
        timeBeforeForms = datetime.now()

        # Fill out forms's fillters
        form.fill_filters(driver, classe, date)  

        # Collect the result if we have or not download links to process
        result = link.present(driver, classe, date, result)
        
        # Finally find out the time it took to process the forms
        timeAfterResult = datetime.now()
        timeTaken = timeAfterResult - timeBeforeForms

        # If it took too long, reset the driver and try again until it works out as it causes bug
        if timeTaken > timedelta(seconds=10) and classe != "Usucapião":
            if retry_count < max_retries:
                print(f"-> Forms took too long to process: {timeTaken}. Resetting driver (attempt {retry_count + 1}/{max_retries}).")
                driver = d.reset(driver, download_dir)
                return scrape(driver, classe, date, download_dir, result, retry_count + 1, max_retries)
            else:
                print(f"-> Forms took too long ({timeTaken}), but max retries reached. Continuing anyway.")
        else:
            print(f"-> Forms processed in {timeTaken}")
        
        # Situation with links to download
        if result.tag_name == "a":
            # Download the links
            link.download(driver, download_dir, classe, date)

            # Move the downloaded files to the respective folder or delete them if they already exist
            files.move_files(download_dir, classe, date, link.files_properly_downloaded)
        else:
            print("NO download links")

        return driver, result

    except Exception as e:
        result = None
        raise

def main(classe, start_date_str, end_date_str, download_directory=None):
    """
    Main function to scrape data for a single class and date range.
    
    Args:
        classe: Single class name to scrape
        start_date_str: Start date in DD/MM/YYYY format
        end_date_str: End date in DD/MM/YYYY format
        download_directory: Optional custom download directory
    """
    # Use custom download directory if provided, otherwise use default
    download_dir = download_directory if download_directory else r"C:\Users\pedro\Documents\temp"
    
    # Initialize driver
    driver = d.set(download_dir)
    
    # Initialize result tracker
    result = None
    
    print(f"classe: {classe}")

    # Parse dates
    startingDate = datetime.strptime(start_date_str, "%d/%m/%Y")
    endDate = datetime.strptime(end_date_str, "%d/%m/%Y")
    interval = (endDate - startingDate).days
    print(f"dates: from {startingDate.strftime('%d/%m/%Y')} to {endDate.strftime('%d/%m/%Y')}")

    # Access the main page
    driver.get("https://esaj.tjsp.jus.br/cjpg/")

    # Loop through each date
    for i in range(interval + 1):
        try:
            # Calculate the date for the current iteration and format it
            date = (startingDate + timedelta(days=i)).strftime("%d/%m/%Y")

            # Display the class and date being scraped
            print(f"\n{classe.upper()} ON {date.upper()}: \n")

            # Scrape the current class and date
            driver, result = scrape(driver, classe, date, download_dir, result)
            
        except Exception:
            # Reset everything
            driver = d.reset(driver, download_dir)
            result = None

        finally:
            # Clear the download dir and display the errors so far
            files.clear_directory(download_dir)
            error.display()
    
    try:
        # Try to solve the errors in the error log 
        driver, result = solve_errors(driver, download_dir, result)
    except Exception:
        # Reset everything
        driver = d.reset(driver, download_dir)
    
    # Close driver when done
    driver.quit()
    print("\n✅ Scraping completed!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Web scraper for legal documents')
    parser.add_argument('--classe', type=str, required=True, help='Class name to scrape')
    parser.add_argument('--start-date', type=str, required=True, help='Start date (DD/MM/YYYY)')
    parser.add_argument('--end-date', type=str, required=True, help='End date (DD/MM/YYYY)')
    parser.add_argument('--download-dir', type=str, help='Custom download directory')
    
    args = parser.parse_args()
    
    try:
        main(args.classe, args.start_date, args.end_date, args.download_dir)
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)