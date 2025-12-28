#!/bin/bash
# Build script for Encrypted Medical Notes
# Run this on a desktop machine (not mobile)

set -e

echo "🏥 Building Encrypted Medical Notes..."
echo "======================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Found: $(node -v)"
    exit 1
fi

echo "✅ Node.js: $(node -v)"

# Create dist directories
mkdir -p dist/cli dist/electron

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build CLI executables
echo ""
echo "🔧 Building CLI executables..."

echo "  → Windows x64..."
npx pkg src/index.js --target node18-win-x64 --output dist/cli/medical-notes-win.exe

echo "  → macOS x64..."
npx pkg src/index.js --target node18-macos-x64 --output dist/cli/medical-notes-macos

echo "  → Linux x64..."
npx pkg src/index.js --target node18-linux-x64 --output dist/cli/medical-notes-linux

echo ""
echo "✅ CLI builds complete!"
ls -la dist/cli/

# Build Electron app (optional)
echo ""
read -p "Build Electron desktop app? (y/n): " BUILD_ELECTRON

if [ "$BUILD_ELECTRON" = "y" ]; then
    echo ""
    echo "🖥️  Building Electron app..."

    # Detect platform
    case "$(uname -s)" in
        Darwin*)  PLATFORM="mac" ;;
        Linux*)   PLATFORM="linux" ;;
        MINGW*|CYGWIN*|MSYS*) PLATFORM="win" ;;
        *)        PLATFORM="linux" ;;
    esac

    echo "  → Building for $PLATFORM..."
    npx electron-builder --$PLATFORM

    echo ""
    echo "✅ Electron build complete!"
    ls -la dist/electron/
fi

echo ""
echo "======================================="
echo "🎉 Build complete!"
echo ""
echo "CLI executables: dist/cli/"
echo "Electron app:    dist/electron/"
echo ""
