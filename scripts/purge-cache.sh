#!/usr/bin/env bash
# Purge Cloudflare cache for mostro360.com after every deployment.
#
# Usage:
#   CF_API_TOKEN=<your-token> bash scripts/purge-cache.sh
#
# Required env vars:
#   CF_API_TOKEN  — Cloudflare API token with Zone:Cache Purge permission
#   CF_ZONE_ID    — Zone ID from Cloudflare Dashboard → Overview (right sidebar)
#                   Can also be hardcoded below if you prefer.
#
# How to get these values: see README.md → "Cloudflare cache purge setup"

set -euo pipefail

ZONE_ID="${CF_ZONE_ID:?CF_ZONE_ID is not set. See README.md for setup instructions.}"
TOKEN="${CF_API_TOKEN:?CF_API_TOKEN is not set. See README.md for setup instructions.}"

echo "Purging Cloudflare cache for zone ${ZONE_ID}..."

RESPONSE=$(curl -s -X POST \
  "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}')

SUCCESS=$(echo "$RESPONSE" | grep -o '"success":[a-z]*' | cut -d: -f2)

if [ "$SUCCESS" = "true" ]; then
  echo "Cache purged successfully."
else
  echo "Purge failed. Cloudflare response:"
  echo "$RESPONSE"
  exit 1
fi
