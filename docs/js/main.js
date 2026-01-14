/**
 * Main JavaScript für Matthias Silberhain Website
 */

class MainApp {
    constructor() {
        this.currentPage = window.location.pathname;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.loadFeaturedBooks();
        this.loadSocialLinks();
        this.setupMobileMenu();
        this.setupAccessibility();
    }
    
    setupEventListeners() {
        // Preloader Complete Event
        document.addEventListener('preloaderComplete', () => {
            console.log('Preloader complete, main app initialized');
        });
        
        // Theme Change Event
        document.addEventListener('themeChanged', (e) => {
            console.log('Theme changed to:', e.detail.theme);
        });
        
        // Window Load Event
        window.addEventListener('load', () => {
            this.handlePageLoad();
        });
        
        // Resize Event (debounced)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // Scroll Event (throttled)
        let scrollTimer;
        window.addEventListener('scroll', () => {
            if (!scrollTimer) {
                scrollTimer = setTimeout(() => {
                    this.handleScroll();
                    scrollTimer = null;
                }, 100);
            }
        });
    }
    
    setupNavigation() {
        // Aktive Seite markieren
        const currentPath = this.currentPage.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPath || 
                (currentPath === 'index.html' && linkHref === 'index.html')) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
        
        // Smooth Scroll für interne Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL ohne Page Reload
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    setupMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!menuToggle || !navMenu) return;
        
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Toggle body scroll lock
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.focus();
            }
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    async loadFeaturedBooks() {
        const booksContainer = document.getElementById('featured-books');
        if (!booksContainer) return;
        
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            // Für jetzt verwenden wir Mock-Daten
            
            const mockBooks = [
                {
                    id: 1,
                    title: "Der Schatten des Nordens",
                    author: "Matthias Silberhain",
                    description: "Ein epischer Fantasy-Roman über die Abenteuer eines jungen Helden in einer vergessenen Welt.",
                    cover: "assets/images/books/book1.jpg",
                    sample: "docs/samples/book1.pdf",
                    purchase: "https://example.com/shop/book1"
                },
                {
                    id: 2,
                    title: "Die Chroniken von Arkania",
                    author: "Matthias Silberhain",
                    description: "Die erste Trilogie einer spannenden Fantasy-Saga über Macht, Magie und Schicksal.",
                    cover: "assets/images/books/book2.jpg",
                    sample: "docs/samples/book2.pdf",
                    purchase: "https://example.com/shop/book2"
                },
                {
                    id: 3,
                    title: "Im Zeichen des Silbermonds",
                    author: "Matthias Silberhain",
                    description: "Ein mystischer Roman über die Geheimnisse einer alten Prophezeiung und ihre Erfüllung.",
                    cover: "assets/images/books/book3.jpg",
                    sample: "docs/samples/book3.pdf",
                    purchase: "https://example.com/shop/book3"
                }
            ];
            
            booksContainer.innerHTML = mockBooks.map(book => `
                <div class="book-card" data-book-id="${book.id}">
                    <img src="${book.cover}" alt="${book.title}" class="book-cover" loading="lazy">
                    <div class="book-info">
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-author">${book.author}</p>
                        <p class="book-description">${book.description}</p>
                        <div class="book-actions">
                            <a href="${book.sample}" class="btn btn-secondary" target="_blank">Leseprobe</a>
                            <a href="${book.purchase}" class="btn btn-primary" target="_blank">Kaufen</a>
                        </div>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Fehler beim Laden der Bücher:', error);
            booksContainer.innerHTML = `
                <div class="error-message">
                    <p>Die Bücher konnten aktuell nicht geladen werden. Bitte versuchen Sie es später erneut.</p>
                </div>
            `;
        }
    }
    
    async loadSocialLinks() {
        const socialContainer = document.getElementById('social-links');
        if (!socialContainer) return;
        
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            const mockSocial = [
                { name: 'Facebook', url: 'https://facebook.com/matthiassilberhain', icon: '📘' },
                { name: 'Twitter', url: 'https://twitter.com/msilberhain', icon: '🐦' },
                { name: 'Instagram', url: 'https://instagram.com/matthiassilberhain', icon: '📷' },
                { name: 'Goodreads', url: 'https://goodreads.com/matthiassilberhain', icon: '📚' }
            ];
            
            socialContainer.innerHTML = mockSocial.map(social => `
                <li>
                    <a href="${social.url}" target="_blank" rel="noopener noreferrer">
                        <span class="social-icon">${social.icon}</span>
                        ${social.name}
                    </a>
                </li>
            `).join('');
            
        } catch (error) {
            console.error('Fehler beim Laden der Social Links:', error);
        }
    }
    
    setupAccessibility() {
        // Skip to main content link functionality
        const skipLink = document.querySelector('.skip-to-content');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const mainContent = document.querySelector('main');
                if (mainContent) {
                    mainContent.setAttribute('tabindex', '-1');
                    mainContent.focus();
                    setTimeout(() => {
                        mainContent.removeAttribute('tabindex');
                    }, 1000);
                }
            });
        }
        
        // Add keyboard navigation to all interactive elements
        document.querySelectorAll('button, a, input, select, textarea').forEach(el => {
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && el.tagName !== 'BUTTON' && el.tagName !== 'A') {
                    e.preventDefault();
                    el.click();
                }
            });
        });
        
        // Add focus styles for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    handlePageLoad() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Update active navigation
        this.setupNavigation();
        
        // Add loaded class to body
        document.body.classList.add('loaded');
    }
    
    handleResize() {
        // Handle mobile menu on resize
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (window.innerWidth > 768) {
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
            if (navMenu) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
    
    handleScroll() {
        // Header scroll effect
        const header = document.querySelector('.main-header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Back to top button logic could be added here
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                    }
                    
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Utility method for API calls
    async fetchData(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
    
    // Show notification
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
}

// Initialize the main app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MainApp();
});

// Export für Modul-Systeme
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainApp;
}