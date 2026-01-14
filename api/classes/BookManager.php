<?php
/**
 * BookManager class for handling book operations
 */

class BookManager {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function getAllBooks() {
        try {
            $stmt = $this->db->query("
                SELECT * FROM books 
                ORDER BY created_at DESC
            ");
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            log_error('Failed to fetch books: ' . $e->getMessage());
            return [];
        }
    }
    
    public function getBookById($id) {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM books 
                WHERE id = :id
            ");
            $stmt->execute(['id' => $id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            log_error('Failed to fetch book: ' . $e->getMessage());
            return null;
        }
    }
    
    public function createBook($data) {
        // Validierung
        $required = ['title', 'author', 'description'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return null;
            }
        }
        
        try {
            $stmt = $this->db->prepare("
                INSERT INTO books (title, author, description, cover_image, sample_pdf, purchase_link, published, featured, created_at, updated_at)
                VALUES (:title, :author, :description, :cover_image, :sample_pdf, :purchase_link, :published, :featured, NOW(), NOW())
            ");
            
            $params = [
                'title' => sanitize($data['title']),
                'author' => sanitize($data['author']),
                'description' => sanitize($data['description']),
                'cover_image' => $data['cover_image'] ?? null,
                'sample_pdf' => $data['sample_pdf'] ?? null,
                'purchase_link' => $data['purchase_link'] ?? null,
                'published' => isset($data['published']) ? (int)$data['published'] : 0,
                'featured' => isset($data['featured']) ? (int)$data['featured'] : 0
            ];
            
            $stmt->execute($params);
            $bookId = $this->db->lastInsertId();
            return $this->getBookById($bookId);
        } catch (PDOException $e) {
            log_error('Failed to create book: ' . $e->getMessage());
            return null;
        }
    }
    
    public function updateBook($id, $data) {
        // Prüfe, ob Buch existiert
        $existing = $this->getBookById($id);
        if (!$existing) {
            return null;
        }
        
        try {
            $fields = [];
            $params = ['id' => $id];
            
            if (isset($data['title'])) {
                $fields[] = 'title = :title';
                $params['title'] = sanitize($data['title']);
            }
            if (isset($data['author'])) {
                $fields[] = 'author = :author';
                $params['author'] = sanitize($data['author']);
            }
            if (isset($data['description'])) {
                $fields[] = 'description = :description';
                $params['description'] = sanitize($data['description']);
            }
            if (isset($data['cover_image'])) {
                $fields[] = 'cover_image = :cover_image';
                $params['cover_image'] = $data['cover_image'];
            }
            if (isset($data['sample_pdf'])) {
                $fields[] = 'sample_pdf = :sample_pdf';
                $params['sample_pdf'] = $data['sample_pdf'];
            }
            if (isset($data['purchase_link'])) {
                $fields[] = 'purchase_link = :purchase_link';
                $params['purchase_link'] = $data['purchase_link'];
            }
            if (isset($data['published'])) {
                $fields[] = 'published = :published';
                $params['published'] = (int)$data['published'];
            }
            if (isset($data['featured'])) {
                $fields[] = 'featured = :featured';
                $params['featured'] = (int)$data['featured'];
            }
            
            // Aktualisiere updated_at
            $fields[] = 'updated_at = NOW()';
            
            if (empty($fields)) {
                return $existing; // Nichts zu aktualisieren
            }
            
            $sql = "UPDATE books SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            
            return $this->getBookById($id);
        } catch (PDOException $e) {
            log_error('Failed to update book: ' . $e->getMessage());
            return null;
        }
    }
    
    public function deleteBook($id) {
        try {
            $stmt = $this->db->prepare("DELETE FROM books WHERE id = :id");
            $stmt->execute(['id' => $id]);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            log_error('Failed to delete book: ' . $e->getMessage());
            return false;
        }
    }
}
?>