#!/usr/bin/env bash
# Render presets for The Quiet Line video pipeline.
# Run from the remotion/ directory.
set -euo pipefail

mkdir -p ../portal/public/video out/social

case "${1:-hero}" in
  hero)
    npx remotion render KitchenScene-hero ../portal/public/video/kitchen-loop.mp4 --codec=h264
    npx remotion render KitchenScene-hero ../portal/public/video/kitchen-loop.webm --codec=vp9
    npx remotion still  KitchenScene-hero --frame=0 ../portal/public/video/kitchen-poster.jpg
    ;;
  social)
    npx remotion render KitchenScene-9x16 out/social/kitchen-9x16.mp4 --codec=h264
    npx remotion render KitchenScene-1x1  out/social/kitchen-1x1.mp4  --codec=h264
    npx remotion render KitchenScene-16x9 out/social/kitchen-16x9.mp4 --codec=h264
    ;;
  all)
    "$0" hero
    "$0" social
    ;;
  *)
    echo "Usage: $0 {hero|social|all}" >&2
    exit 2
    ;;
esac
