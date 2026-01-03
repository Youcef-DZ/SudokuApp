#!/bin/bash
echo "🧹 Cleaning project..."

# Watchman
if command -v watchman &> /dev/null; then
    echo "Filesystem watcher: watchman watch-del-all..."
    watchman watch-del-all
fi

# Remove node_modules and locks
echo "Removing node_modules and lock files..."
rm -rf node_modules
rm -rf package-lock.json
rm -rf yarn.lock

# Remove Metro cache
echo "Removing Metro cache..."
rm -rf $TMPDIR/metro-cache
rm -rf $TMPDIR/haste-map-*

# Clean Expo cache
echo "Cleaning Expo cache..."
rm -rf .expo

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

echo "✨ Clean complete. Run 'npx expo start -c' to start."
