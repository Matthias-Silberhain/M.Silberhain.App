#!/bin/bash

# Matthias Silberhain Website Project Structure
# Ergänzt fehlende Dateien und Ordner

echo "Ergänze Projektstruktur..."

# Erstelle fehlende Ordner in public
mkdir -p public/css
mkdir -p public/js
mkdir -p public/images
mkdir -p public/fonts
mkdir -p public/assets/logos
mkdir -p public/docs/samples
mkdir -p public/assets/images/books

# Erstelle Platzhalter-Logos (falls ImageMagick nicht verfügbar, erstellen wir leere Dateien)
touch public/assets/logos/logo.png
touch public/assets/logos/logo-small.png
touch public/assets/logos/favicon.ico
touch public/assets/logos/apple-touch-icon.png

# Erstelle Platzhalter für Buchcover und PDFs
touch public/assets/images/books/book1.jpg
touch public/assets/images/books/book2.jpg
touch public/assets/images/books/book3.jpg
touch public/docs/samples/book1.pdf
touch public/docs/samples/book2.pdf
touch public/docs/samples/book3.pdf

echo "Projektstruktur ergänzt!"
echo "Bitte ersetzen Sie die Platzhalter-Logos mit Ihren eigenen Dateien:"
echo "1. logo.png (200x200) nach public/assets/logos/"
echo "2. logo-small.png (40x40) nach public/assets/logos/"
echo "3. favicon.ico (32x32) nach public/assets/logos/"
echo "4. apple-touch-icon.png (180x180) nach public/assets/logos/"
