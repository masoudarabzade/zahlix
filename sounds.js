// Sound management for the application
class SoundManager {
    constructor() {
        this.currentSound = null;
        this.fileListManager = window.fileListManager;
        
        // Web Audio API components
        this.audioContext = null;
        this.audioBuffer = null;
        this.sourceNode = null;
        
        // Playback settings
        this.playbackRate = 1.0;
        this.isPlaying = false;
        this.isLoading = false;
        
        // Mode configurations
        this.modeDirectories = {
            integer: 'file/number/integer',
            decimal: 'file/number/decimal',
            date: 'file/date/dates',
            dateRange: 'file/date/date-ranges',
            time: 'file/time/times',
            timeRange: 'file/time/time-ranges',
            price: 'file/preis',
            year: 'file/jahres'
        };
        
        // Mode-specific answer formatting
        this.answerFormatters = {
            integer: (filename) => this.formatIntegerAnswer(filename),
            decimal: (filename) => this.formatDecimalAnswer(filename),
            date: (filename) => this.formatDateAnswer(filename),
            dateRange: (filename) => this.formatDateRangeAnswer(filename),
            time: (filename) => this.formatTimeAnswer(filename),
            timeRange: (filename) => this.formatTimeRangeAnswer(filename),
            price: (filename) => this.formatPriceAnswer(filename),
            year: (filename) => this.formatYearAnswer(filename)
        };
        
        // Difficulty filters for each mode
        this.difficultyFilters = {
            integer: {
                easy: (filename) => {
                    // Single and double-digit numbers (0-99)
                    const num = parseInt(filename.replace('.mp3', ''));
                    return num >= 0 && num <= 99;
                },
                medium: (filename) => {
                    // Single to triple-digit numbers (0-999)
                    const num = parseInt(filename.replace('.mp3', ''));
                    return num >= 0 && num <= 999;
                },
                hard: (filename) => {
                    // Double to quadruple-digit numbers (10-9999)
                    const num = parseInt(filename.replace('.mp3', ''));
                    return num >= 10 && num <= 9999;
                }
            },
            decimal: {
                easy: (filename) => {
                    // Not available in easy mode
                    return false;
                },
                medium: (filename) => {
                    // Single-digit decimal numbers (0.0-9.9)
                    const baseNum = parseInt(filename.split('komma')[0]);
                    return baseNum >= 0 && baseNum <= 9;
                },
                hard: (filename) => {
                    // Double-digit decimal numbers (10.0-99.9)
                    const baseNum = parseInt(filename.split('komma')[0]);
                    return baseNum >= 10 && baseNum <= 99;
                }
            },
            date: {
                easy: () => true,  // All dates
                medium: () => true, // All dates
                hard: () => true   // All dates
            },
            dateRange: {
                easy: () => false, // Not available in easy
                medium: () => true, // All date ranges
                hard: () => true   // All date ranges
            },
            time: {
                easy: () => true,  // All times
                medium: () => true, // All times
                hard: () => true   // All times
            },
            timeRange: {
                easy: () => false, // Not available in easy
                medium: () => true, // All time ranges
                hard: () => true   // All time ranges
            },
            price: {
                easy: (filename) => {
                    // Single and double-digit prices (0.50-99.99)
                    const baseNum = parseInt(filename.split('_')[0]);
                    return baseNum >= 0 && baseNum <= 99;
                },
                medium: (filename) => {
                    // Single to triple-digit prices (0.50-999.99)
                    const baseNum = parseInt(filename.split('_')[0]);
                    return baseNum >= 0 && baseNum <= 999;
                },
                hard: (filename) => {
                    // Single to quadruple-digit prices (0.50-9999.99)
                    const baseNum = parseInt(filename.split('_')[0]);
                    return baseNum >= 0 && baseNum <= 9999;
                }
            },
            year: {
                easy: () => true,  // All years
                medium: () => true, // All years
                hard: () => true   // All years
            }
        };
        
        // Load saved settings
        this.loadSettings();
        
        // Initialize audio system
        this.initAudio();
        
        console.log('SoundManager initialized with speed:', this.playbackRate + 'x');
    }
    
