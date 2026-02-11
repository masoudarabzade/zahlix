// File List Manager for German Numbers Practice
class FileListManager {
    constructor() {
        this.availableFiles = {
            integer: [],
            decimal: [],
            date: [],
            dateRange: [],
            time: [],
            timeRange: [],
            price: [],
            year: []
        };
        this.isLoaded = false;
        this.lastUpdate = null;
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes cache
        
        // Initialize
        this.init();
    }
    
    // Initialize the manager
    async init() {
        try {
            await this.loadAllFiles();
            this.isLoaded = true;
        } catch (error) {
            console.warn('Failed to load files from server:', error);
            this.useFallbackFiles();
        }
    }
    
    // Load all files from server
    async loadAllFiles() {
        console.log('Loading files from server...');
        
        // Load files for each mode
        const modes = Object.keys(this.availableFiles);
        const loadPromises = modes.map(mode => this.loadFilesForMode(mode));
        
        await Promise.all(loadPromises);
        
        this.lastUpdate = new Date();
        console.log('All files loaded successfully');
        console.log('Files loaded per mode:', this.getStats());
        
        // Dispatch event for other components to know files are loaded
        this.dispatchFilesLoadedEvent();
    }
    
    // Load files for specific mode
    async loadFilesForMode(mode) {
        try {
            const cacheKey = `audioFilesCache_${mode}`;
            const cached = localStorage.getItem(cacheKey);
            
            // Check cache first
            if (cached) {
                const cacheData = JSON.parse(cached);
                if (Date.now() - cacheData.timestamp < this.cacheDuration) {
                    console.log(`Loading ${mode} files from cache`);
                    this.availableFiles[mode] = cacheData.files;
                    return;
                }
            }
            
            // Fetch from server
            const response = await fetch(`server/get-files.php?mode=${mode}`);
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status} for mode ${mode}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.files && data.files.length > 0) {
                this.availableFiles[mode] = data.files;
                
                // Cache the response
                localStorage.setItem(cacheKey, JSON.stringify({
                    timestamp: Date.now(),
                    files: data.files
                }));
                
                console.log(`Loaded ${data.files.length} files for mode ${mode}`);
            } else {
                console.warn(`No files found for mode ${mode}, using fallback`);
                this.availableFiles[mode] = this.getFallbackFiles(mode);
            }
            
        } catch (error) {
            console.error(`Error loading files for mode ${mode}:`, error);
            this.availableFiles[mode] = this.getFallbackFiles(mode);
        }
    }
    
    // Get fallback files for mode
    getFallbackFiles(mode) {
        const fallbacks = {
            integer: this.generateNumberFiles(0, 1000),
            decimal: this.generateDecimalFiles(),
            date: this.generateDateFiles(),
            dateRange: this.generateDateRangeFiles(),
            time: this.generateTimeFiles(),
            timeRange: this.generateTimeRangeFiles(),
            price: this.generatePriceFiles(),
            year: this.generateYearFiles()
        };
        
        return fallbacks[mode] || [];
    }
    
    // Generate number files with range
    generateNumberFiles(start, end) {
        const files = [];
        for (let i = start; i <= end; i++) {
            files.push({
                number: i,
                filename: `${i}.mp3`,
                path: `file/number/integer/${i}.mp3`,
                isFallback: true
            });
        }
        return files;
    }
    
    // Generate decimal files
    generateDecimalFiles() {
        const decimals = [];
        // Generate single-digit decimals (0-9)
        for (let i = 0; i <= 9; i++) {
            for (let j = 0; j <= 9; j++) {
                decimals.push(`${i}komma${j}`);
            }
        }
        // Generate some double-digit decimals (10-99)
        for (let i = 10; i <= 99; i++) {
            for (let j = 0; j <= 9; j++) {
                if (Math.random() > 0.7) { // Add some variety
                    decimals.push(`${i}komma${j}`);
                }
            }
        }
        
        return decimals.map((dec, index) => ({
            number: index,
            filename: `${dec}.mp3`,
            path: `file/number/decimal/${dec}.mp3`,
            isFallback: true
        }));
    }
    
    // Generate date files
    generateDateFiles() {
        const months = [
            'januar', 'februar', 'märz', 'april', 'mai', 'juni',
            'juli', 'august', 'september', 'oktober', 'november', 'dezember'
        ];
        const files = [];
        
        months.forEach((month, monthIndex) => {
            for (let day = 1; day <= 31; day++) {
                if ((month === 'februar' && day <= 29) ||
                    ((month === 'april' || month === 'juni' || month === 'september' || month === 'november') && day <= 30) ||
                    day <= 31) {
                    
                    const dayStr = day < 10 ? `0${day}` : `${day}`;
                    files.push({
                        number: monthIndex * 100 + day,
                        filename: `${dayStr}${month}.mp3`,
                        path: `file/date/dates/${dayStr}${month}.mp3`,
                        isFallback: true
                    });
                }
            }
        });
        
        return files;
    }
    
    // Generate date range files
    generateDateRangeFiles() {
        const ranges = [
            '01januarbis31dezember',
            '01januarbis15januar',
            '15januarbis31januar',
            '01februarbis28februar',
            '01märzbis31märz',
            '01aprilbis30april',
            '01maibis31mai',
            '01junibis30juni',
            '01julibis31juli',
            '01augustbis31august',
            '01septemberbis30september',
            '01oktoberbis31oktober',
            '01novemberbis30november',
            '01dezemberbis31dezember'
        ];
        
        return ranges.map((range, index) => ({
            number: index,
            filename: `${range}.mp3`,
            path: `file/date/date-ranges/${range}.mp3`,
            isFallback: true
        }));
    }
    
    // Generate time files
    generateTimeFiles() {
        const files = [];
        
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 5) { // 5-minute intervals
                const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
                const minuteStr = minute < 10 ? `0${minute}` : `${minute}`;
                files.push({
                    number: hour * 100 + minute,
                    filename: `${hourStr}-${minuteStr}.mp3`,
                    path: `file/time/times/${hourStr}-${minuteStr}.mp3`,
                    isFallback: true
                });
            }
        }
        
        return files;
    }
    
    // Generate time range files
    generateTimeRangeFiles() {
        const ranges = [
            '08-00bis17-00',
            '09-00bis18-00',
            '10-00bis19-00',
            '06-00bis14-00',
            '14-00bis22-00',
            '00-00bis24-00',
            '08-30bis16-30',
            '09-00bis12-00',
            '13-00bis17-00',
            '10-30bis15-30',
            '07-00bis19-00',
            '11-00bis20-00'
        ];
        
        return ranges.map((range, index) => ({
            number: index,
            filename: `${range}.mp3`,
            path: `file/time/time-ranges/${range}.mp3`,
            isFallback: true
        }));
    }
    
    // Generate price files
    generatePriceFiles() {
        const prices = [];
        // Generate single and double-digit prices (0.50-99.99)
        for (let i = 0; i <= 99; i++) {
            for (let j = 0; j <= 99; j += 5) { // 5-cent intervals
                prices.push(`${i}_${j < 10 ? '0' + j : j}`);
            }
        }
        // Generate some triple and quadruple-digit prices
        for (let i = 100; i <= 9999; i += 50) {
            for (let j = 0; j <= 99; j += 25) {
                if (Math.random() > 0.8) { // Add some variety
                    prices.push(`${i}_${j < 10 ? '0' + j : j}`);
                }
            }
        }
        
        return prices.map((price, index) => ({
            number: index,
            filename: `${price}.mp3`,
            path: `file/preis/${price}.mp3`,
            isFallback: true
        }));
    }
    
    // Generate year files
    generateYearFiles() {
        const years = [];
        for (let year = 1900; year <= 2025; year++) {
            years.push(year);
        }
        
        return years.map((year, index) => ({
            number: index,
            filename: `${year}.mp3`,
            path: `file/jahres/${year}.mp3`,
            isFallback: true
        }));
    }
    
    // Use fallback files for all modes
    useFallbackFiles() {
        const modes = Object.keys(this.availableFiles);
        modes.forEach(mode => {
            this.availableFiles[mode] = this.getFallbackFiles(mode);
        });
        this.isLoaded = true;
        console.log('Using fallback files for all modes');
    }
    
    // Dispatch event when files are loaded
    dispatchFilesLoadedEvent() {
        const event = new CustomEvent('audioFilesLoaded', {
            detail: {
                timestamp: this.lastUpdate,
                stats: this.getStats()
            }
        });
        window.dispatchEvent(event);
    }
    
    // Get files for specific mode
    getFilesForMode(mode, directory) {
        if (!this.availableFiles[mode] || this.availableFiles[mode].length === 0) {
            console.warn(`No files available for mode ${mode}, using fallback`);
            return this.getFallbackFiles(mode);
        }
        return this.availableFiles[mode];
    }
    
    // Get filtered files for mode and difficulty
    getFilteredFilesForMode(mode, difficulty = 'easy') {
        const allFiles = this.getFilesForMode(mode);
        
        // Define difficulty filters
        const difficultyFilters = {
            integer: {
                easy: (file) => {
                    const num = parseInt(file.filename.replace('.mp3', ''));
                    return num >= 0 && num <= 99;
                },
                medium: (file) => {
                    const num = parseInt(file.filename.replace('.mp3', ''));
                    return num >= 0 && num <= 999;
                },
                hard: (file) => {
                    const num = parseInt(file.filename.replace('.mp3', ''));
                    return num >= 10 && num <= 9999;
                }
            },
            decimal: {
                easy: (file) => false, // Not available in easy
                medium: (file) => {
                    const baseNum = parseInt(file.filename.split('komma')[0]);
                    return baseNum >= 0 && baseNum <= 9;
                },
                hard: (file) => {
                    const baseNum = parseInt(file.filename.split('komma')[0]);
                    return baseNum >= 10 && baseNum <= 99;
                }
            },
            date: {
                easy: () => true,
                medium: () => true,
                hard: () => true
            },
            dateRange: {
                easy: () => false,
                medium: () => true,
                hard: () => true
            },
            time: {
                easy: () => true,
                medium: () => true,
                hard: () => true
            },
            timeRange: {
                easy: () => false,
                medium: () => true,
                hard: () => true
            },
            price: {
                easy: (file) => {
                    const baseNum = parseInt(file.filename.split('_')[0]);
                    return baseNum >= 0 && baseNum <= 99;
                },
                medium: (file) => {
                    const baseNum = parseInt(file.filename.split('_')[0]);
                    return baseNum >= 0 && baseNum <= 999;
                },
                hard: (file) => {
                    const baseNum = parseInt(file.filename.split('_')[0]);
                    return baseNum >= 0 && baseNum <= 9999;
                }
            },
            year: {
                easy: () => true,
                medium: () => true,
                hard: () => true
            }
        };
        
        // Get appropriate filter
        const filter = difficultyFilters[mode]?.[difficulty];
        
        // Apply filter if it exists
        if (filter) {
            return allFiles.filter(filter);
        }
        
        // Return all files if no filter
        return allFiles;
    }
    
    // Get a random file for specific mode and difficulty
    getRandomFileForMode(mode, difficulty = 'easy') {
        const filteredFiles = this.getFilteredFilesForMode(mode, difficulty);
        
        if (filteredFiles.length === 0) {
            console.warn(`No files found for mode ${mode} with difficulty ${difficulty}`);
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * filteredFiles.length);
        return filteredFiles[randomIndex];
    }
    
    // Check if a specific file exists
    async checkFileExists(path) {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.warn(`Error checking file ${path}:`, error);
            return false;
        }
    }
    
    // Get statistics about loaded files
    getStats() {
        const stats = {};
        Object.keys(this.availableFiles).forEach(mode => {
            stats[mode] = this.availableFiles[mode].length;
        });
        return stats;
    }
    
    // Force refresh all files from server
    async refresh() {
        console.log('Refreshing file list from server...');
        
        // Clear cache
        Object.keys(this.availableFiles).forEach(mode => {
            localStorage.removeItem(`audioFilesCache_${mode}`);
        });
        
        await this.loadAllFiles();
    }
}

// Create and export global instance
window.fileListManager = new FileListManager();

// Helper function to wait for files to load
window.waitForFiles = function() {
    return new Promise((resolve) => {
        if (window.fileListManager.isLoaded) {
            resolve(window.fileListManager);
        } else {
            const checkInterval = setInterval(() => {
                if (window.fileListManager.isLoaded) {
                    clearInterval(checkInterval);
                    resolve(window.fileListManager);
                }
            }, 100);
        }
    });
};