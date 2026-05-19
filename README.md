# Biotecare Frontend

Frontend clinico para consumir el backend FastAPI de Biotecare.

## Requisitos

- Node.js 20.9 o superior
- Backend en `http://localhost:8000/api/v1`

## Desarrollo local

```bash
npm install
npm run dev
```

La app queda disponible en:

```text
http://127.0.0.1:3000
```

## Variables

El archivo `.env.local` ya apunta al backend local:

```text
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Biotecare
NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES=60
NEXT_PUBLIC_MAX_UPLOAD_MB=25
```

## Verificacion

```bash
npm run lint
npm run build
```

Ambos comandos deben pasar antes de entregar cambios.
