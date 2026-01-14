<?php
/**
 * API Entry Point for Matthias Silberhain Website
 */

require_once __DIR__ . '/config/config.php';

// Log the request
$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_SERVER['REQUEST_URI'];
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// Basic routing
$request_path = parse_url($endpoint, PHP_URL_PATH);
$base_path = '/api';

// Remove base path if present
if (strpos($request_path, $base_path) === 0) {
    $request_path = substr($request_path, strlen($base_path));
}

// Route to appropriate endpoint
if (strpos($request_path, '/auth') === 0) {
    require_once __DIR__ . '/endpoints/auth.php';
} elseif (strpos($request_path, '/books') === 0) {
    require_once __DIR__ . '/endpoints/books.php';
} elseif (strpos($request_path, '/settings') === 0) {
    require_once __DIR__ . '/endpoints/settings.php';
} elseif (strpos($request_path, '/calendar') === 0) {
    require_once __DIR__ . '/endpoints/calendar.php';
} elseif (strpos($request_path, '/social') === 0) {
    require_once __DIR__ . '/endpoints/social.php';
} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => 'API endpoint not found',
        'path' => $request_path
    ]);
}
?>