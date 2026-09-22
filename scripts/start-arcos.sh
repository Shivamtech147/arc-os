#!/bin/bash

# ARC OS Local-First Background Launcher
PROJECT_DIR="/Users/shubhpratpsingh/arc-os"
LOG_FILE="/Users/shubhpratpsingh/.arcos/arcos_server.log"
URL="http://127.0.0.1:5173"

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

mkdir -p "/Users/shubhpratpsingh/.arcos"
mkdir -p "$PROJECT_DIR/scratch"

# If server is already active and responding, exit 0 cleanly
if curl -s -m 2 "$URL" > /dev/null 2>&1; then
  echo "[ARC OS] Server is already running on $URL." >> "$LOG_FILE"
  exit 0
fi

echo "[ARC OS] Starting background Vite server on $URL..." >> "$LOG_FILE"
cd "$PROJECT_DIR" || exit 1
exec /opt/homebrew/bin/npm run arc >> "$LOG_FILE" 2>&1
