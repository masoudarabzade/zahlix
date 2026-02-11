// Main application script for Zahlix - German Numbers Practice
class NumberPracticeApp {
    constructor() {
        // Initialize managers
        this.soundManager = new SoundManager();
        this.fileListManager = window.fileListManager;
        
        // App settings
        this.currentLanguage = 'de'; // Default: German
        this.isDarkMode = false;
        this.currentScreen = 'startScreen';
        
        // Difficulty settings
        this.currentDifficulty = 'easy'; // Default difficulty
        this.difficultyLevels = ['easy', 'medium', 'hard'];
        this.difficultyConfigs = {
            easy: {
                name: 'Easy',
                icon: 'fas fa-seedling',
                colorClass: 'easy',
                description: 'Perfect for beginners'
            },
            medium: {
                name: 'Medium',
                icon: 'fas fa-mountain',
                colorClass: 'medium',
                description: 'For intermediate learners'
            },
            hard: {
                name: 'Hard',
                icon: 'fas fa-fire',
                colorClass: 'hard',
                description: 'For advanced learners'
            }
        };
        
        // Mode configurations with difficulty ranges
        this.modeConfigs = {
            integer: {
                icon: 'fas fa-sort-numeric-up',
                sample: '123',
                difficultyRanges: {
                    easy: { minDigits: 1, maxDigits: 2, minValue: 0, maxValue: 99 },
                    medium: { minDigits: 1, maxDigits: 3, minValue: 0, maxValue: 999 },
                    hard: { minDigits: 2, maxDigits: 4, minValue: 10, maxValue: 9999 }
                },
                description: {
                    fa: 'اعداد صحیح یک یا دو رقمی (0-99)',
                    en: 'Single and double-digit numbers (0-99)',
                    de: 'Einstellige und zweistellige Zahlen (0-99)'
                },
                availableInEasy: true
            },
            decimal: {
                icon: 'fas fa-divide',
                sample: '12.5',
                difficultyRanges: {
                    easy: { minDigits: 1, maxDigits: 1, minValue: 0, maxValue: 9 },
                    medium: { minDigits: 1, maxDigits: 1, minValue: 0, maxValue: 9 },
                    hard: { minDigits: 2, maxDigits: 2, minValue: 10, maxValue: 99 }
                },
                description: {
                    fa: 'اعداد اعشاری',
                    en: 'Decimal numbers',
                    de: 'Dezimalzahlen'
                },
                availableInEasy: false
            },
            date: {
                icon: 'far fa-calendar-alt',
                sample: '01oktober',
                difficultyRanges: {
                    easy: { all: true },
                    medium: { all: true },
                    hard: { all: true }
                },
                description: {
                    fa: 'تمامی تاریخ‌های آلمانی',
                    en: 'All German dates',
                    de: 'Alle deutschen Datumsangaben'
                },
                availableInEasy: true
            },
            dateRange: {
                icon: 'fas fa-calendar-week',
                sample: '01oktoberbis15dezember',
                difficultyRanges: {
                    easy: { all: true },
                    medium: { all: true },
                    hard: { all: true }
                },
                description: {
                    fa: 'بازه‌های تاریخی',
                    en: 'Date ranges',
                    de: 'Datumsbereiche'
                },
                availableInEasy: false
            },
            time: {
                icon: 'far fa-clock',
                sample: '14:30',
                difficultyRanges: {
                    easy: { all: true },
                    medium: { all: true },
                    hard: { all: true }
                },
                description: {
                    fa: 'تمامی زمان‌های آلمانی',
                    en: 'All German time expressions',
                    de: 'Alle deutschen Uhrzeiten'
                },
                availableInEasy: true
            },
            timeRange: {
                icon: 'fas fa-history',
                sample: '10:00bis14:30',
                difficultyRanges: {
                    easy: { all: true },
                    medium: { all: true },
                    hard: { all: true }
                },
                description: {
                    fa: 'بازه‌های زمانی',
                    en: 'Time ranges',
                    de: 'Zeitspannen'
                },
                availableInEasy: false
            },
            price: {
                icon: 'fas fa-euro-sign',
                sample: '12.50€',
                difficultyRanges: {
                    easy: { minDigits: 1, maxDigits: 2, minValue: 0, maxValue: 99 },
                    medium: { minDigits: 1, maxDigits: 3, minValue: 0, maxValue: 999 },
                    hard: { minDigits: 1, maxDigits: 4, minValue: 0, maxValue: 9999 }
                },
                description: {
                    fa: 'قیمت‌های یک یا دو رقمی (0.50-99.99)',
                    en: 'Single and double-digit prices (0.50-99.99)',
                    de: 'Einstellige und zweistellige Preise (0.50-99.99)'
                },
                availableInEasy: true
            },
            year: {
                icon: 'fas fa-calendar',
                sample: '2023',
                difficultyRanges: {
                    easy: { all: true },
                    medium: { all: true },
                    hard: { all: true }
                },
                description: {
                    fa: 'تمامی سال‌ها',
                    en: 'All years',
                    de: 'Alle Jahreszahlen'
                },
                availableInEasy: true
            }
        };
        
        // Practice state
        this.currentQuestion = 1;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.currentSound = null;
        this.hasAnswered = false;
        this.isLoading = false;
        this.selectedModes = ['integer', 'date', 'time', 'price', 'year'];
        this.currentMode = 'integer';
        
        // Playback speed
        this.currentSpeed = 1.0;
        
        // GitHub repository info
        this.githubRepo = 'zhalix/zahlix'; // تغییر دهید به مخزن خودتان
        this.githubUrl = `https://github.com/${this.githubRepo}`;
        this.githubApiUrl = `https://api.github.com/repos/${this.githubRepo}`;
        
        // Load saved settings
        this.loadUserSettings();
        
        // Initialize the app
        this.initializeElements();
        this.initializeEventListeners();
        this.setupPlaybackSpeedListeners();
        this.loadLanguage();
        this.applyTheme();
        
        // Set default language in dropdown
        setTimeout(() => {
            this.setLanguageDropdown();
            this.updateSpeedDisplay();
            this.updateDifficultyPreview();
            this.initializeFooter();
        }, 100);
        
        // Listen for audio files loaded event
        window.addEventListener('audioFilesLoaded', (e) => {
            console.log(`Audio files loaded: ${e.detail.count} files available`);
        });
        
        // Initialize speed buttons
        this.initializeSpeedButtons();
    }
    
    // Load user settings from localStorage
    loadUserSettings() {
        try {
            // Load theme
            const savedTheme = localStorage.getItem('Zahlix_theme');
            if (savedTheme === 'dark') {
                this.isDarkMode = true;
            }
            
            // Load language
            const savedLanguage = localStorage.getItem('Zahlix_language');
            if (savedLanguage && ['fa', 'en', 'de'].includes(savedLanguage)) {
                this.currentLanguage = savedLanguage;
                document.body.setAttribute('data-lang', savedLanguage);
            }
            
            // Load difficulty
            const savedDifficulty = localStorage.getItem('Zahlix_difficulty');
            if (savedDifficulty && this.difficultyLevels.includes(savedDifficulty)) {
                this.currentDifficulty = savedDifficulty;
            }
            
            // Load selected modes
            const savedModes = localStorage.getItem('Zahlix_selected_modes');
            if (savedModes) {
                this.selectedModes = JSON.parse(savedModes);
            }
            
            console.log('User settings loaded from localStorage');
            
        } catch (error) {
            console.warn('Could not load user settings:', error);
        }
    }
    
