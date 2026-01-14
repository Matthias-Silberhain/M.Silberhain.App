-- Database Schema for Matthias Silberhain Website
-- Created: 2024-01-14

-- Create database
CREATE DATABASE IF NOT EXISTS `silberhain_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `silberhain_db`;

-- Users table (for admin access)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `role` ENUM('admin', 'editor') DEFAULT 'editor',
    `last_login` DATETIME DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` BOOLEAN DEFAULT TRUE,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Books table
CREATE TABLE IF NOT EXISTS `books` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `author` VARCHAR(200) DEFAULT 'Matthias Silberhain',
    `description` TEXT NOT NULL,
    `cover_image` VARCHAR(255) DEFAULT NULL,
    `sample_pdf` VARCHAR(255) DEFAULT NULL,
    `purchase_link` VARCHAR(500) DEFAULT NULL,
    `is_published` BOOLEAN DEFAULT FALSE,
    `is_featured` BOOLEAN DEFAULT FALSE,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `published_at` DATETIME DEFAULT NULL,
    INDEX idx_published (is_published),
    INDEX idx_featured (is_featured),
    INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- Events/Calendar table
CREATE TABLE IF NOT EXISTS `events` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `location` VARCHAR(200) NOT NULL,
    `address` TEXT,
    `event_date` DATE NOT NULL,
    `event_time` TIME,
    `end_date` DATE,
    `end_time` TIME,
    `event_type` ENUM('reading', 'signing', 'workshop', 'conference') DEFAULT 'reading',
    `is_public` BOOLEAN DEFAULT TRUE,
    `max_participants` INT DEFAULT NULL,
    `current_participants` INT DEFAULT 0,
    `registration_link` VARCHAR(500) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_date (event_date),
    INDEX idx_public (is_public),
    INDEX idx_type (event_type)
) ENGINE=InnoDB;

-- Social Media Links
CREATE TABLE IF NOT EXISTS `social_links` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `platform` VARCHAR(50) NOT NULL,
    `display_name` VARCHAR(100) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `icon_class` VARCHAR(50) DEFAULT 'fas fa-link',
    `sort_order` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_platform (platform),
    INDEX idx_active (is_active),
    INDEX idx_sort (sort_order)
) ENGINE=InnoDB;

-- Design Settings
CREATE TABLE IF NOT EXISTS `design_settings` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(100) NOT NULL UNIQUE,
    `setting_value` TEXT,
    `setting_type` ENUM('color', 'image', 'text', 'boolean') DEFAULT 'text',
    `category` VARCHAR(50) DEFAULT 'general',
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_category (category)
) ENGINE=InnoDB;

-- Activity Log
CREATE TABLE IF NOT EXISTS `activity_log` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED DEFAULT NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(50) DEFAULT NULL,
    `entity_id` INT UNSIGNED DEFAULT NULL,
    `details` TEXT,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Insert default admin user (change password after installation!)
-- Default password: admin123 (change immediately!)
INSERT INTO `users` (`username`, `password_hash`, `email`, `full_name`, `role`) VALUES
('admin', '$2y$10$YourHashedPasswordHere', 'admin@silberhain.de', 'Administrator', 'admin');

-- Insert default social links
INSERT INTO `social_links` (`platform`, `display_name`, `url`, `icon_class`, `sort_order`) VALUES
('facebook', 'Facebook', 'https://facebook.com/matthiassilberhain', 'fab fa-facebook', 1),
('twitter', 'Twitter', 'https://twitter.com/msilberhain', 'fab fa-twitter', 2),
('instagram', 'Instagram', 'https://instagram.com/matthiassilberhain', 'fab fa-instagram', 3),
('goodreads', 'Goodreads', 'https://goodreads.com/matthiassilberhain', 'fab fa-goodreads', 4);

-- Insert default design settings
INSERT INTO `design_settings` (`setting_key`, `setting_value`, `setting_type`, `category`, `description`) VALUES
('primary_color', '#c0c0c0', 'color', 'colors', 'Primary accent color (silver)'),
('background_color', '#000000', 'color', 'colors', 'Background color for dark theme'),
('text_color', '#c0c0c0', 'color', 'colors', 'Primary text color'),
('font_heading', 'Montserrat', 'text', 'typography', 'Heading font family'),
('font_body', 'EB Garamond', 'text', 'typography', 'Body text font family'),
('dark_mode_enabled', '1', 'boolean', 'features', 'Enable dark mode by default'),
('default_theme', 'black', 'text', 'features', 'Default theme (black or dark-gray)');
