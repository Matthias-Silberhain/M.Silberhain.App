-- Database Schema for Matthias Silberhain Website

CREATE DATABASE IF NOT EXISTS silberhain_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE silberhain_db;

-- Books table
CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL DEFAULT 'Matthias Silberhain',
    description TEXT,
    cover_image VARCHAR(500),
    sample_pdf VARCHAR(500),
    purchase_link VARCHAR(500),
    published BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_published (published),
    INDEX idx_featured (featured),
    INDEX idx_created (created_at)
);

-- Events/Calendar table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    event_date DATE NOT NULL,
    event_time TIME,
    end_date DATE,
    end_time TIME,
    link VARCHAR(500),
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_date (event_date),
    INDEX idx_published (published)
);

-- Social Media table
CREATE TABLE social_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    platform VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_platform (platform)
);

-- Settings table
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'json', 'boolean', 'number') DEFAULT 'string',
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category)
);

-- Background images table
CREATE TABLE background_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    active BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (active)
);

-- Admin logs table
CREATE TABLE admin_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_user VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_user (admin_user),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
);

-- Website visitors log (optional, for basic analytics)
CREATE TABLE visitor_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    page_visited VARCHAR(500),
    referrer VARCHAR(500),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_visit_time (visit_time),
    INDEX idx_page (page_visited(255))
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, setting_type, category, description) VALUES
('site_name', 'Matthias Silberhain', 'string', 'general', 'Name der Website'),
('contact_email', 'kontakt@silberhain.de', 'string', 'general', 'Kontakt-E-Mail-Adresse'),
('theme', 'black', 'string', 'design', 'Aktives Theme (black oder dark-gray)'),
('colors', '{"primary":"#000000","secondary":"#1a1a1a","accent":"#c0c0c0","text":"#c0c0c0"}', 'json', 'design', 'Farbpalette der Website'),
('analytics_code', '', 'string', 'general', 'Google Analytics Tracking Code'),
('maintenance_mode', '0', 'boolean', 'general', 'Wartungsmodus aktivieren'),
('default_background', '1', 'number', 'design', 'Standard-Hintergrundbild ID');

-- Insert default social media platforms
INSERT INTO social_media (platform, url, icon, display_order, enabled) VALUES
('Facebook', 'https://facebook.com/matthiassilberhain', 'facebook', 1, 1),
('Twitter', 'https://twitter.com/msilberhain', 'twitter', 2, 1),
('Instagram', 'https://instagram.com/matthiassilberhain', 'instagram', 3, 1),
('Goodreads', 'https://goodreads.com/matthiassilberhain', 'book', 4, 1);

-- Insert sample books
INSERT INTO books (title, author, description, cover_image, sample_pdf, purchase_link, published, featured) VALUES
('Der Schatten des Nordens', 'Matthias Silberhain', 'Ein epischer Fantasy-Roman über die Abenteuer eines jungen Helden in einer vergessenen Welt.', '/assets/images/books/book1.jpg', '/docs/samples/book1.pdf', 'https://example.com/shop/book1', 1, 1),
('Die Chroniken von Arkania', 'Matthias Silberhain', 'Die erste Trilogie einer spannenden Fantasy-Saga über Macht, Magie und Schicksal.', '/assets/images/books/book2.jpg', '/docs/samples/book2.pdf', 'https://example.com/shop/book2', 1, 1),
('Im Zeichen des Silbermonds', 'Matthias Silberhain', 'Ein mystischer Roman über die Geheimnisse einer alten Prophezeiung und ihre Erfüllung.', '/assets/images/books/book3.jpg', '/docs/samples/book3.pdf', 'https://example.com/shop/book3', 1, 0);

-- Insert sample events
INSERT INTO events (title, description, location, event_date, event_time, link, published) VALUES
('Lesung in Berlin', 'Eine exklusive Lesung aus "Der Schatten des Nordens"', 'Buchhandlung am Markt, Berlin', '2024-02-15', '19:00:00', 'https://example.com/event1', 1),
('Buchmesse Leipzig', 'Signierstunde und Gespräche', 'Leipziger Buchmesse', '2024-03-20', '14:00:00', 'https://example.com/event2', 1),
('Online-Lesung', 'Live-Lesung auf YouTube', 'Online', '2024-01-30', '20:00:00', 'https://youtube.com/c/matthiassilberhain', 1);

-- Create admin user (change password in production!)
-- Note: In production, use a secure password hash
INSERT INTO settings (setting_key, setting_value, setting_type, category, description) VALUES
('admin_username', 'admin', 'string', 'security', 'Admin Benutzername'),
('admin_password_hash', '$2y$10$YourHashedPasswordHere', 'string', 'security', 'Gehashtes Admin Passwort');

-- Create a view for dashboard statistics
CREATE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM books WHERE published = 1) as published_books,
    (SELECT COUNT(*) FROM books WHERE featured = 1) as featured_books,
    (SELECT COUNT(*) FROM events WHERE published = 1 AND event_date >= CURDATE()) as upcoming_events,
    (SELECT COUNT(*) FROM social_media WHERE enabled = 1) as active_social_profiles,
    (SELECT COUNT(*) FROM visitor_logs WHERE DATE(visit_time) = CURDATE()) as today_visitors;

-- Create indexes for performance
CREATE INDEX idx_books_updated ON books(updated_at);
CREATE INDEX idx_events_upcoming ON events(event_date) WHERE published = 1 AND event_date >= CURDATE();
CREATE INDEX idx_social_order ON social_media(display_order) WHERE enabled = 1;