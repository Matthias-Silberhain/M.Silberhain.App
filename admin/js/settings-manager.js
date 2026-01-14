/**
 * Settings Manager für Admin Dashboard
 * Verwaltung von Design-Einstellungen, Farben, Social Media, etc.
 */

class SettingsManager {
    constructor() {
        this.settings = {};
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
    }
    
    async loadSettings() {
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            // Für jetzt verwenden wir Mock-Daten
            this.settings = {
                theme: 'black',
                colors: {
                    primary: '#000000',
                    secondary: '#1a1a1a',
                    accent: '#c0c0c0',
                    text: '#c0c0c0'
                },
                social_media: [
                    { platform: 'Facebook', url: 'https://facebook.com/matthiassilberhain', enabled: true },
                    { platform: 'Twitter', url: 'https://twitter.com/msilberhain', enabled: true },
                    { platform: 'Instagram', url: 'https://instagram.com/matthiassilberhain', enabled: true },
                    { platform: 'Goodreads', url: 'https://goodreads.com/matthiassilberhain', enabled: true }
                ],
                background_images: [
                    { id: 1, name: 'Dark Pattern', url: '../assets/backgrounds/pattern1.jpg', active: true },
                    { id: 2, name: 'Gradient', url: '../assets/backgrounds/gradient1.jpg', active: false }
                ],
                contact_email: 'kontakt@silberhain.de',
                analytics_code: '',
                maintenance_mode: false
            };
            
            this.renderSettings();
            
        } catch (error) {
            console.error('Fehler beim Laden der Einstellungen:', error);
            this.showError('Einstellungen konnten nicht geladen werden');
        }
    }
    
    renderSettings() {
        // Design & Colors Section
        this.renderDesignSettings();
        
        // Social Media Section
        this.renderSocialMedia();
        
        // General Settings Section
        this.renderGeneralSettings();
    }
    
    renderDesignSettings() {
        const container = document.getElementById('design-management');
        if (!container) return;
        
        container.innerHTML = `
            <div class="settings-section">
                <h3>Design & Farben</h3>
                
                <div class="settings-form">
                    <div class="form-group">
                        <label for="theme-select">Theme</label>
                        <select id="theme-select" class="form-input">
                            <option value="black" ${this.settings.theme === 'black' ? 'selected' : ''}>Schwarz</option>
                            <option value="dark-gray" ${this.settings.theme === 'dark-gray' ? 'selected' : ''}>Dunkelgrau</option>
                        </select>
                    </div>
                    
                    <div class="color-picker-group">
                        <h4>Farben anpassen</h4>
                        <div class="color-grid">
                            <div class="color-item">
                                <label for="color-primary">Primärfarbe</label>
                                <input type="color" id="color-primary" value="${this.settings.colors.primary}">
                            </div>
                            <div class="color-item">
                                <label for="color-secondary">Sekundärfarbe</label>
                                <input type="color" id="color-secondary" value="${this.settings.colors.secondary}">
                            </div>
                            <div class="color-item">
                                <label for="color-accent">Akzentfarbe</label>
                                <input type="color" id="color-accent" value="${this.settings.colors.accent}">
                            </div>
                            <div class="color-item">
                                <label for="color-text">Textfarbe</label>
                                <input type="color" id="color-text" value="${this.settings.colors.text}">
                            </div>
                        </div>
                    </div>
                    
                    <div class="background-images">
                        <h4>Hintergrundbilder</h4>
                        <div class="images-grid">
                            ${this.settings.background_images.map(bg => `
                                <div class="image-item ${bg.active ? 'active' : ''}" data-bg-id="${bg.id}">
                                    <img src="${bg.url}" alt="${bg.name}">
                                    <div class="image-overlay">
                                        <h5>${bg.name}</h5>
                                        <div class="image-actions">
                                            <button class="btn btn-sm ${bg.active ? 'btn-primary' : 'btn-secondary'}" 
                                                    data-action="toggle-bg" data-bg-id="${bg.id}">
                                                ${bg.active ? 'Aktiv' : 'Aktivieren'}
                                            </button>
                                            <button class="btn btn-sm btn-danger" 
                                                    data-action="delete-bg" data-bg-id="${bg.id}">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                            <div class="image-item add-new">
                                <label for="upload-background" class="add-background">
                                    <i class="fas fa-plus"></i>
                                    <span>Neues Hintergrundbild hinzufügen</span>
                                    <input type="file" id="upload-background" accept="image/*" style="display: none;">
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-secondary" id="reset-colors">
                            Farben zurücksetzen
                        </button>
                        <button class="btn btn-primary" id="save-design">
                            Design speichern
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.setupDesignEventListeners();
    }
    
    renderSocialMedia() {
        const container = document.getElementById('social-management');
        if (!container) return;
        
        container.innerHTML = `
            <div class="settings-section">
                <h3>Social Media Profile</h3>
                
                <div class="social-media-list">
                    ${this.settings.social_media.map((social, index) => `
                        <div class="social-item" data-index="${index}">
                            <div class="social-platform">
                                <i class="fab fa-${social.platform.toLowerCase()}"></i>
                                <span>${social.platform}</span>
                            </div>
                            <input type="url" class="social-url" value="${social.url}" 
                                   placeholder="https://...">
                            <div class="social-actions">
                                <label class="switch">
                                    <input type="checkbox" class="social-enabled" ${social.enabled ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                                <button class="btn btn-icon btn-danger" data-action="remove-social">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                    
                    <div class="add-social">
                        <button class="btn btn-secondary" id="add-social-btn">
                            <i class="fas fa-plus"></i>
                            Social Media Profil hinzufügen
                        </button>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-primary" id="save-social">
                        Social Media speichern
                    </button>
                </div>
            </div>
        `;
        
        this.setupSocialEventListeners();
    }
    
    renderGeneralSettings() {
        const container = document.getElementById('settings-management');
        if (!container) return;
        
        container.innerHTML = `
            <div class="settings-section">
                <h3>Allgemeine Einstellungen</h3>
                
                <div class="settings-form">
                    <div class="form-group">
                        <label for="contact-email">Kontakt-E-Mail</label>
                        <input type="email" id="contact-email" class="form-input" 
                               value="${this.settings.contact_email}">
                    </div>
                    
                    <div class="form-group">
                        <label for="analytics-code">Google Analytics Code</label>
                        <textarea id="analytics-code" class="form-input" rows="4" 
                                  placeholder="Paste your Google Analytics tracking code here">${this.settings.analytics_code}</textarea>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="maintenance-mode" ${this.settings.maintenance_mode ? 'checked' : ''}>
                            <span class="checkbox-custom"></span>
                            Wartungsmodus aktivieren
                        </label>
                        <p class="checkbox-description">
                            Im Wartungsmodus ist die Website für Besucher nicht erreichbar.
                        </p>
                    </div>
                    
                    <div class="danger-zone">
                        <h4>Gefahrenzone</h4>
                        <div class="danger-actions">
                            <button class="btn btn-danger" id="clear-cache">
                                Cache leeren
                            </button>
                            <button class="btn btn-danger" id="reset-settings">
                                Einstellungen zurücksetzen
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-primary" id="save-general">
                            Allgemeine Einstellungen speichern
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.setupGeneralEventListeners();
    }
    
    setupDesignEventListeners() {
        // Theme selector
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
            });
        }
        
        // Color pickers
        document.querySelectorAll('input[type="color"]').forEach(picker => {
            picker.addEventListener('change', (e) => {
                const colorId = e.target.id.replace('color-', '');
                if (this.settings.colors[colorId] !== undefined) {
                    this.settings.colors[colorId] = e.target.value;
                }
            });
        });
        
        // Background image actions
        document.querySelectorAll('[data-action="toggle-bg"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const bgId = parseInt(e.target.closest('[data-bg-id]').dataset.bgId);
                this.toggleBackground(bgId);
            });
        });
        
        document.querySelectorAll('[data-action="delete-bg"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const bgId = parseInt(e.target.closest('[data-bg-id]').dataset.bgId);
                this.deleteBackground(bgId);
            });
        });
        
        // Upload background
        const uploadInput = document.getElementById('upload-background');
        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => {
                this.uploadBackground(e.target.files[0]);
            });
        }
        
        // Reset colors button
        const resetBtn = document.getElementById('reset-colors');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetColors();
            });
        }
        
        // Save design button
        const saveBtn = document.getElementById('save-design');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveDesignSettings();
            });
        }
    }
    
    setupSocialEventListeners() {
        // Add social button
        const addBtn = document.getElementById('add-social-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.addSocialMedia();
            });
        }
        
        // Remove social buttons
        document.querySelectorAll('[data-action="remove-social"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.social-item').dataset.index);
                this.removeSocialMedia(index);
            });
        });
        
        // Save social button
        const saveBtn = document.getElementById('save-social');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSocialMedia();
            });
        }
    }
    
    setupGeneralEventListeners() {
        // Clear cache button
        const clearCacheBtn = document.getElementById('clear-cache');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => {
                this.clearCache();
            });
        }
        
        // Reset settings button
        const resetBtn = document.getElementById('reset-settings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSettings();
            });
        }
        
        // Save general button
        const saveBtn = document.getElementById('save-general');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveGeneralSettings();
            });
        }
    }
    
    async toggleBackground(bgId) {
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            await new Promise(resolve => setTimeout(resolve, 300));
            
            this.settings.background_images.forEach(bg => {
                bg.active = bg.id === bgId;
            });
            
            this.renderDesignSettings();
            this.showNotification('Hintergrundbild aktualisiert', 'success');
            
        } catch (error) {
            console.error('Fehler beim Wechseln des Hintergrunds:', error);
            this.showError('Hintergrund konnte nicht geändert werden');
        }
    }
    
    async deleteBackground(bgId) {
        if (!confirm('Möchten Sie dieses Hintergrundbild wirklich löschen?')) {
            return;
        }
        
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            await new Promise(resolve => setTimeout(resolve, 300));
            
            this.settings.background_images = this.settings.background_images.filter(bg => bg.id !== bgId);
            this.renderDesignSettings();
            this.showNotification('Hintergrundbild gelöscht', 'success');
            
        } catch (error) {
            console.error('Fehler beim Löschen des Hintergrunds:', error);
            this.showError('Hintergrund konnte nicht gelöscht werden');
        }
    }
    
    async uploadBackground(file) {
        if (!file) return;
        
        // Validierung
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.showError('Nur JPEG, PNG, GIF und WebP Bilder sind erlaubt');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB
            this.showError('Bild darf maximal 10MB groß sein');
            return;
        }
        
        try {
            // Hier würde normalerweise ein Upload an den Server stattfinden
            // Simulieren wir einen Upload
            this.showNotification('Lade Hintergrundbild hoch...', 'info');
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Neue ID generieren
            const newId = this.settings.background_images.length > 0 
                ? Math.max(...this.settings.background_images.map(bg => bg.id)) + 1 
                : 1;
            
            // Neue URL (im echten System wäre dies der Pfad zum hochgeladenen Bild)
            const newUrl = URL.createObjectURL(file);
            
            // Neues Hintergrundbild hinzufügen
            this.settings.background_images.push({
                id: newId,
                name: file.name,
                url: newUrl,
                active: false
            });
            
            this.renderDesignSettings();
            this.showNotification('Hintergrundbild erfolgreich hochgeladen', 'success');
            
        } catch (error) {
            console.error('Fehler beim Hochladen des Hintergrunds:', error);
            this.showError('Hintergrund konnte nicht hochgeladen werden');
        }
    }
    
    resetColors() {
        this.settings.colors = {
            primary: '#000000',
            secondary: '#1a1a1a',
            accent: '#c0c0c0',
            text: '#c0c0c0'
        };
        this.renderDesignSettings();
        this.showNotification('Farben wurden zurückgesetzt', 'info');
    }
    
    addSocialMedia() {
        const newPlatform = {
            platform: 'New Platform',
            url: '',
            enabled: true
        };
        
        this.settings.social_media.push(newPlatform);
        this.renderSocialMedia();
    }
    
    removeSocialMedia(index) {
        if (this.settings.social_media.length <= 1) {
            this.showError('Mindestens ein Social Media Profil muss vorhanden sein');
            return;
        }
        
        if (confirm('Möchten Sie dieses Social Media Profil wirklich entfernen?')) {
            this.settings.social_media.splice(index, 1);
            this.renderSocialMedia();
        }
    }
    
    async clearCache() {
        if (!confirm('Möchten Sie wirklich den Cache leeren?')) {
            return;
        }
        
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.showNotification('Cache wurde geleert', 'success');
            
        } catch (error) {
            console.error('Fehler beim Leeren des Caches:', error);
            this.showError('Cache konnte nicht geleert werden');
        }
    }
    
    async resetSettings() {
        if (!confirm('Möchten Sie wirklich alle Einstellungen zurücksetzen?\nDiese Aktion kann nicht rückgängig gemacht werden.')) {
            return;
        }
        
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Zurücksetzen auf Standardwerte
            this.settings = {
                theme: 'black',
                colors: {
                    primary: '#000000',
                    secondary: '#1a1a1a',
                    accent: '#c0c0c0',
                    text: '#c0c0c0'
                },
                social_media: [
                    { platform: 'Facebook', url: '', enabled: true },
                    { platform: 'Twitter', url: '', enabled: true }
                ],
                background_images: [],
                contact_email: 'kontakt@silberhain.de',
                analytics_code: '',
                maintenance_mode: false
            };
            
            this.renderSettings();
            this.showNotification('Einstellungen wurden zurückgesetzt', 'success');
            
        } catch (error) {
            console.error('Fehler beim Zurücksetzen der Einstellungen:', error);
            this.showError('Einstellungen konnten nicht zurückgesetzt werden');
        }
    }
    
    async saveDesignSettings() {
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Theme auch auf der Hauptseite aktualisieren
            if (window.darkModeToggle && this.settings.theme) {
                window.darkModeToggle.setThemeExternal(this.settings.theme);
            }
            
            this.showNotification('Design-Einstellungen gespeichert', 'success');
            
        } catch (error) {
            console.error('Fehler beim Speichern der Design-Einstellungen:', error);
            this.showError('Design-Einstellungen konnten nicht gespeichert werden');
        }
    }
    
    async saveSocialMedia() {
        try {
            // Sammle die Social Media Daten aus dem Formular
            const socialItems = document.querySelectorAll('.social-item');
            const updatedSocial = [];
            
            socialItems.forEach(item => {
                const platform = item.querySelector('.social-platform span').textContent;
                const url = item.querySelector('.social-url').value;
                const enabled = item.querySelector('.social-enabled').checked;
                
                updatedSocial.push({
                    platform,
                    url,
                    enabled
                });
            });
            
            this.settings.social_media = updatedSocial;
            
            // Hier würde normalerweise eine API-Anfrage stehen
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.showNotification('Social Media Einstellungen gespeichert', 'success');
            
        } catch (error) {
            console.error('Fehler beim Speichern der Social Media Einstellungen:', error);
            this.showError('Social Media Einstellungen konnten nicht gespeichert werden');
        }
    }
    
    async saveGeneralSettings() {
        try {
            // Sammle die allgemeinen Einstellungen
            this.settings.contact_email = document.getElementById('contact-email').value;
            this.settings.analytics_code = document.getElementById('analytics-code').value;
            this.settings.maintenance_mode = document.getElementById('maintenance-mode').checked;
            
            // Hier würde normalerweise eine API-Anfrage stehen
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.showNotification('Allgemeine Einstellungen gespeichert', 'success');
            
        } catch (error) {
            console.error('Fehler beim Speichern der allgemeinen Einstellungen:', error);
            this.showError('Allgemeine Einstellungen konnten nicht gespeichert werden');
        }
    }
    
    showNotification(message, type = 'info') {
        if (window.adminDashboard?.showNotification) {
            window.adminDashboard.showNotification(message, type);
        } else {
            alert(message);
        }
    }
    
    showError(message) {
        this.showNotification(message, 'danger');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});