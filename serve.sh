#!/usr/bin/env bash
# Local dev server for the presentation mockups. Port comes from dev.env
# (not .env — Claude Code's global permission settings deny reading .env*
# files as a secrets guard, and this repo has no secrets to protect).
set -euo pipefail
cd "$(dirname "$0")"

PORT="$(grep -m1 '^PORT=' dev.env | cut -d= -f2)"
PORT="${PORT:-8791}"

echo "serving $(pwd) on http://localhost:${PORT}"
python3 -m http.server "$PORT" --directory .
