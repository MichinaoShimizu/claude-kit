#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
node --test scripts/sync-agent-layout.test.mjs
