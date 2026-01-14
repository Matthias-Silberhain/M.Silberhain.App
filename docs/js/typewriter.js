/**
 * Typewriter Effect für Matthias Silberhain Namen
 */

class Typewriter {
    constructor(elementId, options = {}) {
        this.element = document.getElementById(elementId);
        this.text = options.text || 'MATTHIAS SILBERHAIN';
        this.speed = options.speed || 100; // ms per character
        this.deleteSpeed = options.deleteSpeed || 50;
        this.delay = options.delay || 500; // initial delay
        this.loop = options.loop || false;
        this.cursor = options.cursor !== false;
        this.cursorChar = options.cursorChar || '|';
        this.isDeleting = false;
        this.currentIndex = 0;
        this.isActive = false;
        
        if (!this.element) return;
        
        this.init();
    }
    
    init() {
        // Prepare the element
        this.element.textContent = '';
        this.element.setAttribute('aria-label', this.text);
        this.element.classList.add('typewriter-element');
        
        // Add cursor if enabled
        if (this.cursor) {
            this.cursorElement = document.createElement('span');
            this.cursorElement.className = 'typewriter-cursor';
            this.cursorElement.textContent = this.cursorChar;
            this.cursorElement.setAttribute('aria-hidden', 'true');
            this.element.appendChild(this.cursorElement);
        }
        
        // Start typing after delay
        setTimeout(() => {
            this.isActive = true;
            this.type();
        }, this.delay);
    }
    
    type() {
        if (!this.isActive) return;
        
        const fullText = this.text;
        let typeSpeed = this.speed;
        
        // If deleting
        if (this.isDeleting) {
            this.currentIndex--;
            typeSpeed = this.deleteSpeed;
        } else {
            this.currentIndex++;
        }
        
        // Update text content
        const displayText = fullText.substring(0, this.currentIndex);
        const textNode = this.element.querySelector('.typewriter-text') || document.createTextNode('');
        
        if (textNode.nodeType === 3) {
            this.element.insertBefore(document.createTextNode(displayText), this.cursorElement);
            // Remove previous text nodes if any
            let childNodes = this.element.childNodes;
            for (let i = 0; i < childNodes.length - 2; i++) {
                if (childNodes[i].nodeType === 3) {
                    this.element.removeChild(childNodes[i]);
                }
            }
        } else {
            this.element.insertBefore(document.createTextNode(displayText), this.cursorElement);
        }
        
        // Cursor animation
        if (this.cursorElement) {
            this.cursorElement.style.animation = 'none';
            setTimeout(() => {
                this.cursorElement.style.animation = '';
            }, 10);
        }
        
        // Check if typing is complete
        if (!this.isDeleting && this.currentIndex === fullText.length) {
            if (this.loop) {
                setTimeout(() => {
                    this.isDeleting = true;
                    typeSpeed = 1000; // pause at end
                }, 1500);
            } else {
                this.isActive = false;
                // Dispatch completion event
                this.dispatchComplete();
                return;
            }
        } else if (this.isDeleting && this.currentIndex === 0) {
            this.isDeleting = false;
            if (this.loop) {
                typeSpeed = 500; // pause before restarting
            }
        }
        
        // Continue typing
        setTimeout(() => this.type(), typeSpeed);
    }
    
    dispatchComplete() {
        const event = new CustomEvent('typewriterComplete', {
            detail: {
                text: this.text,
                timestamp: new Date().toISOString()
            }
        });
        this.element.dispatchEvent(event);
    }
    
    // Public method to reset the typewriter
    reset() {
        this.currentIndex = 0;
        this.isDeleting = false;
        this.isActive = false;
        
        // Clear element
        this.element.textContent = '';
        
        // Re-add cursor if needed
        if (this.cursor) {
            this.cursorElement = document.createElement('span');
            this.cursorElement.className = 'typewriter-cursor';
            this.cursorElement.textContent = this.cursorChar;
            this.cursorElement.setAttribute('aria-hidden', 'true');
            this.element.appendChild(this.cursorElement);
        }
        
        // Restart after delay
        setTimeout(() => {
            this.isActive = true;
            this.type();
        }, this.delay);
    }
    
    // Public method to change text
    setText(newText) {
        this.text = newText;
        this.reset();
    }
}

// Initialize typewriter for preloader
document.addEventListener('DOMContentLoaded', () => {
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        window.typewriter = new Typewriter('typewriter-text', {
            text: 'MATTHIAS SILBERHAIN',
            speed: 100,
            deleteSpeed: 50,
            delay: 500,
            loop: false,
            cursor: true
        });
        
        // Add completion event listener
        typewriterElement.addEventListener('typewriterComplete', () => {
            console.log('Typewriter animation completed');
        });
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Typewriter;
}