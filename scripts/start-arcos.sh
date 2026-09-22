#!/bin/bash

# ARC OS Background Startup Launcher Script
# Ensures http://127.0.0.1:5173 is active without starting duplicate processes

PROJECT_DIR="/Users/shubhpratpsingh/Desktop/Winter Arc"
URL="http://127.0.0.1:5173"

echo "[ARC OS] Checking if local server is running on $URL..."

if curl -s -m 2 "$URL" > /dev/null 2>&1; then
  echo "[ARC OS] Local server is already running on $URL."
  exit 0
else
  echo "[ARC OS] Server not responding. Starting background Vite server..."
  cd "$PROJECT_DIR" || exit 1
  mkdir -p "$PROJECT_DIR/scratch"
  nohup /opt/homebrew/bin/npm run arc > "$PROJECT_DIR/scratch/arcos_server.log" 2>&1 &
  disown $! 2>/dev/null
  echo "[ARC OS] Vite server process launched in background."
  sleep 2
  if curl -s -m 2 "$URL" > /dev/null 2>&1; then
    echo "[ARC OS] Success: $URL is now online!"
  fi
fi