    // Save user settings to localStorage
    saveUserSettings() {
        try {
            localStorage.setItem('Zahlix_theme', this.isDarkMode ? 'dark' : 'light');
            localStorage.setItem('Zahlix_language', this.currentLanguage);
            localStorage.setItem('Zahlix_difficulty', this.currentDifficulty);
            localStorage.setItem('Zahlix_selected_modes', JSON.stringify(this.selectedModes));
            console.log('User settings saved to localStorage');
            
        } catch (error) {
            console.warn('Could not save user settings:', error);
        }
    }
    
    // Initialize DOM elements
    initializeElements() {
        // Screens
        this.startScreen = document.getElementById('startScreen');
        this.difficultySelectionScreen = document.getElementById('difficultySelectionScreen');
        this.modeSelectionScreen = document.getElementById('modeSelectionScreen');
        this.practiceScreen = document.getElementById('practiceScreen');
        
        // Buttons
        this.startBtn = document.getElementById('startBtn');
        this.backToStartFromDifficultyBtn = document.getElementById('backToStartFromDifficulty');
        this.backToDifficultySelectionBtn = document.getElementById('backToDifficultySelection');
        this.backToModeSelectionBtn = document.getElementById('backToModeSelection');
        this.continueToModeSelectionBtn = document.getElementById('continueToModeSelectionBtn');
        this.startPracticeBtn = document.getElementById('startPracticeBtn');
        this.playAudioBtn = document.getElementById('playAudioBtn');
        this.submitAnswerBtn = document.getElementById('submitAnswerBtn');
        this.nextQuestionBtn = document.getElementById('nextQuestionBtn');
        this.themeToggleBtn = document.getElementById('themeToggle');
        this.themeToggleDesktopBtn = document.getElementById('themeToggleDesktop');
        
        // Mobile back buttons
        this.mobileBackToStartFromDifficultyBtn = document.getElementById('mobileBackToStartFromDifficulty');
        this.mobileBackToDifficultySelectionBtn = document.getElementById('mobileBackToDifficultySelection');
        this.mobileBackToModeSelectionBtn = document.getElementById('mobileBackToModeSelection');
        
        // Language dropdown
        this.languageDropdown = document.getElementById('languageDropdown');
        this.languageDropdownDesktop = document.getElementById('languageDropdownDesktop');
        
        // Difficulty elements
        this.difficultyLevelsElements = document.querySelectorAll('.difficulty-level');
        this.currentDifficultyBadge = document.getElementById('currentDifficultyBadge');
        this.currentDifficultyText = document.getElementById('currentDifficultyText');
        this.currentDifficultyStat = document.getElementById('currentDifficultyStat');
        this.currentDifficultyStatText = document.getElementById('currentDifficultyStatText');
        this.currentDifficultyIndicator = document.getElementById('currentDifficultyIndicator');
        this.progressFill = document.getElementById('progressFill');
        this.currentProgressText = document.getElementById('currentProgressText');
        
        // Preview elements
        this.integersPreviewText = document.getElementById('integersPreviewText');
        this.decimalsPreviewText = document.getElementById('decimalsPreviewText');
        this.datesPreviewText = document.getElementById('datesPreviewText');
        this.dateRangePreviewText = document.getElementById('dateRangePreviewText');
        this.timePreviewText = document.getElementById('timePreviewText');
        this.timeRangePreviewText = document.getElementById('timeRangePreviewText');
        this.pricePreviewText = document.getElementById('pricePreviewText');
        this.yearPreviewText = document.getElementById('yearPreviewText');
        
        // Practice elements
        this.answerInput = document.getElementById('answerInput');
        this.correctAnswerText = document.getElementById('correctAnswerText');
        this.correctAnswerContainer = document.getElementById('correctAnswerContainer');
        this.feedback = document.getElementById('feedback');
        this.correctCount = document.getElementById('correctCount');
        this.incorrectCount = document.getElementById('incorrectCount');
        this.currentQuestionElement = document.getElementById('currentQuestion');
        this.speedDisplay = document.getElementById('currentSpeedText');
        this.currentModeDisplay = document.getElementById('currentModeDisplay');
        this.sampleAnswerText = document.getElementById('sampleAnswerText');
        this.sampleAnswerContainer = document.getElementById('sampleAnswerContainer');
        
        // Mode options
        this.modeOptions = document.querySelectorAll('.mode-option');
        
        // Mode description elements
        this.modeDescriptionElements = {
            integer: document.getElementById('integerDescription'),
            decimal: document.getElementById('decimalDescription'),
            date: document.getElementById('dateDescription'),
            dateRange: document.getElementById('dateRangeDescription'),
            time: document.getElementById('timeDescription'),
            timeRange: document.getElementById('timeRangeDescription'),
            price: document.getElementById('priceDescription'),
            year: document.getElementById('yearDescription')
        };
        
        // Footer elements
        this.githubStarBtn = document.getElementById('githubStarBtn');
        this.starCount = document.getElementById('starCount');
        this.currentYearElement = document.getElementById('currentYear');
        this.githubLink = document.querySelector('.github-link');
    }
    
