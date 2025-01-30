#!/bin/bash

# Install dependencies if not already installed
if ! command -v convert &> /dev/null; then
    brew install imagemagick
fi

cd "$(dirname "$0")/.."

# Generate PNGs from SVG
magick public/favicon.svg -resize 16x16 public/favicon-16x16.png
magick public/favicon.svg -resize 32x32 public/favicon-32x32.png
magick public/favicon.svg -resize 180x180 public/apple-touch-icon.png
magick public/favicon.svg -resize 192x192 public/android-chrome-192x192.png
magick public/favicon.svg -resize 512x512 public/android-chrome-512x512.png

# Generate ICO file
magick public/favicon.svg -define icon:auto-resize=16,32,48,64 public/favicon.ico 