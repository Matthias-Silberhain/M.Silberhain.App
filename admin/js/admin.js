/**
 * Admin Dashboard JavaScript für Matthias Silberhain Website
 */

class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.isSidebarCollapsed = false;
        this.isAuthenticated = false;
        
        this.init();
    }
    
    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupSectionNavigation();
        this.setupThemeToggle();
    }
    
    checkAuthentication() {
        const token = sessionStorage.getItem('admin_token');
        const authenticated = sessionStorage.getItem('admin_authenticated');
        
        if (!token || !authenticated) {
            this.showLoginScreen();
        } else {
            this.isAuthenticated = true;
            this.showDashboard();
            this.validateToken(token);
        }
    }
    
    showLoginScreen() {
        document.getElementById('login-screen').style.display = 'block';
        document.getElementById('admin-dashboard').style.display = 'none';
    }
    
    showDashboard() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
    }
    
    validateToken(token) {
        // Hier würde normalerweise eine Token-Validierung stattfinden
        // Für dieses Beispiel setzen wir ein Timeout
        setTimeout(() => {
            // Simulierte Token-Validierung
            const isValid = true;
            
            if (!isValid) {
                this.logout();
            }
        }, 1000);
    }
    
    setupEventListeners() {
        // Login Form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Menu Toggle
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Logout Button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Quick Actions
        document.querySelectorAll('.btn-action').forEach(button => {
            button.addEventListener('click', (e) => this.handleQuickAction(e));
        });
        
        // Responsive sidebar
        window.addEventListener('resize', () => this.handleResize());
    }
    
    async handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Show loading state
        const submitBtn = event.target.querySelector('.btn-login');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-spinner"></div>';
        submitBtn.disabled = true;
        
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            // await this.authenticate(username, password);
            
            // Simulierte Authentifizierung
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Erfolgreiche Anmeldung
            if (username === 'admin' && password === 'admin') {
                const token = this.generateToken();
                sessionStorage.setItem('admin_token', token);
                sessionStorage.setItem('admin_authenticated', 'true');
                
                if (remember) {
                    localStorage.setItem('admin_remember', 'true');
                    localStorage.setItem('admin_username', username);
                }
                
                this.isAuthenticated = true;
                this.showDashboard();
                this.showNotification('Erfolgreich angemeldet!', 'success');
            } else {
                throw new Error('Ungültige Anmeldedaten');
            }
            
        } catch (error) {
            this.showNotification(error.message || 'Anmeldung fehlgeschlagen', 'danger');
            console.error('Login error:', error);
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    generateToken() {
        return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
    }
    
    logout() {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_authenticated');
        this.isAuthenticated = false;
        this.showLoginScreen();
        this.showNotification('Erfolgreich abgemeldet', 'info');
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('admin-sidebar');
        const main = document.getElementById('admin-main');
        
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        
        if (this.isSidebarCollapsed) {
            sidebar.classList.add('collapsed');
            main.classList.add('sidebar-collapsed');
        } else {
            sidebar.classList.remove('collapsed');
            main.classList.remove('sidebar-collapsed');
        }
        
        // Update toggle button icon
        const toggleIcon = document.querySelector('#menu-toggle i');
        if (toggleIcon) {
            toggleIcon.className = this.isSidebarCollapsed ? 'fas fa-bars' : 'fas fa-times';
        }
    }
    
    setupSectionNavigation() {
        const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.switchSection(section);
            });
        });
        
        // Load initial section from hash or default
        const hash = window.location.hash.substring(1);
        const initialSection = hash || 'dashboard';
        this.switchSection(initialSection);
    }
    
    switchSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from all sidebar items
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Update URL hash
            window.location.hash = sectionId;
            
            // Update active sidebar item
            const activeLink = document.querySelector(`.sidebar-link[data-section="${sectionId}"]`);
            if (activeLink) {
                activeLink.parentElement.classList.add('active');
            }
            
            // Load section data if needed
            this.loadSectionData(sectionId);
        }
    }
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('admin-theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('admin_theme', newTheme);
                
                // Update icon
                const icon = themeToggle.querySelector('i');
                icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
                
                this.showNotification(`Theme auf ${newTheme === 'light' ? 'Hell' : 'Dunkel'} geändert`, 'info');
            });
            
            // Load saved theme
            const savedTheme = localStorage.getItem('admin_theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            const icon = themeToggle.querySelector('i');
            icon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
    
    async loadDashboardData() {
        try {
            // Load statistics
            const stats = await this.fetchStats();
            this.updateDashboardStats(stats);
            
            // Load recent activities
            const activities = await this.fetchActivities();
            this.updateActivities(activities);
            
            // Load system info
            const systemInfo = await this.fetchSystemInfo();
            this.updateSystemInfo(systemInfo);
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.showNotification('Daten konnten nicht geladen werden', 'danger');
        }
    }
    
    async loadSectionData(sectionId) {
        switch (sectionId) {
            case 'books':
                await window.booksManager?.loadBooks();
                break;
            case 'calendar':
                await this.loadCalendar();
                break;
            case 'social':
                await this.loadSocialMedia();
                break;
            case 'design':
                await this.loadDesignSettings();
                break;
            case 'settings':
                await this.loadSettings();
                break;
        }
    }
    
    async fetchStats() {
        // Simulierte API-Antwort
        return {
            books: 12,
            events: 5,
            social: 4,
            visitors: 342
        };
    }
    
    updateDashboardStats(stats) {
        if (stats.books !== undefined) {
            document.getElementById('books-count').textContent = stats.books;
        }
        if (stats.events !== undefined) {
            document.getElementById('events-count').textContent = stats.events;
        }
        if (stats.social !== undefined) {
            document.getElementById('social-count').textContent = stats.social;
        }
        if (stats.visitors !== undefined) {
            document.getElementById('visitors-count').textContent = stats.visitors;
        }
    }
    
    async fetchActivities() {
        // Simulierte API-Antwort
        return [
            {
                id: 1,
                type: 'book',
                text: 'Neues Buch "Der Schatten des Nordens" hinzugefügt',
                time: 'Vor 2 Stunden'
            },
            {
                id: 2,
                type: 'event',
                text: 'Lesung in Berlin am 15.12.2024 geplant',
                time: 'Vor 1 Tag'
            },
            {
                id: 3,
                type: 'social',
                text: 'Instagram-Profil aktualisiert',
                time: 'Vor 2 Tagen'
            },
            {
                id: 4,
                type: 'system',
                text: 'Backup erfolgreich durchgeführt',
                time: 'Vor 3 Tagen'
            }
        ];
    }
    
    updateActivities(activities) {
        const container = document.getElementById('activity-list');
        if (!container) return;
        
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }
    
    getActivityIcon(type) {
        const icons = {
            'book': 'book',
            'event': 'calendar',
            'social': 'share-alt',
            'system': 'cog',
            'user': 'user',
            'upload': 'upload'
        };
        return icons[type] || 'info-circle';
    }
    
    async fetchSystemInfo() {
        // Simulierte System-Info
        return {
            phpVersion: '8.1.12',
            memoryUsage: '45.2 MB',
            lastBackup: '2024-01-14 03:00',
            storageSpace: '2.4 GB / 10 GB'
        };
    }
    
    updateSystemInfo(info) {
        if (info.phpVersion) {
            document.getElementById('php-version').textContent = info.phpVersion;
        }
        if (info.memoryUsage) {
            document.getElementById('memory-usage').textContent = info.memoryUsage;
        }
        if (info.lastBackup) {
            document.getElementById('last-backup').textContent = info.lastBackup;
        }
        if (info.storageSpace) {
            document.getElementById('storage-space').textContent = info.storageSpace;
        }
    }
    
    handleQuickAction(event) {
        const action = event.currentTarget.getAttribute('data-action');
        
        switch (action) {
            case 'add-book':
                this.switchSection('books');
                setTimeout(() => {
                    document.getElementById('add-book-btn')?.click();
                }, 100);
                break;
                
            case 'add-event':
                this.switchSection('calendar');
                this.showNotification('Termin hinzufügen Dialog öffnen', 'info');
                break;
                
            case 'upload-cover':
                this.showNotification('Cover Upload Dialog öffnen', 'info');
                break;
                
            case 'view-logs':
                this.showNotification('Logs werden geladen', 'info');
                // Hier würde Log-Anzeige implementiert werden
                break;
        }
    }
    
    handleResize() {
        if (window.innerWidth < 992) {
            document.getElementById('admin-sidebar').classList.remove('collapsed');
            document.getElementById('admin-main').classList.remove('sidebar-collapsed');
            this.isSidebarCollapsed = false;
        }
    }
    
    async loadCalendar() {
        // Calendar wird hier geladen
        const container = document.getElementById('calendar-management');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    Kalenderverwaltung wird geladen...
                </div>
            `;
            
            // Simulierte Ladezeit
            setTimeout(() => {
                container.innerHTML = `
                    <div class="calendar-interface">
                        <h3>Kalender wird hier angezeigt</h3>
                        <p>Diese Funktion wird in der nächsten Version implementiert.</p>
                    </div>
                `;
            }, 500);
        }
    }
    
    async loadSocialMedia() {
        const container = document.getElementById('social-management');
        if (container) {
            container.innerHTML = `
                <div class="social-interface">
                    <h3>Social Media Verwaltung</h3>
                    <p>Verwalten Sie hier Ihre Social Media Profile.</p>
                </div>
            `;
        }
    }
    
    async loadDesignSettings() {
        const container = document.getElementById('design-management');
        if (container) {
            container.innerHTML = `
                <div class="design-interface">
                    <h3>Design & Farben Einstellungen</h3>
                    <p>Passen Sie hier das Aussehen Ihrer Website an.</p>
                </div>
            `;
        }
    }
    
    async loadSettings() {
        const container = document.getElementById('settings-management');
        if (container) {
            container.innerHTML = `
                <div class="settings-interface">
                    <h3>Allgemeine Einstellungen</h3>
                    <p>Konfigurieren Sie hier die allgemeinen Einstellungen.</p>
                </div>
            `;
        }
    }
    
    showNotification(message, type = 'info') {
        // Erstelle Notification Element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            ${message}
        `;
        
        // Füge Notification hinzu
        const main = document.getElementById('admin-main');
        if (main) {
            main.insertBefore(notification, main.firstChild);
            
            // Entferne Notification nach 5 Sekunden
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);
        }
    }
    
    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'danger': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});