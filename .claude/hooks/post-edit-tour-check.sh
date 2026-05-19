#!/usr/bin/env bash
# Hook de Claude Code: detecta desincronización entre tourSteps.ts y data-tour-id en componentes.
# Se ejecuta después de editar archivos en src/.
# Instalar en .claude/settings.json bajo PostToolUse → matcher "Edit|Write".

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
STEPS_FILE="$FRONTEND_DIR/src/lib/tour/tourSteps.ts"

if [ ! -f "$STEPS_FILE" ]; then
  exit 0
fi

# IDs declarados en tourSteps.ts (excluye el centinela __global_welcome)
DEFINED_IDS=$(grep -oE '"[a-z][a-z0-9_-]*__[a-z][a-z0-9_-]*"' "$STEPS_FILE" \
  | tr -d '"' | sort -u)

# IDs usados en el código fuente con data-tour-id
USED_IDS=$(grep -rhoE 'data-tour-id="[a-z][a-z0-9_-]*__[a-z][a-z0-9_-]*"' \
  "$FRONTEND_DIR/src/components" "$FRONTEND_DIR/src/app" 2>/dev/null \
  | grep -oE '"[^"]*"' | tr -d '"' | sort -u)

# IDs definidos en tourSteps pero sin data-tour-id en el DOM (posibles obsoletos)
ORPHAN_DEFINED=$(comm -23 <(echo "$DEFINED_IDS") <(echo "$USED_IDS"))

# IDs con data-tour-id en el DOM pero sin paso en tourSteps (posibles nuevos elementos)
ORPHAN_USED=$(comm -13 <(echo "$DEFINED_IDS") <(echo "$USED_IDS"))

REPORT=""

if [ -n "$ORPHAN_DEFINED" ]; then
  REPORT+="--- TOUR SYNC WARNING ---\n"
  REPORT+="Pasos definidos en tourSteps.ts sin data-tour-id en el codigo:\n"
  REPORT+="$ORPHAN_DEFINED\n"
  REPORT+="Accion: verificar si el componente fue eliminado o renombrado.\n\n"
fi

if [ -n "$ORPHAN_USED" ]; then
  REPORT+="--- TOUR SYNC WARNING ---\n"
  REPORT+="Elementos con data-tour-id SIN paso en tourSteps.ts:\n"
  REPORT+="$ORPHAN_USED\n"
  REPORT+="Accion: anadir TourStep en src/lib/tour/tourSteps.ts para estos IDs.\n"
fi

if [ -n "$REPORT" ]; then
  echo -e "$REPORT"
fi

exit 0
