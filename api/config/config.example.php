<?php
/**
 * Configuration Template
 * Copy to config.php and fill with your values
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'silberhain_db');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');

// Security Configuration
define('SECRET_KEY', 'generate-a-secure-random-key-here');
define('JWT_KEY', 'generate-another-secure-key-here');

// Application Configuration
define('APP_ENV', 'production'); // or 'development'
define('SITE_URL', 'https://your-domain.com');

// Admin Credentials (change these!)
define('ADMIN_USERNAME', 'admin');
// Generate hash with: echo password_hash('your_password', PASSWORD_DEFAULT);
define('ADMIN_PASSWORD_HASH', '$2y$10$...'); 

// Don't forget to create config.php from this template!
// cp config.example.php config.php
