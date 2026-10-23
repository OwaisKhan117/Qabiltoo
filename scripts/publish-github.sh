#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# Qabiltoo → GitHub publisher
# Creates the repo OwaisKhan117/qabiltoo (if missing) and pushes main.
#
# Usage:
#   GITHUB_TOKEN=ghp_xxx  bash scripts/publish-github.sh
#   bash scripts/publish-github.sh ghp_xxx
#
# Token needs: repo scope (classic) or Contents+Administration (fine-grained).
# ─────────────────────────────────────────────────────────────────────
set -euo pipefail

GH_USER="OwaisKhan117"
REPO_NAME="qabiltoo"
REMOTE_URL_SSH="git@github.com:${GH_USER}/${REPO_NAME}.git"

TOKEN="${1:-${GITHUB_TOKEN:-}}"
if [[ -z "$TOKEN" ]]; then
  echo "❌ No GitHub token provided."
  echo "   Usage: GITHUB_TOKEN=ghp_xxx bash scripts/publish-github.sh"
  exit 1
fi

API="https://api.github.com"
AUTH=(-H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json")

echo "🔍 Checking if ${GH_USER}/${REPO_NAME} exists..."
HTTP_CODE=$(curl -s -o /tmp/repo_check.json -w "%{http_code}" "${AUTH[@]}" "$API/repos/${GH_USER}/${REPO_NAME}")

if [[ "$HTTP_CODE" == "200" ]]; then
  echo "✅ Repository already exists."
elif [[ "$HTTP_CODE" == "404" ]]; then
  echo "📦 Creating private-turned-public-ready repo ${GH_USER}/${REPO_NAME}..."
  HTTP_CREATE=$(curl -s -o /tmp/repo_create.json -w "%{http_code}" "${AUTH[@]}" \
    -X POST "$API/user/repos" \
    -d '{
      "name": "'"$REPO_NAME"'",
      "description": "Qabiltoo — a premium Muslim matrimonial (nikah matchmaking) platform built with Next.js 16, TypeScript, Prisma & Socket.io",
      "homepage": "",
      "private": false,
      "has_issues": true,
      "has_projects": false,
      "has_wiki": false,
      "auto_init": false
    }')
  if [[ "$HTTP_CREATE" != "201" ]]; then
    echo "❌ Failed to create repo (HTTP $HTTP_CREATE):"
    cat /tmp/repo_create.json; echo
    exit 1
  fi
  echo "✅ Repository created."
else
  echo "❌ Token check failed (HTTP $HTTP_CODE). Is the token valid?"
  cat /tmp/repo_check.json; echo
  exit 1
fi

cd "$(dirname "$0")/.."

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL_SSH"
else
  git remote add origin "$REMOTE_URL_SSH"
fi
echo "🔗 Remote origin → $REMOTE_URL_SSH"

# Temporarily use token-authenticated push URL (never stored in .git/config)
PUSH_URL="https://x-access-token:${TOKEN}@github.com/${GH_USER}/${REPO_NAME}.git"

echo "🌿 Pushing main → ${GH_USER}/${REPO_NAME} ..."
git push "$PUSH_URL" main:main --force

# Clean the token out of any stored URL state
git remote set-url origin "$REMOTE_URL_SSH"

echo ""
echo "🎉 Done! Your repo is live at: https://github.com/${GH_USER}/${REPO_NAME}"
echo "   CI/CD pipeline:              https://github.com/${GH_USER}/${REPO_NAME}/actions"
echo "   Docker image (after CI):     ghcr.io/${GH_USER,,}/${REPO_NAME}:latest"
