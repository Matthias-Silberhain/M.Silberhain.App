#!/bin/bash

# Setup script for Matthias Silberhain Website

echo "Setting up website..."

# Set proper permissions
chmod 755 public/
chmod 755 admin/
chmod 755 api/
chmod 755 uploads/
chmod 755 assets/
chmod 644 logs/*.log

# Create uploads directories with write permissions
chmod 777 uploads/books
chmod 777 uploads/covers
chmod 777 uploads/backgrounds

# Create default htpasswd file placeholder
echo "# Create .htpasswd file with: htpasswd -c /path/to/.htpasswd username" > admin/.htpasswd.example

echo "Setup complete!"
echo "Next steps:"
echo "1. Configure database settings in api/config/config.php"
echo "2. Create .htpasswd file for admin authentication"
echo "3. Upload your logo to assets/logos/logo.png"
