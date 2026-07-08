#!/usr/bin/env bash
# Cloud agent bootstrap for sofie-demo-assets.
# Run from repo root during environment setup or first agent turn.
set -euo pipefail

export NODE_OPTIONS="${NODE_OPTIONS:---openssl-legacy-provider}"

if command -v nvm >/dev/null 2>&1 || [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  if [ -f .node-version ]; then
    nvm install "$(tr -d '[:space:]' < .node-version)"
    nvm use "$(tr -d '[:space:]' < .node-version)"
  else
    nvm install 22
    nvm use 22
  fi
fi

yarn install
yarn lint
yarn build
