<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../classes/BookManager.php';

header('Content-Type: application/json');

// Authentifizierung prüfen (nur für schreibende und administrative Operationen)
$requires_auth = in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'DELETE']);
if ($requires_auth && !isset($_SESSION['admin_authenticated'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_SERVER['REQUEST_URI'];

// Entferne den Basis-Pfad
$base_path = '/api/endpoints';
if (strpos($endpoint, $base_path) === 0) {
    $endpoint = substr($endpoint, strlen($base_path));
}

// Buch-Manager-Instanz
$bookManager = new BookManager(get_db_connection());

// Routing
if (preg_match('/^\/books\/?$/', $endpoint)) {
    if ($method === 'GET') {
        // Alle Bücher abrufen
        $books = $bookManager->getAllBooks();
        echo json_encode($books);
    } elseif ($method === 'POST') {
        // Neues Buch erstellen
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $bookManager->createBook($input);
        if ($result) {
            http_response_code(201);
            echo json_encode(['success' => true, 'book' => $result]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Failed to create book']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
} elseif (preg_match('/^\/books\/(\d+)\/?$/', $endpoint, $matches)) {
    $bookId = (int)$matches[1];
    
    if ($method === 'GET') {
        // Einzelnes Buch abrufen
        $book = $bookManager->getBookById($bookId);
        if ($book) {
            echo json_encode($book);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Book not found']);
        }
    } elseif ($method === 'PUT') {
        // Buch aktualisieren
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $bookManager->updateBook($bookId, $input);
        if ($result) {
            echo json_encode(['success' => true, 'book' => $result]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Failed to update book']);
        }
    } elseif ($method === 'DELETE') {
        // Buch löschen
        $result = $bookManager->deleteBook($bookId);
        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Failed to delete book']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}
?>