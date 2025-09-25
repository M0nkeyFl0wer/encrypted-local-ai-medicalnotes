#!/bin/bash

echo ""
echo "========================================"
echo "   ENCRYPTED MEDICAL NOTES SYSTEM"
echo "   HIPAA Compliant Testing Version"
echo "========================================"
echo ""

echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed on this system."
    echo "Please download Node.js from https://nodejs.org/"
    echo "Choose the LTS version and install it."
    echo "Then run this script again."
    echo ""
    read -p "Press any key to exit..."
    exit 1
fi

echo "Node.js found! Installing dependencies..."
npm install --only=production --silent

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies."
    echo "Please check your internet connection and try again."
    echo ""
    read -p "Press any key to exit..."
    exit 1
fi

echo ""
echo "Starting Medical Notes System..."
echo "Press Ctrl+C to stop the system when done testing."
echo ""
node src/index.js

echo ""
echo "Medical Notes System has stopped."
echo "All medical data remains securely encrypted on this computer."
read -p "Press any key to exit..."