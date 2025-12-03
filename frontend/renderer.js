// This file runs in the renderer process and has access to the preload script

const form = document.getElementById('scraper-form');
const submitBtn = document.getElementById('submit-btn');
const statusSection = document.getElementById('status-section');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const outputConsole = document.getElementById('output-console');
const classeSelect = document.getElementById('classe');
const classeCustomInput = document.getElementById('classe-custom');

// Handle custom class input visibility
classeSelect.addEventListener('change', () => {
    if (classeSelect.value === '__CUSTOM__') {
        classeCustomInput.classList.remove('hidden');
        classeCustomInput.required = true;
        classeSelect.required = false;
    } else {
        classeCustomInput.classList.add('hidden');
        classeCustomInput.required = false;
        classeSelect.required = true;
    }
});

// Convert date from YYYY-MM-DD to DD/MM/YYYY
function convertDateFormat(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Add line to output console
function addOutputLine(message, className = '') {
    const line = document.createElement('div');
    line.className = `output-line ${className}`;
    line.textContent = message;
    outputConsole.appendChild(line);
    
    // Auto-scroll to bottom
    outputConsole.scrollTop = outputConsole.scrollHeight;
}

// Update status indicator
function updateStatus(type, message) {
    statusSection.classList.remove('hidden');
    statusIndicator.className = `status-indicator ${type}`;
    statusText.textContent = message;
}

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const classeSelectValue = classeSelect.value;
    const classe = classeSelectValue === '__CUSTOM__' 
        ? classeCustomInput.value.trim() 
        : classeSelectValue;
    
    // Validate custom class if selected
    if (classeSelectValue === '__CUSTOM__' && !classe) {
        alert('Please enter a custom class name!');
        classeCustomInput.focus();
        return;
    }
    
    const startDate = convertDateFormat(document.getElementById('start-date').value);
    const endDate = convertDateFormat(document.getElementById('end-date').value);
    const downloadDir = 'C:\\Users\\pedro\\Documents\\temp';

    // Validate dates
    const startDateObj = new Date(document.getElementById('start-date').value);
    const endDateObj = new Date(document.getElementById('end-date').value);
    
    if (endDateObj < startDateObj) {
        alert('End date must be after start date!');
        return;
    }

    // Clear previous output
    outputConsole.innerHTML = '';

    // Disable form
    submitBtn.disabled = true;
    submitBtn.textContent = 'Scraping in progress...';

    // Update status
    updateStatus('running', 'Running...');
    addOutputLine(`Starting scraping for: ${classe}`, 'success');
    addOutputLine(`Date range: ${startDate} to ${endDate}`);
    addOutputLine(`Temp download directory: ${downloadDir}`);
    addOutputLine('Files will be auto-organized after download');
    addOutputLine('---');

    // Send scraping request to main process
    window.electronAPI.startScraping({
        classe,
        startDate,
        endDate,
        downloadDir
    });
});

// Listen for status updates from main process
window.electronAPI.onScrapingStatus((data) => {
    const { type, message } = data;

    switch (type) {
        case 'started':
            addOutputLine(message, 'success');
            break;

        case 'progress':
            // Split by lines and add each line
            const lines = message.trim().split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    addOutputLine(line);
                }
            });
            break;

        case 'error':
            addOutputLine(`ERROR: ${message}`, 'error');
            updateStatus('error', 'Error occurred');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Start Scraping';
            break;

        case 'completed':
            addOutputLine(message, 'success');
            updateStatus('completed', 'Completed');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Start Scraping';
            break;
    }
});

