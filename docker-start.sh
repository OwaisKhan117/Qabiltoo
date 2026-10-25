#!/bin/sh
# Qabiltoo container entrypoint: realtime service (:3003) + web app (:3000)
set -e

echo "🕌  Qabiltoo — starting realtime service on :3003 ..."
cd /app/mini-services/qabiltoo-realtime
bun index.ts &
RT_PID=$!

cd /app
echo "🕌  Qabiltoo — starting web app on :3000 ..."
bun server.js &
WEB_PID=$!

trap 'kill $RT_PID $WEB_PID 2>/dev/null' TERM INT
wait -n $RT_PID $WEB_PID 2>/dev/null || wait $RT_PID
