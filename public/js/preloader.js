/**
 * Preloader für Matthias Silberhain Website
 * Lädt Logo und Typewriter-Effekt
 */

class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.typewriterText = document.getElementById('typewriter-text');
        this.progressText = document.querySelector('.progress-text');
        this.progressBar = document.querySelector('.progress-bar');
        this.mainContent = document.getElementById('main-content');
        
        if (!this.preloader) return;
        
        this.name = 'MATTHIAS SILBERHAIN';
        this.currentChar = 0;
        this.progress = 0;
        this.isLoaded = false;
        
        this.init();
    }
    
    init() {
        // Event Listener für Page Load
        window.addEventListener('load', () => this.onPageLoad());
        
        // Fallback: Wenn Seite nach 4 Sekunden nicht geladen ist
        setTimeout(() => {
            if (!this.isLoaded) {
                this.completeLoading();
            }
        }, 4000);
        
        // Starte Typewriter-Effekt
        this.startTypewriter();
        
        // Simuliere Progress für bessere UX
        this.simulateProgress();
    }
    
    startTypewriter() {
        if (!this.typewriterText) return;
        
        const type = () => {
            if (this.currentChar < this.name.length) {
                this.typewriterText.textContent += this.name.charAt(this.currentChar);
                this.currentChar++;
                
                // Zufällige Geschwindigkeit für natürlichen Effekt
                const speed = Math.random() * 100 + 50;
                setTimeout(type, speed);
            }
        };
        
        // Verzögerung bevor Typewriter startet
        setTimeout(() => type(), 500);
    }
    
    simulateProgress() {
        const interval = setInterval(() => {
            if (this.progress < 90) {
                this.progress += Math.random() * 20;
                this.updateProgress(this.progress);
            } else {
                clearInterval(interval);
            }
        }, 200);
    }
    
    updateProgress(percent) {
        if (this.progressText) {
            this.progressText.textContent = `${Math.min(Math.round(percent), 100)}%`;
        }
    }
    
    onPageLoad() {
        this.progress = 100;
        this.updateProgress(this.progress);
        setTimeout(() => this.completeLoading(), 500);
    }
    
    completeLoading() {
        if (this.isLoaded) return;
        
        this.isLoaded = true;
        
        // Typewriter abschließen
        if (this.typewriterText) {
            this.typewriterText.textContent = this.name;
            this.typewriterText.style.borderRight = 'none';
        }
        
        // Progress auf 100% setzen
        this.updateProgress(100);
        
        // Verzögerung für visuellen Effekt
        setTimeout(() => {
            // Preloader ausblenden
            this.preloader.classList.add('loaded');
            
            // Main Content einblenden
            if (this.mainContent) {
                this.mainContent.setAttribute('aria-hidden', 'false');
                this.mainContent.style.visibility = 'visible';
                this.mainContent.style.opacity = '1';
            }
            
            // Event auslösen
            document.dispatchEvent(new Event('preloaderComplete'));
            
            // Preloader nach Animation entfernen
            setTimeout(() => {
                this.preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

// Initialisiere Preloader wenn DOM bereit
document.addEventListener('DOMContentLoaded', () => {
    new Preloader();
});