    // Initialize event listeners
    initializeEventListeners() {
        // Start button
        this.startBtn.addEventListener('click', () => this.showScreen('difficultySelectionScreen'));
        
        // Back buttons (desktop)
        this.backToStartFromDifficultyBtn?.addEventListener('click', () => this.showScreen('startScreen'));
        this.backToDifficultySelectionBtn?.addEventListener('click', () => this.showScreen('difficultySelectionScreen'));
        this.backToModeSelectionBtn?.addEventListener('click', () => this.showScreen('modeSelectionScreen'));
        
        // Mobile back buttons
        this.mobileBackToStartFromDifficultyBtn?.addEventListener('click', () => this.showScreen('startScreen'));
        this.mobileBackToDifficultySelectionBtn?.addEventListener('click', () => this.showScreen('difficultySelectionScreen'));
        this.mobileBackToModeSelectionBtn?.addEventListener('click', () => {
            this.showScreen('modeSelectionScreen');
            this.resetPracticeSession();
        });
        
        // Continue to mode selection
        this.continueToModeSelectionBtn?.addEventListener('click', () => {
            this.showScreen('modeSelectionScreen');
            this.updateModeSelectionForDifficulty();
        });
        
        // Start practice button
        this.startPracticeBtn?.addEventListener('click', () => this.startPractice());
        
        // Language dropdowns
        if (this.languageDropdown) {
            this.languageDropdown.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
        
        if (this.languageDropdownDesktop) {
            this.languageDropdownDesktop.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
        
        // Theme toggle buttons
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => {
                this.toggleTheme();
                this.saveUserSettings();
            });
        }
        
        if (this.themeToggleDesktopBtn) {
            this.themeToggleDesktopBtn.addEventListener('click', () => {
                this.toggleTheme();
                this.saveUserSettings();
            });
        }
        
        // Difficulty selection
        this.difficultyLevelsElements.forEach(level => {
            level.addEventListener('click', (e) => {
                const difficulty = level.dataset.difficulty;
                this.selectDifficulty(difficulty);
            });
        });
        
        // Mode selection
        this.modeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const mode = option.dataset.mode;
                const config = this.modeConfigs[mode];
                
                // Check if mode is available for current difficulty
                if (!config.availableInEasy && this.currentDifficulty === 'easy') {
                    return; // Don't allow selection
                }
                
                // Don't allow selection if disabled
                if (option.classList.contains('disabled')) {
                    return;
                }
                
                option.classList.toggle('active');
                
                // Update selected modes array
                if (option.classList.contains('active')) {
                    if (!this.selectedModes.includes(mode)) {
                        this.selectedModes.push(mode);
                    }
                } else {
                    const index = this.selectedModes.indexOf(mode);
                    if (index > -1) {
                        this.selectedModes.splice(index, 1);
                    }
                }
                
                // Save selection
                this.saveUserSettings();
                
                // Update start practice button state
                this.updateStartPracticeButton();
            });
        });
        
        // Practice controls
        this.playAudioBtn?.addEventListener('click', () => this.playCurrentSound());
        this.submitAnswerBtn?.addEventListener('click', () => this.checkAnswer());
        this.nextQuestionBtn?.addEventListener('click', () => this.nextQuestion());
        this.answerInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
        
        // GitHub link
        if (this.githubLink) {
            this.githubLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(this.githubUrl, '_blank');
            });
        }
        
        // Set input direction based on language
        this.answerInput?.addEventListener('focus', () => {
            this.updateInputDirection();
        });
    }
    
    // Initialize footer
    initializeFooter() {
        // Set current year
        if (this.currentYearElement) {
            this.currentYearElement.textContent = new Date().getFullYear();
        }
        
        // Initialize GitHub star button
        this.initializeGitHubStar();
    }
    
    // Initialize GitHub star button with real data
    initializeGitHubStar() {
        // Set repository URL - با آدرس مخزن شما
        this.githubRepo = 'masoudarabzade/zahlix';
        this.githubUrl = `https://github.com/${this.githubRepo}`;
        this.githubApiUrl = `https://api.github.com/repos/${this.githubRepo}`;
        
        // Update button to open GitHub
        if (this.githubStarBtn) {
            // Remove existing listeners به طور کامل
            const newButton = this.githubStarBtn.cloneNode(true);
            this.githubStarBtn.parentNode.replaceChild(newButton, this.githubStarBtn);
            this.githubStarBtn = newButton;
            
            // Add click listener جدید
            this.githubStarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleGitHubStar();
            });
            
            // تنظیم استایل اولیه
            this.githubStarBtn.style.cursor = 'pointer';
        }
        
        // Fetch initial star count
        this.loadStarCount();
        
        // Update star count every hour
        setInterval(() => {
            this.fetchGitHubStarCount();
        }, 60 * 60 * 1000); // 1 hour
    }
    
    // Handle GitHub star button click
    handleGitHubStar() {
        console.log('GitHub star button clicked'); // برای دیباگ
        
        // Check if user has already starred
        const hasStarred = localStorage.getItem('Zahlix_has_starred');
        
        if (hasStarred) {
            // Show message that user already starred
            this.showNotification(
                this.currentLanguage === 'fa' 
                    ? 'شما قبلاً به این پروژه ستاره داده‌اید! 🙏' 
                    : this.currentLanguage === 'en' 
                        ? 'You have already starred this project! 🙏' 
                        : 'Sie haben dieses Projekt bereits mit einem Stern versehen! 🙏',
                'info'
            );
            
            // Still open GitHub repo
            setTimeout(() => {
                window.open(this.githubUrl, '_blank', 'noopener,noreferrer');
            }, 100);
            return;
        }
        
        // Animate button
        this.githubStarBtn.style.transform = 'scale(1.1)';
        this.githubStarBtn.style.transition = 'transform 0.2s ease';
        setTimeout(() => {
            this.githubStarBtn.style.transform = 'scale(1)';
        }, 200);
        
        // Mark as starred in localStorage
        localStorage.setItem('Zahlix_has_starred', 'true');
        
        // Add starred class to button
        this.githubStarBtn.classList.add('starred');
        
        // Open GitHub repo in new tab for starring
        setTimeout(() => {
            window.open(this.githubUrl, '_blank', 'noopener,noreferrer');
        }, 100);
        
        // Update star count from GitHub API
        this.fetchGitHubStarCount();
        
        // Show thank you message
        this.showNotification(
            this.currentLanguage === 'fa' 
                ? 'سپاسگزاریم! لطفاً در صفحه گیت‌هاب روی دکمه 🌟 کلیک کنید' 
                : this.currentLanguage === 'en' 
                    ? 'Thank you! Please click the 🌟 button on GitHub page' 
                    : 'Vielen Dank! Bitte klicken Sie auf den 🌟 Button auf GitHub',
            'success'
        );
    }
    
    // Fetch real star count from GitHub API
    async fetchGitHubStarCount() {
        try {
            console.log('Fetching GitHub star count...'); // برای دیباگ
            
            const response = await fetch(this.githubApiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`GitHub API responded with ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.stargazers_count !== undefined) {
                const starCount = data.stargazers_count;
                this.starCount.textContent = starCount;
                
                // Save to localStorage as cache
                localStorage.setItem('Zahlix_star_count', starCount.toString());
                localStorage.setItem('Zahlix_star_count_updated', Date.now().toString());
                
                console.log(`GitHub star count updated: ${starCount}`); // برای دیباگ
            }
        } catch (error) {
            console.warn('Could not fetch GitHub star count:', error);
            
            // Try to get from localStorage cache
            const cachedCount = localStorage.getItem('Zahlix_star_count');
            if (cachedCount) {
                this.starCount.textContent = cachedCount;
            } else {
                // Default fallback
                this.starCount.textContent = '0';
            }
        }
    }
    
    
    // Load star count from GitHub API or cache
    loadStarCount() {
        // Check if we have cached star count less than 1 hour old
        const lastUpdated = localStorage.getItem('Zahlix_star_count_updated');
        const oneHour = 60 * 60 * 1000;
        
        if (lastUpdated && (Date.now() - parseInt(lastUpdated)) < oneHour) {
            // Use cached count
            const cachedCount = localStorage.getItem('Zahlix_star_count');
            if (cachedCount) {
                this.starCount.textContent = cachedCount;
                console.log(`Using cached star count: ${cachedCount}`); // برای دیباگ
                return;
            }
        }
        
        // Fetch fresh count from GitHub
        this.fetchGitHubStarCount();
    }
    
    // Show notification with custom message
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        
        // Set colors based on type
        let bgColor;
        switch (type) {
            case 'success':
                bgColor = this.isDarkMode ? 'var(--dark-success)' : 'var(--light-success)';
                break;
            case 'error':
                bgColor = this.isDarkMode ? 'var(--dark-danger)' : 'var(--light-danger)';
                break;
            default:
                bgColor = this.isDarkMode ? 'var(--dark-info)' : 'var(--light-info)';
        }
        
        // Add icon based on type
        let iconClass;
        switch (type) {
            case 'success':
                iconClass = 'fa-check-circle';
                break;
            case 'error':
                iconClass = 'fa-exclamation-circle';
                break;
            default:
                iconClass = 'fa-info-circle';
        }
        
        notification.innerHTML = `<i class="fas ${iconClass}" style="margin-right: 8px;"></i>${message}`;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 9999;
            animation: slideUp 0.3s ease, fadeOut 0.3s ease 4s forwards;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-family: 'Vazir', 'Inter', sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            direction: ${this.currentLanguage === 'fa' ? 'rtl' : 'ltr'};
            max-width: 90%;
            word-break: break-word;
        `;
        
        // Adjust for RTL
        if (this.currentLanguage === 'fa') {
            const icon = notification.querySelector('i');
            if (icon) {
                icon.style.marginRight = '0';
                icon.style.marginLeft = '8px';
            }
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 4.3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4300);
    }
    
    // Setup playback speed listeners
    setupPlaybackSpeedListeners() {
        // Listen for speed changes from sound manager
        window.addEventListener('playbackSpeedChanged', (e) => {
            this.currentSpeed = e.detail.speed;
            this.updateSpeedDisplay();
        });
        
        // Listen for audio playback events
        window.addEventListener('audioPlaybackStarted', (e) => {
            this.updateSpeedDisplay();
        });
    }
    
    // Initialize speed buttons
    initializeSpeedButtons() {
        // Add event listeners to speed buttons
        document.querySelectorAll('.speed-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const speed = parseFloat(e.target.dataset.speed);
                
                // Update sound manager
                const actualSpeed = this.soundManager.setPlaybackSpeed(speed);
                this.currentSpeed = actualSpeed;
                
                // Update display
                this.updateSpeedDisplay();
                
                // Show notification
                this.showSpeedChangedNotification();
                
                // If a sound is loaded but not answered yet, replay with new speed
                if (this.currentSound && !this.hasAnswered) {
                    await this.playCurrentSound();
                }
            });
        });
    }
    
    // Update speed display
    updateSpeedDisplay() {
        const speed = this.soundManager.getPlaybackSpeed();
        this.currentSpeed = speed;
        
        // Update speed text display
        if (this.speedDisplay) {
            this.speedDisplay.textContent = `${speed}x`;
        }
        
        // Update speed buttons
        this.updateSpeedButtons();
    }
    
    // Update speed buttons style
    updateSpeedButtons() {
        const speedButtons = document.querySelectorAll('.speed-btn');
        const currentSpeed = this.soundManager.getPlaybackSpeed();
        
        speedButtons.forEach(button => {
            const btnSpeed = parseFloat(button.dataset.speed);
            
            if (Math.abs(btnSpeed - currentSpeed) < 0.01) {
                // Active button
                button.classList.add('active');
                button.style.backgroundColor = this.isDarkMode ? 'var(--dark-primary)' : 'var(--light-primary)';
                button.style.color = 'white';
                button.style.borderColor = this.isDarkMode ? 'var(--dark-primary)' : 'var(--light-primary)';
            } else {
                // Inactive button
                button.classList.remove('active');
                button.style.backgroundColor = this.isDarkMode ? 'var(--dark-card)' : 'var(--light-bg)';
                button.style.color = this.isDarkMode ? 'var(--dark-text)' : 'var(--light-text)';
                button.style.borderColor = this.isDarkMode ? 'var(--dark-border)' : 'var(--light-border)';
            }
        });
    }
    
    // Show speed changed notification
    showSpeedChangedNotification() {
        // Remove existing notification
        const existingNotification = document.querySelector('.speed-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'speed-notification';
        
        // Set message based on language
        const messages = {
            fa: `سرعت پخش به ${this.currentSpeed}x تغییر کرد`,
            en: `Playback speed changed to ${this.currentSpeed}x`,
            de: `Wiedergabegeschwindigkeit auf ${this.currentSpeed}x geändert`
        };
        
        notification.textContent = messages[this.currentLanguage] || `Speed changed to ${this.currentSpeed}x`;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${this.isDarkMode ? 'var(--dark-primary)' : 'var(--light-primary)'};
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideUp 0.3s ease, fadeOut 0.3s ease 2s forwards;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-family: 'Vazir', 'Inter', sans-serif;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 2.3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 2300);
    }
    
    // Select difficulty level
    selectDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        
        // Update UI
        this.updateDifficultySelectionUI();
        this.updateDifficultyPreview();
        
        // Save settings
        this.saveUserSettings();
        
        // Update mode selection if we're on that screen
        if (this.currentScreen === 'modeSelectionScreen') {
            this.updateModeSelectionForDifficulty();
        }
    }
    
    // Update difficulty selection UI
    updateDifficultySelectionUI() {
        this.difficultyLevelsElements.forEach(level => {
            if (level.dataset.difficulty === this.currentDifficulty) {
                level.classList.add('active');
            } else {
                level.classList.remove('active');
            }
        });
    }
    
    // Update difficulty preview
    updateDifficultyPreview() {
        switch (this.currentDifficulty) {
            case 'easy':
                if (this.integersPreviewText) this.integersPreviewText.textContent = '0-99';
                if (this.decimalsPreviewText) this.decimalsPreviewText.textContent = 'Not available';
                if (this.datesPreviewText) this.datesPreviewText.textContent = 'All dates';
                if (this.dateRangePreviewText) this.dateRangePreviewText.textContent = 'Not available';
                if (this.timePreviewText) this.timePreviewText.textContent = 'All times';
                if (this.timeRangePreviewText) this.timeRangePreviewText.textContent = 'Not available';
                if (this.pricePreviewText) this.pricePreviewText.textContent = '0.50-99.99€';
                if (this.yearPreviewText) this.yearPreviewText.textContent = 'All years';
                break;
            case 'medium':
                if (this.integersPreviewText) this.integersPreviewText.textContent = '0-999';
                if (this.decimalsPreviewText) this.decimalsPreviewText.textContent = '0.0-9.9';
                if (this.datesPreviewText) this.datesPreviewText.textContent = 'All dates';
                if (this.dateRangePreviewText) this.dateRangePreviewText.textContent = 'All ranges';
                if (this.timePreviewText) this.timePreviewText.textContent = 'All times';
                if (this.timeRangePreviewText) this.timeRangePreviewText.textContent = 'All ranges';
                if (this.pricePreviewText) this.pricePreviewText.textContent = '0.50-999.99€';
                if (this.yearPreviewText) this.yearPreviewText.textContent = 'All years';
                break;
            case 'hard':
                if (this.integersPreviewText) this.integersPreviewText.textContent = '10-9999';
                if (this.decimalsPreviewText) this.decimalsPreviewText.textContent = '10.0-99.9';
                if (this.datesPreviewText) this.datesPreviewText.textContent = 'All dates';
                if (this.dateRangePreviewText) this.dateRangePreviewText.textContent = 'All ranges';
                if (this.timePreviewText) this.timePreviewText.textContent = 'All times';
                if (this.timeRangePreviewText) this.timeRangePreviewText.textContent = 'All ranges';
                if (this.pricePreviewText) this.pricePreviewText.textContent = '0.50-9999.99€';
                if (this.yearPreviewText) this.yearPreviewText.textContent = 'All years';
                break;
        }
    }
    
    // Update mode selection for current difficulty
    updateModeSelectionForDifficulty() {
        // Update current difficulty badge
        this.updateCurrentDifficultyBadge();
        
        // Update mode descriptions
        this.updateModeDescriptions();
        
        // Update mode availability
        this.updateModeAvailability();
        
        // Reset selected modes based on difficulty
        this.resetSelectedModesForDifficulty();
        
        // Update mode selection UI
        this.updateModeSelectionUI();
    }
    
    // Update current difficulty badge
    updateCurrentDifficultyBadge() {
        if (!this.currentDifficultyBadge || !this.currentDifficultyText) return;
        
        const config = this.difficultyConfigs[this.currentDifficulty];
        
        // Update text
        this.currentDifficultyText.textContent = config.name;
        
        // Update classes
        this.currentDifficultyBadge.className = 'current-difficulty-badge';
        this.currentDifficultyBadge.classList.add(this.currentDifficulty);
        
        // Update icon
        const icon = this.currentDifficultyBadge.querySelector('i');
        if (icon) {
            icon.className = config.icon;
        }
    }
    
    // Update mode descriptions
    updateModeDescriptions() {
        Object.keys(this.modeDescriptionElements).forEach(mode => {
            const element = this.modeDescriptionElements[mode];
            if (element) {
                const config = this.modeConfigs[mode];
                const description = config.description[this.currentLanguage] || config.description['en'];
                element.textContent = description;
            }
        });
    }
    
    // Update mode availability
    updateModeAvailability() {
        this.modeOptions.forEach(option => {
            const mode = option.dataset.mode;
            const config = this.modeConfigs[mode];
            
            // Check if mode is available for current difficulty
            if (!config.availableInEasy && this.currentDifficulty === 'easy') {
                option.classList.add('disabled');
                option.style.cursor = 'not-allowed';
                option.style.opacity = '0.6';
                
                // Also remove active class if it was selected
                option.classList.remove('active');
            } else {
                option.classList.remove('disabled');
                option.style.cursor = 'pointer';
                option.style.opacity = '1';
            }
        });
    }
    
    // Reset selected modes for current difficulty
    resetSelectedModesForDifficulty() {
        // Get available modes for current difficulty
        const availableModes = Object.keys(this.modeConfigs).filter(mode => {
            const config = this.modeConfigs[mode];
            return config.availableInEasy || this.currentDifficulty !== 'easy';
        });
        
        // Default modes for each difficulty
        const defaultModes = {
            easy: ['integer', 'date', 'time', 'price', 'year'],
            medium: ['integer', 'decimal', 'date', 'dateRange', 'time', 'timeRange', 'price', 'year'],
            hard: ['integer', 'decimal', 'date', 'dateRange', 'time', 'timeRange', 'price', 'year']
        };
        
        // Set selected modes based on difficulty
        this.selectedModes = defaultModes[this.currentDifficulty] || ['integer'];
        
        // Save settings
        this.saveUserSettings();
    }
    
    // Update mode selection UI
    updateModeSelectionUI() {
        this.modeOptions.forEach(option => {
            const mode = option.dataset.mode;
            
            if (this.selectedModes.includes(mode)) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        this.updateStartPracticeButton();
    }
    
    // Update start practice button state
    updateStartPracticeButton() {
        if (!this.startPracticeBtn) return;
        
        if (this.selectedModes.length === 0) {
            this.startPracticeBtn.disabled = true;
            this.startPracticeBtn.style.opacity = '0.6';
            this.startPracticeBtn.style.cursor = 'not-allowed';
        } else {
            this.startPracticeBtn.disabled = false;
            this.startPracticeBtn.style.opacity = '1';
            this.startPracticeBtn.style.cursor = 'pointer';
        }
    }
    
    // Update input direction based on language
    updateInputDirection() {
        if (!this.answerInput) return;
        
        if (this.currentLanguage === 'fa') {
            this.answerInput.style.direction = 'rtl';
            this.answerInput.style.textAlign = 'right';
        } else {
            this.answerInput.style.direction = 'ltr';
            this.answerInput.style.textAlign = 'left';
        }
    }
    
    // Set language dropdown to current language
    setLanguageDropdown() {
        if (this.languageDropdown) {
            this.languageDropdown.value = this.currentLanguage;
        }
        if (this.languageDropdownDesktop) {
            this.languageDropdownDesktop.value = this.currentLanguage;
        }
    }
    
    // Show a specific screen
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show the requested screen
        const screenElement = document.getElementById(screenId);
        if (screenElement) {
            screenElement.classList.add('active');
        }
        this.currentScreen = screenId;
        
        // Perform screen-specific setup
        switch (screenId) {
            case 'difficultySelectionScreen':
                this.updateDifficultySelectionUI();
                this.updateDifficultyPreview();
                break;
                
            case 'modeSelectionScreen':
                this.updateModeSelectionForDifficulty();
                break;
                
            case 'practiceScreen':
                this.resetPracticeState();
                this.loadNewQuestion();
                this.updateInputDirection();
                this.updateSpeedDisplay();
                this.updatePracticeDifficultyDisplay();
                
                // Focus on answer input
                setTimeout(() => {
                    if (this.answerInput) this.answerInput.focus();
                }, 300);
                break;
        }
    }
    
    // Update practice difficulty display
    updatePracticeDifficultyDisplay() {
        const config = this.difficultyConfigs[this.currentDifficulty];
        
        // Update difficulty stat
        if (this.currentDifficultyStat && this.currentDifficultyStatText) {
            this.currentDifficultyStat.className = 'stat difficulty-stat';
            this.currentDifficultyStat.classList.add(this.currentDifficulty);
            this.currentDifficultyStatText.textContent = config.name;
            
            // Update icon
            const icon = this.currentDifficultyStat.querySelector('i');
            if (icon) {
                icon.className = config.icon;
            }
        }
        
        // Update difficulty indicator
        if (this.currentDifficultyIndicator) {
            const indicator = this.currentDifficultyIndicator;
            indicator.className = 'difficulty-indicator';
            indicator.classList.add(this.currentDifficulty);
            
            // Update text
            const textSpan = indicator.querySelector('span');
            if (textSpan) {
                textSpan.textContent = config.name;
            }
            
            // Update icon
            const icon = indicator.querySelector('i');
            if (icon) {
                icon.className = config.icon;
            }
        }
        
        // Update progress bar
        if (this.progressFill) {
            this.progressFill.className = 'progress-fill';
            this.progressFill.classList.add(this.currentDifficulty);
            
            // Set width based on difficulty
            const width = {
                easy: '33%',
                medium: '66%',
                hard: '100%'
            }[this.currentDifficulty] || '33%';
            
            this.progressFill.style.width = width;
        }
        
        // Update progress text
        if (this.currentProgressText) {
            this.currentProgressText.textContent = config.name;
        }
    }
    
    // Change application language
    changeLanguage(lang) {
        this.currentLanguage = lang;
        document.body.setAttribute('data-lang', lang);
        
        // Update dropdowns
        this.setLanguageDropdown();
        
        // Update all text elements with translations
        this.updateTextContent();
        
        // Update input direction
        this.updateInputDirection();
        
        // Update speed display
        this.updateSpeedDisplay();
        
        // Update difficulty preview
        this.updateDifficultyPreview();
        
        // Update mode descriptions
        this.updateModeDescriptions();
        
        // Save settings
        this.saveUserSettings();
    }
    
    // Load language translations
    loadLanguage() {
        // Set initial language from body attribute or saved setting
        const lang = this.currentLanguage || document.body.getAttribute('data-lang') || 'de';
        this.changeLanguage(lang);
    }
    
    // Update all text content based on current language
    updateTextContent() {
        const langData = translations[this.currentLanguage];
        if (!langData) return;
        
        // Find all elements with data-key attribute and update their text
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (langData[key]) {
                // For input placeholders
                if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.setAttribute('placeholder', langData[key]);
                } 
                // For other elements
                else if (element.children.length === 0 || element.querySelector('i')) {
                    // If element has only text or contains an icon, update text
                    const icon = element.querySelector('i');
                    if (icon) {
                        // Keep the icon, update the text next to it
                        const textSpan = Array.from(element.childNodes).find(node => 
                            node.nodeType === Node.TEXT_NODE && node.textContent.trim()
                        );
                        if (textSpan) {
                            textSpan.textContent = ` ${langData[key]}`;
                        } else {
                            // Create a text node after the icon
                            const textNode = document.createTextNode(` ${langData[key]}`);
                            element.appendChild(textNode);
                        }
                    } else {
                        element.textContent = langData[key];
                    }
                } else {
                    // For elements with complex content, just update the text
                    element.textContent = langData[key];
                }
            }
        });
        
        // Update title with Zahlix branding
        const titles = {
            fa: 'Zahlix | تمرین اعداد آلمانی',
            en: 'Zahlix | German Numbers Practice',
            de: 'Zahlix | Deutsche Zahlen üben'
        };
        
        document.title = titles[this.currentLanguage] || 'Zahlix | German Numbers Practice';
    }
    
    // Toggle between dark and light mode
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        
        // Update speed buttons style
        this.updateSpeedButtons();
        this.saveUserSettings();
    }
    
    // Apply current theme to the page
    applyTheme() {
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Update theme icons
        const updateThemeIcon = (btn) => {
            if (!btn) return;
            const moonIcon = btn.querySelector('.fa-moon');
            const sunIcon = btn.querySelector('.fa-sun');
            
            if (moonIcon && sunIcon) {
                if (this.isDarkMode) {
                    moonIcon.style.opacity = '0';
                    sunIcon.style.opacity = '1';
                } else {
                    moonIcon.style.opacity = '1';
                    sunIcon.style.opacity = '0';
                }
            }
        };
        
        updateThemeIcon(this.themeToggleBtn);
        updateThemeIcon(this.themeToggleDesktopBtn);
    }
    
    // Start a new practice session
    startPractice() {
        if (this.selectedModes.length === 0) return;
        this.showScreen('practiceScreen');
    }
    
    // Reset practice session
    resetPracticeSession() {
        this.currentQuestion = 1;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.hasAnswered = false;
        this.currentSound = null;
        this.isLoading = false;
        
        // Reset UI
        this.updateScoreDisplay();
        this.updateQuestionCounter();
    }
    
    // Reset practice state for a new session
    resetPracticeState() {
        this.currentQuestion = 1;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.hasAnswered = false;
        
        this.updateScoreDisplay();
        this.updateQuestionCounter();
        
        // Reset UI elements
        if (this.answerInput) {
            this.answerInput.value = '';
            this.answerInput.classList.remove('correct', 'incorrect');
        }
        
        if (this.correctAnswerContainer) {
            this.correctAnswerContainer.classList.remove('show');
        }
        
        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.classList.remove('show');
        }
        
        if (this.sampleAnswerContainer) {
            this.sampleAnswerContainer.style.display = 'flex';
        }
        
        // Update feedback message
        const langData = translations[this.currentLanguage];
        if (this.feedback && this.feedback.querySelector('span')) {
            this.feedback.querySelector('span').textContent = langData.inputPrompt;
            this.feedback.style.backgroundColor = '';
            this.feedback.style.borderColor = '';
            this.feedback.querySelector('i').className = 'fas fa-info-circle';
        }
        
        // Update input direction
        this.updateInputDirection();
        
        // Focus on answer input
        setTimeout(() => {
            if (this.answerInput) this.answerInput.focus();
        }, 100);
    }
    
    // Load a new question
    async loadNewQuestion() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        // Reset answer state
        this.hasAnswered = false;
        
        if (this.answerInput) {
            this.answerInput.value = '';
            this.answerInput.classList.remove('correct', 'incorrect');
        }
        
        if (this.correctAnswerContainer) {
            this.correctAnswerContainer.classList.remove('show');
        }
        
        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.classList.remove('show');
        }
        
        if (this.sampleAnswerContainer) {
            this.sampleAnswerContainer.style.display = 'flex';
        }
        
        // Show loading state on play button
        if (this.playAudioBtn) {
            const playIcon = this.playAudioBtn.querySelector('i');
            if (playIcon) {
                playIcon.className = 'fas fa-spinner fa-spin';
            }
        }
        
        try {
            // Update question counter
            this.updateQuestionCounter();
            
            // Select random mode from selected modes
            const randomModeIndex = Math.floor(Math.random() * this.selectedModes.length);
            this.currentMode = this.selectedModes[randomModeIndex];
            
            // Update mode display
            this.updateModeDisplay();
            
            // Get a new sound based on current mode and difficulty
            this.currentSound = await this.soundManager.getRandomSound(
                this.currentMode, 
                this.currentDifficulty
            );
            
            if (!this.currentSound) {
                throw new Error('Failed to get sound file');
            }
            
            // Update feedback message
            const langData = translations[this.currentLanguage];
            if (this.feedback && this.feedback.querySelector('span')) {
                this.feedback.querySelector('span').textContent = langData.inputPrompt;
                this.feedback.style.backgroundColor = '';
                this.feedback.style.borderColor = '';
                this.feedback.querySelector('i').className = 'fas fa-info-circle';
            }
            
            // Update sample answer
            this.updateSampleAnswer();
            
            // Play the sound after a short delay
            setTimeout(async () => {
                await this.playCurrentSound();
                this.isLoading = false;
                
                // Reset play button icon
                if (this.playAudioBtn) {
                    const playIcon = this.playAudioBtn.querySelector('i');
                    if (playIcon) {
                        playIcon.className = 'fas fa-play';
                    }
                }
                
                // Focus on answer input
                if (this.answerInput) this.answerInput.focus();
            }, 300);
            
        } catch (error) {
            console.error('Error loading new question:', error);
            this.isLoading = false;
            
            // Reset play button icon
            if (this.playAudioBtn) {
                const playIcon = this.playAudioBtn.querySelector('i');
                if (playIcon) {
                    playIcon.className = 'fas fa-play';
                }
            }
            
            // Show error to user
            const errorMsg = this.currentLanguage === 'fa' 
                ? 'خطا در بارگذاری سوال. لطفا دوباره تلاش کنید.' 
                : this.currentLanguage === 'en' 
                    ? 'Error loading question. Please try again.' 
                    : 'Fehler beim Laden der Frage. Bitte versuchen Sie es erneut.';
            
            alert(errorMsg);
        }
    }
    
    // Update mode display
    updateModeDisplay() {
        const config = this.modeConfigs[this.currentMode];
        if (config && this.currentModeDisplay) {
            const iconElement = this.currentModeDisplay.querySelector('i');
            const textElement = this.currentModeDisplay.querySelector('span');
            
            if (iconElement) {
                iconElement.className = config.icon;
            }
            
            if (textElement) {
                const langData = translations[this.currentLanguage];
                const modeKey = this.currentMode + 'Mode';
                textElement.textContent = langData[modeKey] || this.currentMode;
            }
        }
    }
    
    // Update sample answer display
    updateSampleAnswer() {
        const config = this.modeConfigs[this.currentMode];
        if (config && this.sampleAnswerText) {
            this.sampleAnswerText.textContent = config.sample;
        }
    }
    
    // Play the current sound
    async playCurrentSound() {
        if (!this.currentSound) {
            console.warn('No current sound to play');
            return false;
        }
        
        // Update play button text
        if (this.playAudioBtn) {
            const playIcon = this.playAudioBtn.querySelector('i');
            if (playIcon) {
                playIcon.className = 'fas fa-spinner fa-spin';
            }
        }
        
        try {
            // Play with current speed
            const success = await this.soundManager.playSound(this.currentSound, this.currentSpeed);
            
            // Reset play button icon
            if (this.playAudioBtn) {
                const playIcon = this.playAudioBtn.querySelector('i');
                if (playIcon) {
                    playIcon.className = 'fas fa-play';
                }
            }
            
            return success;
            
        } catch (error) {
            console.error('Error in playCurrentSound:', error);
            
            // Reset play button icon
            if (this.playAudioBtn) {
                const playIcon = this.playAudioBtn.querySelector('i');
                if (playIcon) {
                    playIcon.className = 'fas fa-play';
                }
            }
            
            return false;
        }
    }
    
    // Check the user's answer
    checkAnswer() {
        if (this.hasAnswered || !this.currentSound) return;
        
        const userAnswer = this.answerInput.value.trim().toLowerCase();
        const correctAnswer = this.soundManager.getCurrentAnswer().toLowerCase();
        
        this.hasAnswered = true;
        
        // Hide sample answer
        if (this.sampleAnswerContainer) {
            this.sampleAnswerContainer.style.display = 'none';
        }
        
        // Check if answer is correct based on mode
        const isCorrect = this.validateAnswer(userAnswer, correctAnswer, this.currentMode);
        
        if (isCorrect) {
            // Correct answer
            this.answerInput.classList.add('correct');
            this.correctAnswers++;
            
            // Update feedback
            if (this.feedback) {
                this.feedback.querySelector('i').className = 'fas fa-check-circle';
                
                const message = this.currentLanguage === 'fa' 
                    ? 'آفرین! جواب صحیح است.' 
                    : this.currentLanguage === 'en' 
                        ? 'Great! Correct answer.' 
                        : 'Gut gemacht! Richtige Antwort.';
                
                this.feedback.querySelector('span').textContent = message;
                this.feedback.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
                this.feedback.style.borderColor = 'rgba(46, 204, 113, 0.2)';
            }
            
        } else {
            // Incorrect answer
            this.answerInput.classList.add('incorrect');
            this.incorrectAnswers++;
            
            // Update feedback
            if (this.feedback) {
                this.feedback.querySelector('i').className = 'fas fa-times-circle';
                
                const message = this.currentLanguage === 'fa' 
                    ? 'جواب اشتباه است.' 
                    : this.currentLanguage === 'en' 
                        ? 'Incorrect answer.' 
                        : 'Falsche Antwort.';
                
                this.feedback.querySelector('span').textContent = message;
                this.feedback.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                this.feedback.style.borderColor = 'rgba(231, 76, 60, 0.2)';
            }
            
            // Show correct answer
            if (this.correctAnswerText) {
                this.correctAnswerText.textContent = correctAnswer;
            }
            if (this.correctAnswerContainer) {
                this.correctAnswerContainer.classList.add('show');
            }
        }
        
        // Update score display
        this.updateScoreDisplay();
        
        // Show next question button
        if (this.nextQuestionBtn) {
            this.nextQuestionBtn.classList.add('show');
            
            // Focus on next button for keyboard navigation
            setTimeout(() => {
                this.nextQuestionBtn.focus();
            }, 100);
        }
    }
    
    // Validate answer based on mode-specific rules
    validateAnswer(userAnswer, correctAnswer, mode) {
        // Normalize both answers for comparison
        userAnswer = userAnswer.toLowerCase().trim();
        correctAnswer = correctAnswer.toLowerCase().trim();
        
        // Case-insensitive exact match
        if (userAnswer === correctAnswer) {
            return true;
        }
        
        // Mode-specific validation rules
        switch (mode) {
            case 'decimal':
                // Allow . or , as decimal separator
                return this.validateDecimalAnswer(userAnswer, correctAnswer);
                
            case 'date':
                // Allow optional leading zeros
                return this.validateDateAnswer(userAnswer, correctAnswer);
                
            case 'dateRange':
                // Allow various separators and optional leading zeros
                return this.validateDateRangeAnswer(userAnswer, correctAnswer);
                
            case 'time':
                // Allow various time formats
                return this.validateTimeAnswer(userAnswer, correctAnswer);
                
            case 'timeRange':
                // Allow various time range formats
                return this.validateTimeRangeAnswer(userAnswer, correctAnswer);
                
            case 'price':
                // Allow . or , as decimal separator and optional € symbol
                return this.validatePriceAnswer(userAnswer, correctAnswer);
                
            case 'year':
            case 'integer':
            default:
                // Exact match for integers and years
                return userAnswer === correctAnswer;
        }
    }
    
    // Validate decimal answers
    validateDecimalAnswer(userAnswer, correctAnswer) {
        // Replace komma with . or , in correct answer for comparison
        const normalizedCorrect = correctAnswer.replace('komma', '.');
        const normalizedCorrectAlt = correctAnswer.replace('komma', ',');
        
        // Check if user answer matches any valid format
        return userAnswer === normalizedCorrect || 
               userAnswer === normalizedCorrectAlt;
    }
    
    // Validate date answers
    validateDateAnswer(userAnswer, correctAnswer) {
        // Allow optional leading zeros for day
        const patterns = [
            correctAnswer,
            correctAnswer.replace(/^0(\d)/, '$1') // Remove leading zero
        ];
        
        return patterns.includes(userAnswer);
    }
    
    // Validate date range answers
    validateDateRangeAnswer(userAnswer, correctAnswer) {
        // Split into start and end dates
        const parts = correctAnswer.split('bis');
        if (parts.length !== 2) return false;
        
        const [startDate, endDate] = parts;
        
        // Generate all valid combinations
        const validCombinations = this.generateDateRangeCombinations(startDate, endDate);
        
        return validCombinations.includes(userAnswer);
    }
    
    // Generate all valid date range combinations
    generateDateRangeCombinations(startDate, endDate) {
        const combinations = [];
        
        // Start date variations (with/without leading zero)
        const startVariations = [
            startDate,
            startDate.replace(/^0(\d)/, '$1')
        ];
        
        // End date variations (with/without leading zero)
        const endVariations = [
            endDate,
            endDate.replace(/^0(\d)/, '$1')
        ];
        
        // Separator variations
        const separators = ['bis', '-', ''];
        
        // Generate all combinations
        for (const start of startVariations) {
            for (const end of endVariations) {
                for (const separator of separators) {
                    combinations.push(start + separator + end);
                }
            }
        }
        
        return [...new Set(combinations)]; // Remove duplicates
    }
    
    // Validate time answers
    validateTimeAnswer(userAnswer, correctAnswer) {
        // Generate all valid time formats
        const validFormats = this.generateTimeFormats(correctAnswer);
        
        return validFormats.includes(userAnswer);
    }
    
    // Generate all valid time formats
    generateTimeFormats(correctTime) {
        const formats = [correctTime];
        
        // If time contains separator
        if (correctTime.includes('-')) {
            const [hours, minutes] = correctTime.split('-');
            
            // Format variations
            const hourVariations = [
                hours,
                hours.replace(/^0(\d)/, '$1') // Remove leading zero
            ];
            
            const minuteVariations = [
                minutes,
                minutes.replace(/^0(\d)/, '$1') // Remove leading zero
            ];
            
            // Generate combinations
            for (const h of hourVariations) {
                for (const m of minuteVariations) {
                    // Skip if minutes are "00" and user might omit them
                    if (m === '0' || m === '00') {
                        formats.push(h); // Just hours
                    }
                    
                    // Different separators
                    formats.push(`${h}-${m}`);
                    formats.push(`${h}:${m}`);
                    formats.push(`${h}${m}`); // No separator
                }
            }
        }
        
        return [...new Set(formats)]; // Remove duplicates
    }
    
    // Validate time range answers
    validateTimeRangeAnswer(userAnswer, correctAnswer) {
        // Split into start and end times
        const parts = correctAnswer.split('bis');
        if (parts.length !== 2) return false;
        
        const [startTime, endTime] = parts;
        
        // Generate all valid time formats for start and end
        const startFormats = this.generateTimeFormats(startTime);
        const endFormats = this.generateTimeFormats(endTime);
        
        // Separator variations
        const separators = ['bis', '-', ''];
        
        // Generate all combinations
        for (const start of startFormats) {
            for (const end of endFormats) {
                for (const separator of separators) {
                    if (`${start}${separator}${end}` === userAnswer) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    // Validate price answers - simplest version
    validatePriceAnswer(userAnswer, correctAnswer) {
        // Remove all non-numeric characters except . and ,
        const userClean = userAnswer.replace(/[^0-9.,]/g, '');
        const correctClean = correctAnswer.replace(/[^0-9.,]/g, '');
        
        // Replace _ with . in correct answer
        const correctFormatted = correctClean.replace(/_/g, '.');
        
        // Check if numbers match (allow both . and , as decimal separator)
        const userNumeric = userClean.replace(',', '.');
        const correctNumeric = correctFormatted.replace(',', '.');
        
        return userNumeric === correctNumeric;
    }
    
    // Move to the next question
    nextQuestion() {
        this.currentQuestion++;
        this.loadNewQuestion();
    }
    
    // Update score display
    updateScoreDisplay() {
        if (this.correctCount) {
            this.correctCount.textContent = this.correctAnswers;
        }
        if (this.incorrectCount) {
            this.incorrectCount.textContent = this.incorrectAnswers;
        }
    }
    
    // Update question counter
    updateQuestionCounter() {
        if (this.currentQuestionElement) {
            this.currentQuestionElement.textContent = this.currentQuestion;
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create and initialize the app
    window.app = new NumberPracticeApp();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('Zahlix_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        window.app.isDarkMode = true;
        
        // Update theme icons
        const updateThemeIcon = (btn) => {
            if (!btn) return;
            const moonIcon = btn.querySelector('.fa-moon');
            const sunIcon = btn.querySelector('.fa-sun');
            if (moonIcon && sunIcon) {
                moonIcon.style.opacity = '0';
                sunIcon.style.opacity = '1';
            }
        };
        
        updateThemeIcon(document.getElementById('themeToggle'));
        updateThemeIcon(document.getElementById('themeToggleDesktop'));
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!window.app) return;
    
    // Space: Play current sound (when in practice screen)
    if (e.code === 'Space' && window.app.currentScreen === 'practiceScreen') {
        e.preventDefault();
        window.app.playCurrentSound();
    }
    
    // Enter: Submit answer (already handled)
    // Escape: Back to previous screen
    if (e.code === 'Escape') {
        if (window.app.currentScreen === 'practiceScreen') {
            window.app.showScreen('modeSelectionScreen');
        } else if (window.app.currentScreen === 'modeSelectionScreen') {
            window.app.showScreen('difficultySelectionScreen');
        } else if (window.app.currentScreen === 'difficultySelectionScreen') {
            window.app.showScreen('startScreen');
        }
    }
    
    // Number keys 1-6: Change playback speed (when in practice screen)
    if (window.app.currentScreen === 'practiceScreen') {
        const speedMap = {
            'Digit1': 0.5,
            'Digit2': 0.7,
            'Digit3': 1.0,
            'Digit4': 1.2,
            'Digit5': 1.5,
            'Digit6': 2.0
        };
        
        if (speedMap[e.code]) {
            const newSpeed = speedMap[e.code];
            window.app.soundManager.setPlaybackSpeed(newSpeed);
            window.app.currentSpeed = newSpeed;
            window.app.updateSpeedDisplay();
            window.app.showSpeedChangedNotification();
        }
    }
});