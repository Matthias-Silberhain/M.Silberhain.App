/**
 * Dark Mode Toggle für Matthias Silberhain Website
 * Umschaltet zwischen Schwarz- und Dunkelgrau-Thema
 */

class DarkModeToggle {
    constructor() {
        this.toggleButton = document.getElementById('dark-mode-toggle');
        this.body = document.body;
        this.theme = localStorage.getItem('theme') || 'black';
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        if (!this.toggleButton) return;
        
        // Setze initiales Theme
        this.setTheme(this.theme);
        
        // Event Listener
        this.toggleButton.addEventListener('click', () => this.toggleTheme());
        this.toggleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Beobachte System-Preference
        this.watchSystemPreference();
        
        // Event für andere Komponenten
        document.addEventListener('themeChanged', (e) => {
            if (e.detail && e.detail.theme) {
                this.setTheme(e.detail.theme);
            }
        });
    }
    
    setTheme(theme) {
        if (this.isTransitioning || theme === this.theme) return;
        
        this.isTransitioning = true;
        this.theme = theme;
        
        // Setze data-theme Attribut am html element
        document.documentElement.setAttribute('data-theme', theme === 'black' ? '' : 'dark-gray');
        
        // Setze Klasse am body
        if (theme === 'dark-gray') {
            this.body.classList.add('light-mode');
        } else {
            this.body.classList.remove('light-mode');
        }
        
        // Speichere in localStorage
        localStorage.setItem('theme', theme);
        
        // Update ARIA Label
        this.updateAriaLabel();
        
        // Dispatch Event
        this.dispatchThemeChange();
        
        // Add transition class
        this.body.classList.add('theme-transition');
        
        // Remove transition class after animation
        setTimeout(() => {
            this.body.classList.remove('theme-transition');
            this.isTransitioning = false;
        }, 300);
    }
    
    toggleTheme() {
        const newTheme = this.theme === 'black' ? 'dark-gray' : 'black';
        this.setTheme(newTheme);
    }
    
    updateAriaLabel() {
        if (!this.toggleButton) return;
        
        const label = this.theme === 'black' 
            ? 'Zum Dunkelgrau-Modus wechseln' 
            : 'Zum Schwarz-Modus wechseln';
        
        this.toggleButton.setAttribute('aria-label', label);
    }
    
    watchSystemPreference() {
        // Nur wenn der Benutzer keine explizite Wahl getroffen hat
        if (!localStorage.getItem('theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleChange = (e) => {
                // Standardmäßig schwarz für dark mode
                this.setTheme('black');
            };
            
            // Initial setzen
            if (prefersDark.matches) {
                this.setTheme('black');
            }
            
            // Listener für Änderungen
            prefersDark.addEventListener('change', handleChange);
        }
    }
    
    dispatchThemeChange() {
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: this.theme,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    }
    
    // Öffentliche Methode zum Abrufen des aktuellen Themes
    getCurrentTheme() {
        return this.theme;
    }
    
    // Öffentliche Methode zum Setzen des Themes von außen
    setThemeExternal(theme) {
        if (theme === 'black' || theme === 'dark-gray') {
            this.setTheme(theme);
            return true;
        }
        return false;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.darkModeToggle = new DarkModeToggle();
});

// Export für Modul-Systeme
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeToggle;
}