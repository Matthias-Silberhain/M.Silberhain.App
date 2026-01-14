<?php
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_SERVER['REQUEST_URI'];

// Entferne den Basis-Pfad, falls vorhanden
$base_path = '/api/endpoints';
if (strpos($endpoint, $base_path) === 0) {
    $endpoint = substr($endpoint, strlen($base_path));
}

switch ($endpoint) {
    case '/auth/login':
        if ($method === 'POST') {
            handle_login();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
    case '/auth/logout':
        if ($method === 'POST') {
            handle_logout();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
    case '/auth/check':
        if ($method === 'GET') {
            handle_check_auth();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

function handle_login() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['username']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password required']);
        return;
    }
    
    $username = sanitize($data['username']);
    $password = $data['password'];
    
    // Hier: Überprüfung der Anmeldedaten
    // In einer echten Anwendung sollten Sie die Anmeldedaten gegen eine Datenbank prüfen
    // Für dieses Beispiel verwenden wir die aus der config.php
    if ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
        // Erzeuge ein Token (hier simuliert)
        $token = generate_token();
        
        // Speichere das Token in der Session
        $_SESSION['admin_token'] = $token;
        $_SESSION['admin_authenticated'] = true;
        $_SESSION['admin_username'] = $username;
        
        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'username' => $username,
                'name' => 'Administrator'
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
}

function handle_logout() {
    // Session zerstören
    session_destroy();
    
    echo json_encode(['success' => true]);
}

function handle_check_auth() {
    // Prüfe, ob der Benutzer authentifiziert ist
    if (isset($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true) {
        echo json_encode([
            'authenticated' => true,
            'user' => [
                'username' => $_SESSION['admin_username'] ?? 'admin',
                'name' => 'Administrator'
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['authenticated' => false]);
    }
}
?>