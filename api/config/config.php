<?php
/**
 * Configuration File for Matthias Silberhain Website API
 * WARNING: Never commit actual credentials to version control
 */

// Database Configuration
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'silberhain_db');
define('DB_USER', getenv('DB_USER') ?: 'silberhain_user');
define('DB_PASS', getenv('DB_PASS') ?: 'secure_password_here');

// Application Configuration
define('APP_NAME', 'Matthias Silberhain Website');
define('APP_VERSION', '1.0.0');
define('APP_ENV', getenv('APP_ENV') ?: 'production');
define('APP_DEBUG', APP_ENV === 'development');

// Security Configuration
define('SECRET_KEY', getenv('SECRET_KEY') ?: 'your-secret-key-here-change-in-production');
define('JWT_KEY', getenv('JWT_KEY') ?: 'your-jwt-key-here-change-in-production');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRE', 86400); // 24 hours in seconds

// File Upload Configuration
define('UPLOAD_MAX_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
define('ALLOWED_DOC_TYPES', ['application/pdf']);
define('UPLOAD_PATH', dirname(__DIR__, 2) . '/uploads/');

// Admin Configuration
define('ADMIN_USERNAME', getenv('ADMIN_USERNAME') ?: 'admin');
define('ADMIN_PASSWORD_HASH', getenv('ADMIN_PASSWORD_HASH') ?: 
    password_hash('admin', PASSWORD_DEFAULT)); // Change in production

// Website Configuration
define('SITE_URL', getenv('SITE_URL') ?: 'https://matthias-silberhain.de');
define('SITE_NAME', 'Matthias Silberhain');
define('SITE_EMAIL', 'kontakt@silberhain.de');

// CORS Configuration
$allowed_origins = [
    'https://matthias-silberhain.de',
    'https://www.matthias-silberhain.de',
    'http://localhost:3000',
    'http://localhost:8080'
];

// Error Reporting
if (APP_DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('Europe/Berlin');

// Set custom error handler
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    if (APP_DEBUG) {
        error_log("Error [$errno]: $errstr in $errfile on line $errline");
    }
    
    // Don't execute PHP internal error handler
    return true;
});

// Set exception handler
set_exception_handler(function($exception) {
    http_response_code(500);
    header('Content-Type: application/json');
    
    $response = [
        'status' => 'error',
        'message' => 'Internal Server Error'
    ];
    
    if (APP_DEBUG) {
        $response['debug'] = [
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTrace()
        ];
    }
    
    echo json_encode($response);
    exit;
});

// Check for required PHP extensions
$required_extensions = ['pdo', 'pdo_mysql', 'json', 'mbstring', 'fileinfo'];
foreach ($required_extensions as $ext) {
    if (!extension_loaded($ext)) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'error',
            'message' => "Required PHP extension '$ext' is not loaded"
        ]);
        exit;
    }
}

// Create uploads directory if it doesn't exist
$upload_dirs = ['books', 'covers', 'backgrounds'];
foreach ($upload_dirs as $dir) {
    $path = UPLOAD_PATH . $dir;
    if (!is_dir($path)) {
        mkdir($path, 0755, true);
    }
}

// Log file paths
define('LOG_PATH', dirname(__DIR__, 2) . '/logs/');
define('ACCESS_LOG', LOG_PATH . 'access.log');
define('ERROR_LOG', LOG_PATH . 'error.log');

// Create logs directory if it doesn't exist
if (!is_dir(LOG_PATH)) {
    mkdir(LOG_PATH, 0755, true);
}

/**
 * Log a message to the error log
 */
function log_error($message, $context = []) {
    $log_entry = sprintf(
        "[%s] %s %s\n",
        date('Y-m-d H:i:s'),
        $message,
        !empty($context) ? json_encode($context) : ''
    );
    
    file_put_contents(ERROR_LOG, $log_entry, FILE_APPEND);
}

/**
 * Log an access request
 */
function log_access($method, $endpoint, $ip, $user_agent, $response_code) {
    $log_entry = sprintf(
        "%s - - [%s] \"%s %s\" %d \"%s\" \"%s\"\n",
        $ip,
        date('d/M/Y:H:i:s O'),
        $method,
        $endpoint,
        $response_code,
        '-', // Referrer
        $user_agent
    );
    
    file_put_contents(ACCESS_LOG, $log_entry, FILE_APPEND);
}

/**
 * Get database connection
 */
function get_db_connection() {
    static $connection = null;
    
    if ($connection === null) {
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
                DB_HOST,
                DB_PORT,
                DB_NAME
            );
            
            $connection = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
            
            // Set timezone for the connection
            $connection->exec("SET time_zone = '+01:00'");
            
        } catch (PDOException $e) {
            log_error('Database connection failed: ' . $e->getMessage());
            throw new Exception('Database connection failed');
        }
    }
    
    return $connection;
}

/**
 * Sanitize input data
 */
function sanitize($data) {
    if (is_array($data)) {
        return array_map('sanitize', $data);
    }
    
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate and sanitize file upload
 */
function validate_upload($file, $allowed_types, $max_size = UPLOAD_MAX_SIZE) {
    $errors = [];
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'Upload error: ' . $file['error'];
        return $errors;
    }
    
    if ($file['size'] > $max_size) {
        $errors[] = 'File too large. Maximum size: ' . ($max_size / 1024 / 1024) . 'MB';
    }
    
    if (!in_array($file['type'], $allowed_types)) {
        $errors[] = 'Invalid file type. Allowed: ' . implode(', ', $allowed_types);
    }
    
    // Additional check for image files
    if (strpos($file['type'], 'image/') === 0) {
        $image_info = getimagesize($file['tmp_name']);
        if (!$image_info) {
            $errors[] = 'Invalid image file';
        }
    }
    
    return $errors;
}

/**
 * Generate a secure random string
 */
function generate_token($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

/**
 * Send JSON response
 */
function json_response($data, $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

/**
 * Check if request is from allowed origin
 */
function check_cors_origin() {
    global $allowed_origins;
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Max-Age: 86400'); // 24 hours
        http_response_code(200);
        exit;
    }
}

// Enable CORS
check_cors_origin();

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 86400,
        'path' => '/',
        'domain' => parse_url(SITE_URL, PHP_URL_HOST),
        'secure' => APP_ENV === 'production',
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
    session_start();
}

// Set security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

if (APP_ENV === 'production') {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}

// Log the request
register_shutdown_function(function() {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN';
    $endpoint = $_SERVER['REQUEST_URI'] ?? '/';
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    $response_code = http_response_code();
    
    log_access($method, $endpoint, $ip, $user_agent, $response_code);
});
?>