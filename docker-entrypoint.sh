#!/bin/sh

# Exit on error
set -e

if [ -n "${TEMPLATE_TARGET}" ] && [ -n "${MEDIA_TARGET}" ]; then
  echo "Copying demo assets to Caspar paths"
  rsync -a /caspar/sofie-demo-template/ "${TEMPLATE_TARGET}/"
  rsync -a /caspar/sofie-demo-media/ "${MEDIA_TARGET}/"
  echo "Demo assets copied"
  exit 0
fi

cat <<'EOF'
Sofie demo CasparCG assets are available in this image:

  /caspar/sofie-demo-template  → Caspar <template-path>
  /caspar/sofie-demo-media     → Caspar <media-path>

To copy them into mounted Caspar folders, set:

  TEMPLATE_TARGET=/path/to/template
  MEDIA_TARGET=/path/to/media
EOF

exit 0
