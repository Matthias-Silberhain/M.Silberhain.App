/**
 * Books Manager für Admin Dashboard
 * Verwaltung von Büchern, Covern, Leseproben und Kauf-Links
 */

class BooksManager {
    constructor() {
        this.books = [];
        this.currentBook = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadBooks();
    }
    
    setupEventListeners() {
        // Add Book Button
        const addBookBtn = document.getElementById('add-book-btn');
        if (addBookBtn) {
            addBookBtn.addEventListener('click', () => this.showBookForm());
        }
        
        // Quick action button
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="add-book"]')) {
                this.showBookForm();
            }
        });
    }
    
    async loadBooks() {
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            // Für jetzt verwenden wir Mock-Daten
            this.books = [
                {
                    id: 1,
                    title: "Der Schatten des Nordens",
                    author: "Matthias Silberhain",
                    description: "Ein epischer Fantasy-Roman über die Abenteuer eines jungen Helden in einer vergessenen Welt.",
                    cover: "../assets/images/books/book1.jpg",
                    sample_pdf: "../docs/samples/book1.pdf",
                    purchase_link: "https://example.com/shop/book1",
                    published: true,
                    featured: true,
                    created_at: "2024-01-10",
                    updated_at: "2024-01-12"
                },
                {
                    id: 2,
                    title: "Die Chroniken von Arkania",
                    author: "Matthias Silberhain",
                    description: "Die erste Trilogie einer spannenden Fantasy-Saga über Macht, Magie und Schicksal.",
                    cover: "../assets/images/books/book2.jpg",
                    sample_pdf: "../docs/samples/book2.pdf",
                    purchase_link: "https://example.com/shop/book2",
                    published: true,
                    featured: true,
                    created_at: "2024-01-05",
                    updated_at: "2024-01-10"
                },
                {
                    id: 3,
                    title: "Im Zeichen des Silbermonds",
                    author: "Matthias Silberhain",
                    description: "Ein mystischer Roman über die Geheimnisse einer alten Prophezeiung und ihre Erfüllung.",
                    cover: "../assets/images/books/book3.jpg",
                    sample_pdf: "../docs/samples/book3.pdf",
                    purchase_link: "https://example.com/shop/book3",
                    published: true,
                    featured: false,
                    created_at: "2023-12-15",
                    updated_at: "2024-01-08"
                }
            ];
            
            this.renderBooks();
            
        } catch (error) {
            console.error('Fehler beim Laden der Bücher:', error);
            this.showError('Bücher konnten nicht geladen werden');
        }
    }
    
    renderBooks() {
        const container = document.getElementById('books-management');
        if (!container) return;
        
        if (this.books.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <h3>Keine Bücher vorhanden</h3>
                    <p>Fügen Sie Ihr erstes Buch hinzu.</p>
                    <button class="btn btn-primary" id="add-first-book">
                        <i class="fas fa-plus"></i>
                        Erstes Buch hinzufügen
                    </button>
                </div>
            `;
            
            document.getElementById('add-first-book')?.addEventListener('click', () => {
                this.showBookForm();
            });
            
            return;
        }
        
        container.innerHTML = `
            <div class="books-list">
                <div class="books-header">
                    <h3>Verfügbare Bücher (${this.books.length})</h3>
                    <div class="books-filter">
                        <input type="text" id="book-search" placeholder="Bücher durchsuchen...">
                        <select id="book-filter">
                            <option value="all">Alle Bücher</option>
                            <option value="published">Veröffentlicht</option>
                            <option value="draft">Entwurf</option>
                            <option value="featured">Hervorgehoben</option>
                        </select>
                    </div>
                </div>
                
                <div class="books-grid" id="books-grid">
                    <!-- Books will be rendered here -->
                </div>
            </div>
        `;
        
        const booksGrid = document.getElementById('books-grid');
        booksGrid.innerHTML = this.books.map(book => this.renderBookCard(book)).join('');
        
        // Add event listeners to action buttons
        this.setupBookCardListeners();
        
        // Setup search and filter
        this.setupSearchFilter();
    }
    
    renderBookCard(book) {
        return `
            <div class="book-admin-card" data-book-id="${book.id}">
                <div class="book-card-header">
                    <div class="book-cover-preview">
                        <img src="${book.cover}" alt="${book.title}" loading="lazy">
                        ${book.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Hervorgehoben</span>' : ''}
                        ${!book.published ? '<span class="draft-badge"><i class="fas fa-pencil-alt"></i> Entwurf</span>' : ''}
                    </div>
                    
                    <div class="book-card-actions">
                        <button class="btn btn-icon btn-edit" data-action="edit" title="Bearbeiten">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-delete" data-action="delete" title="Löschen">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn btn-icon btn-toggle" data-action="toggle-publish" title="${book.published ? 'Als Entwurf markieren' : 'Veröffentlichen'}">
                            <i class="fas ${book.published ? 'fa-eye-slash' : 'fa-eye'}"></i>
                        </button>
                        <button class="btn btn-icon btn-feature" data-action="toggle-feature" title="${book.featured ? 'Hervorhebung entfernen' : 'Hervorheben'}">
                            <i class="fas ${book.featured ? 'fa-star' : 'fa-star-o'}"></i>
                        </button>
                    </div>
                </div>
                
                <div class="book-card-body">
                    <h4 class="book-title">${book.title}</h4>
                    <p class="book-author">${book.author}</p>
                    <p class="book-description">${book.description}</p>
                    
                    <div class="book-info">
                        <div class="info-item">
                            <span class="info-label">ID:</span>
                            <span class="info-value">${book.id}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Aktualisiert:</span>
                            <span class="info-value">${book.updated_at}</span>
                        </div>
                    </div>
                    
                    <div class="book-links">
                        <a href="${book.sample_pdf}" class="btn-link" target="_blank">
                            <i class="fas fa-file-pdf"></i>
                            Leseprobe
                        </a>
                        <a href="${book.purchase_link}" class="btn-link" target="_blank">
                            <i class="fas fa-shopping-cart"></i>
                            Kaufen
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupBookCardListeners() {
        document.querySelectorAll('.book-admin-card').forEach(card => {
            const bookId = parseInt(card.dataset.bookId);
            
            card.querySelector('[data-action="edit"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editBook(bookId);
            });
            
            card.querySelector('[data-action="delete"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteBook(bookId);
            });
            
            card.querySelector('[data-action="toggle-publish"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePublish(bookId);
            });
            
            card.querySelector('[data-action="toggle-feature"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFeature(bookId);
            });
            
            // Klick auf Karte öffnet auch Bearbeitungsdialog
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button') && !e.target.closest('a')) {
                    this.editBook(bookId);
                }
            });
        });
    }
    
    setupSearchFilter() {
        const searchInput = document.getElementById('book-search');
        const filterSelect = document.getElementById('book-filter');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterBooks(e.target.value, filterSelect?.value || 'all');
            });
        }
        
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterBooks(searchInput?.value || '', e.target.value);
            });
        }
    }
    
    filterBooks(searchTerm, filter) {
        const cards = document.querySelectorAll('.book-admin-card');
        
        cards.forEach(card => {
            const bookId = parseInt(card.dataset.bookId);
            const book = this.books.find(b => b.id === bookId);
            if (!book) return;
            
            let matches = true;
            
            // Suchfilter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                matches = book.title.toLowerCase().includes(searchLower) ||
                         book.author.toLowerCase().includes(searchLower) ||
                         book.description.toLowerCase().includes(searchLower);
            }
            
            // Statusfilter
            if (matches && filter !== 'all') {
                switch (filter) {
                    case 'published':
                        matches = book.published === true;
                        break;
                    case 'draft':
                        matches = book.published === false;
                        break;
                    case 'featured':
                        matches = book.featured === true;
                        break;
                }
            }
            
            card.style.display = matches ? 'block' : 'none';
        });
    }
    
    showBookForm(book = null) {
        this.currentBook = book;
        
        const modalHTML = `
            <div class="modal-overlay active" id="book-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${book ? 'Buch bearbeiten' : 'Neues Buch hinzufügen'}</h3>
                        <button class="btn btn-icon btn-close" id="close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <form id="book-form" class="book-form" enctype="multipart/form-data">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="book-title">Titel *</label>
                                    <input type="text" id="book-title" name="title" required 
                                           value="${book ? book.title : ''}">
                                </div>
                                
                                <div class="form-group">
                                    <label for="book-author">Autor *</label>
                                    <input type="text" id="book-author" name="author" required 
                                           value="${book ? book.author : 'Matthias Silberhain'}">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="book-description">Beschreibung *</label>
                                <textarea id="book-description" name="description" rows="4" required>${book ? book.description : ''}</textarea>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="book-cover">Cover-Bild</label>
                                    <div class="file-upload">
                                        <input type="file" id="book-cover" name="cover" accept="image/*">
                                        <label for="book-cover" class="file-label">
                                            <i class="fas fa-upload"></i>
                                            <span>Cover hochladen</span>
                                        </label>
                                        ${book ? `<div class="file-preview">
                                            <img src="${book.cover}" alt="Aktuelles Cover">
                                        </div>` : ''}
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="book-sample">Leseprobe (PDF)</label>
                                    <div class="file-upload">
                                        <input type="file" id="book-sample" name="sample" accept=".pdf">
                                        <label for="book-sample" class="file-label">
                                            <i class="fas fa-upload"></i>
                                            <span>PDF hochladen</span>
                                        </label>
                                        ${book && book.sample_pdf ? `<div class="file-info">
                                            <i class="fas fa-file-pdf"></i>
                                            <span>Aktuelle Datei: ${book.sample_pdf.split('/').pop()}</span>
                                        </div>` : ''}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="book-purchase-link">Kauf-Link</label>
                                    <input type="url" id="book-purchase-link" name="purchase_link" 
                                           value="${book ? book.purchase_link : ''}" 
                                           placeholder="https://...">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="book-published" name="published" ${book?.published ? 'checked' : ''}>
                                        <span class="checkbox-custom"></span>
                                        Veröffentlicht
                                    </label>
                                </div>
                                
                                <div class="form-group checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" id="book-featured" name="featured" ${book?.featured ? 'checked' : ''}>
                                        <span class="checkbox-custom"></span>
                                        Hervorgehoben (auf Startseite anzeigen)
                                    </label>
                                </div>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary" id="cancel-form">
                                    Abbrechen
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    ${book ? 'Aktualisieren' : 'Speichern'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('book-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup modal event listeners
        this.setupModalListeners();
        
        // Setup form submission
        const form = document.getElementById('book-form');
        form.addEventListener('submit', (e) => this.saveBook(e));
    }
    
    setupModalListeners() {
        const modal = document.getElementById('book-modal');
        const closeBtn = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-form');
        
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        // Close modal on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal) {
                closeModal();
            }
        });
        
        // File upload preview
        const coverInput = document.getElementById('book-cover');
        if (coverInput) {
            coverInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const preview = document.querySelector('.file-preview');
                        if (preview) {
                            preview.innerHTML = `<img src="${event.target.result}" alt="Vorschaubild">`;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
    
    async saveBook(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        // Validation
        const title = formData.get('title');
        const author = formData.get('author');
        const description = formData.get('description');
        
        if (!title || !author || !description) {
            this.showError('Bitte füllen Sie alle Pflichtfelder aus');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-spinner"></div>';
        submitBtn.disabled = true;
        
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            // await this.apiSaveBook(formData);
            
            // Simulierte API-Antwort
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (this.currentBook) {
                // Update existing book
                const bookIndex = this.books.findIndex(b => b.id === this.currentBook.id);
                if (bookIndex !== -1) {
                    this.books[bookIndex] = {
                        ...this.books[bookIndex],
                        title: formData.get('title'),
                        author: formData.get('author'),
                        description: formData.get('description'),
                        purchase_link: formData.get('purchase_link'),
                        published: formData.get('published') === 'on',
                        featured: formData.get('featured') === 'on',
                        updated_at: new Date().toISOString().split('T')[0]
                    };
                }
                
                this.showNotification('Buch erfolgreich aktualisiert', 'success');
            } else {
                // Add new book
                const newBook = {
                    id: this.books.length > 0 ? Math.max(...this.books.map(b => b.id)) + 1 : 1,
                    title: formData.get('title'),
                    author: formData.get('author'),
                    description: formData.get('description'),
                    cover: '../assets/images/books/default.jpg',
                    sample_pdf: '../docs/samples/default.pdf',
                    purchase_link: formData.get('purchase_link'),
                    published: formData.get('published') === 'on',
                    featured: formData.get('featured') === 'on',
                    created_at: new Date().toISOString().split('T')[0],
                    updated_at: new Date().toISOString().split('T')[0]
                };
                
                this.books.unshift(newBook);
                this.showNotification('Buch erfolgreich hinzugefügt', 'success');
            }
            
            // Close modal and refresh list
            document.getElementById('book-modal')?.remove();
            this.renderBooks();
            
        } catch (error) {
            console.error('Fehler beim Speichern des Buches:', error);
            this.showError('Buch konnte nicht gespeichert werden');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    editBook(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (book) {
            this.showBookForm(book);
        }
    }
    
    async deleteBook(bookId) {
        if (!confirm('Möchten Sie dieses Buch wirklich löschen?')) {
            return;
        }
        
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            // await this.apiDeleteBook(bookId);
            
            // Simulierte API-Antwort
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.books = this.books.filter(b => b.id !== bookId);
            this.renderBooks();
            this.showNotification('Buch erfolgreich gelöscht', 'success');
            
        } catch (error) {
            console.error('Fehler beim Löschen des Buches:', error);
            this.showError('Buch konnte nicht gelöscht werden');
        }
    }
    
    async togglePublish(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;
        
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            // await this.apiTogglePublish(bookId);
            
            // Simulierte API-Antwort
            await new Promise(resolve => setTimeout(resolve, 300));
            
            book.published = !book.published;
            book.updated_at = new Date().toISOString().split('T')[0];
            
            this.renderBooks();
            
            const message = book.published ? 
                'Buch wurde veröffentlicht' : 
                'Buch wurde als Entwurf markiert';
            this.showNotification(message, 'info');
            
        } catch (error) {
            console.error('Fehler beim Ändern des Status:', error);
            this.showError('Status konnte nicht geändert werden');
        }
    }
    
    async toggleFeature(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;
        
        try {
            // Hier würde normalerweise eine API-Anfrage stehen
            // await this.apiToggleFeature(bookId);
            
            // Simulierte API-Antwort
            await new Promise(resolve => setTimeout(resolve, 300));
            
            book.featured = !book.featured;
            book.updated_at = new Date().toISOString().split('T')[0];
            
            this.renderBooks();
            
            const message = book.featured ? 
                'Buch wird jetzt hervorgehoben' : 
                'Hervorhebung wurde entfernt';
            this.showNotification(message, 'info');
            
        } catch (error) {
            console.error('Fehler beim Ändern der Hervorhebung:', error);
            this.showError('Hervorhebung konnte nicht geändert werden');
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
    window.booksManager = new BooksManager();
});