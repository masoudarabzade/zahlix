class AudioStatusManager {
    constructor() {
        this.statusIndicator = document.getElementById('audioStatusIndicator');
        this.statusText = document.getElementById('audioStatusText');
        
        if (!this.statusIndicator || !this.statusText) {
            this.createStatusElements();
        }
        
        this.currentLanguage = document.body.getAttribute('data-lang') || 'de';
        
        // Listen to audio events
        this.setupEventListeners();
    }
    
    createStatusElements() {
        const statusContainer = document.createElement('div');
        statusContainer.className = 'audio-status';
        statusContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            z-index: 100;
            background: rgba(255,255,255,0.9);
            padding: 8px 12px;
            border-radius: 8px;
            backdrop-filter: blur(5px);
        `;
        
        const indicator = document.createElement('div');
        indicator.className = 'audio-status-indicator stopped';
        indicator.id = 'audioStatusIndicator';
        
        const text = document.createElement('span');
        text.id = 'audioStatusText';
        text.textContent = this.getTranslation('ready');
        
        statusContainer.appendChild(indicator);
        statusContainer.appendChild(text);
        
        document.body.appendChild(statusContainer);
        
        this.statusIndicator = indicator;
        this.statusText = text;
    }
    
    setupEventListeners() {
        window.addEventListener('audioPlaybackStarted', (e) => {
            this.setStatus('playing', this.getTranslation('playing'));
        });
        
        window.addEventListener('audioPlaybackEnded', () => {
            this.setStatus('stopped', this.getTranslation('ready'));
        });
        
        // Listen for errors
        window.addEventListener('error', (e) => {
            if (e.message && e.message.includes('audio')) {
                this.setStatus('error', this.getTranslation('error'));
            }
        });
    }
    
    setStatus(status, message) {
        if (this.statusIndicator) {
            this.statusIndicator.className = `audio-status-indicator ${status}`;
        }
        
        if (this.statusText) {
            this.statusText.textContent = message;
        }
    }
    
    getTranslation(key) {
        const translations = {
            fa: {
                ready: 'آماده',
                playing: 'در حال پخش',
                loading: 'در حال بارگذاری',
                error: 'خطا در پخش'
            },
            en: {
                ready: 'Ready',
                playing: 'Playing',
                loading: 'Loading',
                error: 'Playback error'
            },
            de: {
                ready: 'Bereit',
                playing: 'Wiedergabe',
                loading: 'Lädt',
                error: 'Wiedergabefehler'
            }
        };
        
        return translations[this.currentLanguage][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLanguage = lang;
        // Update current status text
        if (this.statusText) {
            const currentStatus = this.statusIndicator.className.replace('audio-status-indicator ', '');
            const statusMap = {
                'stopped': 'ready',
                'playing': 'playing',
                'error': 'error'
            };
            
            if (statusMap[currentStatus]) {
                this.statusText.textContent = this.getTranslation(statusMap[currentStatus]);
            }
        }
    }
}

// Initialize audio status manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.audioStatusManager = new AudioStatusManager();
});