    // Load saved settings from localStorage
    loadSettings() {
        try {
            const savedSpeed = localStorage.getItem('german_numbers_playback_speed');
            if (savedSpeed) {
                const speed = parseFloat(savedSpeed);
                // Ensure valid range
                if (speed >= 0.25 && speed <= 4.0) {
                    this.playbackRate = speed;
                    console.log('Loaded saved playback speed:', this.playbackRate + 'x');
                }
            }
        } catch (error) {
            console.warn('Could not load settings:', error);
        }
    }
    
    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem('german_numbers_playback_speed', this.playbackRate.toString());
            console.log('Saved playback speed:', this.playbackRate + 'x');
        } catch (error) {
            console.warn('Could not save settings:', error);
        }
    }
    
    // Set playback speed
    setPlaybackSpeed(speed) {
        // Limit speed to valid range
        const minSpeed = 0.25;
        const maxSpeed = 4.0;
        let newSpeed = parseFloat(speed);
        
        if (isNaN(newSpeed)) {
            console.warn('Invalid speed value:', speed);
            return this.playbackRate;
        }
        
        // Clamp to allowed range
        newSpeed = Math.max(minSpeed, Math.min(maxSpeed, newSpeed));
        
        // Round to reasonable value
        const roundedSpeed = Math.round(newSpeed * 100) / 100;
        
        console.log(`Changing speed from ${this.playbackRate}x to ${roundedSpeed}x`);
        
        this.playbackRate = roundedSpeed;
        
        // Apply new speed if currently playing
        if (this.sourceNode && this.isPlaying) {
            this.sourceNode.playbackRate.value = this.playbackRate;
            console.log('Applied new speed to currently playing audio');
        }
        
        // Save to localStorage
        this.saveSettings();
        
        // Dispatch event for UI update
        this.dispatchSpeedChangedEvent();
        
        return this.playbackRate;
    }
    
    // Get current playback speed
    getPlaybackSpeed() {
        return this.playbackRate;
    }
    
    // Dispatch speed changed event
    dispatchSpeedChangedEvent() {
        const event = new CustomEvent('playbackSpeedChanged', {
            detail: {
                speed: this.playbackRate,
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);
    }
    
    // Initialize Web Audio API
    async initAudio() {
        try {
            // Create AudioContext (compatible with all browsers)
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                throw new Error('Web Audio API not supported in this browser');
            }
            
            this.audioContext = new AudioContextClass();
            
            // Resume audio context on user click (browser requirement)
            const resumeAudio = () => {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('AudioContext resumed successfully');
                    });
                }
            };
            
            // Add listener for first user interaction
            document.addEventListener('click', resumeAudio, { once: true });
            document.addEventListener('touchstart', resumeAudio, { once: true });
            
            console.log('Web Audio API initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize audio system:', error);
            this.showError('Audio system could not be initialized. Please update your browser.');
        }
    }
    
    // Get a random sound for specified mode and difficulty
    async getRandomSound(mode, difficulty = 'easy') {
        try {
            // Wait for file list to load if not loaded yet
            if (!this.fileListManager || !this.fileListManager.isLoaded) {
                await window.waitForFiles();
            }
            
            // Get directory for mode
            const directory = this.modeDirectories[mode];
            if (!directory) {
                throw new Error(`Invalid mode: ${mode}`);
            }
            
            // Get files for this mode
            const allFiles = await this.fileListManager.getFilesForMode(mode, directory);
            
            if (!allFiles || allFiles.length === 0) {
                throw new Error(`No files found for mode ${mode} in ${directory}`);
            }
            
            // Filter files based on difficulty
            const difficultyFilter = this.difficultyFilters[mode]?.[difficulty];
            let filteredFiles = allFiles;
            
            if (difficultyFilter) {
                filteredFiles = allFiles.filter(file => difficultyFilter(file.filename));
            }
            
            // If no files match the difficulty, use fallback
            if (filteredFiles.length === 0) {
                console.warn(`No files found for mode ${mode} with difficulty ${difficulty}, using fallback`);
                return this.getFallbackSound(mode, difficulty);
            }
            
            // Select random file from filtered list
            const randomIndex = Math.floor(Math.random() * filteredFiles.length);
            const fileInfo = filteredFiles[randomIndex];
            
            // Format answer based on mode
            const displayNumber = this.answerFormatters[mode](fileInfo.filename);
            
            const sound = {
                ...fileInfo,
                displayNumber: displayNumber,
                mode: mode,
                difficulty: difficulty,
                path: fileInfo.path
            };
            
            console.log(`Selected sound for mode ${mode} (${difficulty}): ${sound.filename} (Answer: ${displayNumber})`);
            return sound;
            
        } catch (error) {
            console.error('Error getting random sound:', error);
            
            // Fallback to default file
            return this.getFallbackSound(mode, difficulty);
        }
    }
    
    // Get fallback sound for mode and difficulty
    getFallbackSound(mode, difficulty = 'easy') {
        const fallbacks = {
            integer: {
                easy: { number: 42, filename: '42.mp3', displayNumber: '42' },
                medium: { number: 123, filename: '123.mp3', displayNumber: '123' },
                hard: { number: 1234, filename: '1234.mp3', displayNumber: '1234' }
            },
            decimal: {
                easy: { number: 1, filename: '1komma5.mp3', displayNumber: '1.5' },
                medium: { number: 5, filename: '5komma5.mp3', displayNumber: '5.5' },
                hard: { number: 25, filename: '25komma5.mp3', displayNumber: '25.5' }
            },
            date: {
                easy: { number: 1, filename: '01januar.mp3', displayNumber: '01januar' },
                medium: { number: 1, filename: '01januar.mp3', displayNumber: '01januar' },
                hard: { number: 1, filename: '01januar.mp3', displayNumber: '01januar' }
            },
            dateRange: {
                medium: { number: 1, filename: '01januarbis31dezember.mp3', displayNumber: '01januarbis31dezember' },
                hard: { number: 1, filename: '01januarbis31dezember.mp3', displayNumber: '01januarbis31dezember' }
            },
            time: {
                easy: { number: 1, filename: '12-00.mp3', displayNumber: '12:00' },
                medium: { number: 1, filename: '12-00.mp3', displayNumber: '12:00' },
                hard: { number: 1, filename: '12-00.mp3', displayNumber: '12:00' }
            },
            timeRange: {
                medium: { number: 1, filename: '09-00bis17-00.mp3', displayNumber: '09:00bis17:00' },
                hard: { number: 1, filename: '09-00bis17-00.mp3', displayNumber: '09:00bis17:00' }
            },
            price: {
                easy: { number: 12, filename: '12_50.mp3', displayNumber: '12.50€' },
                medium: { number: 123, filename: '123_50.mp3', displayNumber: '123.50€' },
                hard: { number: 1234, filename: '1234_50.mp3', displayNumber: '1234.50€' }
            },
            year: {
                easy: { number: 2023, filename: '2023.mp3', displayNumber: '2023' },
                medium: { number: 2023, filename: '2023.mp3', displayNumber: '2023' },
                hard: { number: 2023, filename: '2023.mp3', displayNumber: '2023' }
            }
        };
        
        // Get fallback for specific mode and difficulty, or default to easy
        const modeFallbacks = fallbacks[mode];
        let fallback;
        
        if (modeFallbacks && modeFallbacks[difficulty]) {
            fallback = modeFallbacks[difficulty];
        } else if (modeFallbacks && modeFallbacks.easy) {
            fallback = modeFallbacks.easy;
        } else {
            fallback = { number: 1, filename: '1.mp3', displayNumber: '1' };
        }
        
        return {
            number: fallback.number,
            filename: fallback.filename,
            path: `${this.modeDirectories[mode]}/${fallback.filename}`,
            displayNumber: fallback.displayNumber,
            mode: mode,
            difficulty: difficulty,
            isFallback: true
        };
    }
    
    // Format integer answer
    formatIntegerAnswer(filename) {
        // Remove .mp3 extension and return number
        return filename.replace('.mp3', '');
    }
    
    // Format decimal answer
    formatDecimalAnswer(filename) {
        // Remove .mp3 extension
        let answer = filename.replace('.mp3', '');
        // Replace "komma" with "."
        answer = answer.replace('komma', '.');
        return answer;
    }
    
    // Format date answer
    formatDateAnswer(filename) {
        // Remove .mp3 extension and keep as is
        return filename.replace('.mp3', '').toLowerCase();
    }
    
    // Format date range answer
    formatDateRangeAnswer(filename) {
        // Remove .mp3 extension and keep as is
        return filename.replace('.mp3', '').toLowerCase();
    }
    
    // Format time answer
    formatTimeAnswer(filename) {
        // Remove .mp3 extension
        let answer = filename.replace('.mp3', '');
        // Replace "-" with ":" for consistency
        answer = answer.replace(/-/g, ':');
        return answer;
    }
    
    // Format time range answer
    formatTimeRangeAnswer(filename) {
        // Remove .mp3 extension
        let answer = filename.replace('.mp3', '');
        // Replace "-" with ":" in time parts
        answer = answer.replace(/(\d+)-(\d+)/g, '$1:$2');
        return answer;
    }
    
    // Format price answer
    formatPriceAnswer(filename) {
        // Remove .mp3 extension
        let answer = filename.replace('.mp3', '');
        // Replace "_" with "."
        answer = answer.replace(/_/g, '.');
        return answer;
    }
    
    // Format year answer
    formatYearAnswer(filename) {
        // Remove .mp3 extension
        return filename.replace('.mp3', '');
    }
    
    // Play sound with specified speed
    async playSound(sound, speed = null) {
        try {
            // Stop any current playback
            this.stop();
            
            this.currentSound = sound;
            
            // Apply new speed if specified
            if (speed !== null) {
                this.setPlaybackSpeed(speed);
            }
            
            // Ensure audio context is active
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            console.log(`Loading audio: ${sound.path} at ${this.playbackRate}x`);
            
            // Load audio file
            this.isLoading = true;
            const response = await fetch(sound.path + '?t=' + Date.now());
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            
            // Decode audio data
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.isLoading = false;
            
            // Create source node
            this.sourceNode = this.audioContext.createBufferSource();
            this.sourceNode.buffer = this.audioBuffer;
            
            // Set playback rate
            this.sourceNode.playbackRate.value = this.playbackRate;
            
            // Connect to output
            this.sourceNode.connect(this.audioContext.destination);
            
            // Set up ended event
            this.sourceNode.onended = () => {
                this.isPlaying = false;
                console.log('Playback completed');
                
                // Dispatch event for UI
                this.dispatchPlaybackEndedEvent();
            };
            
            // Start playback
            this.sourceNode.start(0);
            this.isPlaying = true;
            
            console.log(`Playing: ${sound.filename} at ${this.playbackRate}x speed`);
            
            // Dispatch event for UI
            this.dispatchPlaybackStartedEvent();
            
            return true;
            
        } catch (error) {
            console.error('Error playing sound:', error);
            this.isLoading = false;
            this.handlePlaybackError(error, sound);
            return false;
        }
    }
    
    // Play current sound
    async playCurrentSound() {
        if (!this.currentSound) {
            console.warn('No current sound to play');
            return false;
        }
        
        return await this.playSound(this.currentSound, this.playbackRate);
    }
    
    // Stop playback
    stop() {
        if (this.sourceNode) {
            try {
                this.sourceNode.stop();
                this.sourceNode.disconnect();
                this.sourceNode = null;
                this.isPlaying = false;
                console.log('Playback stopped');
            } catch (error) {
                console.warn('Error stopping playback:', error);
            }
        }
    }
    
    // Handle playback errors
    handlePlaybackError(error, sound) {
        let errorMessage = '';
        
        if (error.name === 'NotAllowedError') {
            errorMessage = 'Please click on the page once to activate audio playback';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = `Audio file "${sound.filename}" not found`;
        } else if (error.message.includes('decodeAudioData')) {
            errorMessage = 'Audio file format not supported';
        } else {
            errorMessage = `Error playing audio: ${error.message || 'Unknown error'}`;
        }
        
        this.showError(errorMessage);
    }
    
    // Show error message
    showError(message) {
        // Remove existing errors
        const existingError = document.querySelector('.audio-error');
        if (existingError) existingError.remove();
        
        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'audio-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #f8d7da;
            color: #721c24;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #f5c6cb;
            z-index: 10000;
            max-width: 300px;
            font-family: 'Vazir', sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (errorDiv.parentNode) errorDiv.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // Dispatch playback started event
    dispatchPlaybackStartedEvent() {
        const event = new CustomEvent('audioPlaybackStarted', {
            detail: {
                speed: this.playbackRate,
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);
    }
    
    // Dispatch playback ended event
    dispatchPlaybackEndedEvent() {
        const event = new CustomEvent('audioPlaybackEnded', {
            detail: {
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);
    }
    
    // Get the correct answer for current sound
    getCurrentAnswer() {
        return this.currentSound ? this.currentSound.displayNumber : '';
    }
}