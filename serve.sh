#!/usr/bin/env bash
cd "$(dirname "$0")"
for port in 8080 8081 8765; do
  if ! ss -tln | grep -q ":${port} "; then
    echo "Open in browser: http://127.0.0.1:${port}"
    exec python3 -m http.server "$port" --bind 127.0.0.1
  fi
done
echo "Ports 8080/8081/8765 are all in use. Try: ss -tlnp | grep python"
