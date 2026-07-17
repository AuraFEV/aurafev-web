# Backend de Laura (asistente de chat)

Servicio mínimo, separado del sitio estático. Su único trabajo es
guardar `ANTHROPIC_API_KEY` de forma segura en el servidor y hacer de
intermediario entre el chat del sitio y la API de Claude — esa llave
nunca puede vivir en el navegador.

No maneja pagos, no maneja WhatsApp, no guarda conversaciones en una
base de datos. Eso es a propósito: es el backend más pequeño que
resuelve el problema real (esconder la llave), nada más. El backend
más grande (pagos, WhatsApp, cuentas, pedidos) está descrito en el
`README.md` de la raíz del proyecto, bajo "Backend futuro" — puede
construirse como un tercer servicio de Render más adelante, o
fusionarse con este si en algún momento tiene sentido unificarlos.

## Desarrollo local

```bash
npm install
cp .env.example .env   # y completa ANTHROPIC_API_KEY con una llave real
npm start
```

Prueba con:
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola, ¿qué es Aura Fev?"}]}'
```

## Despliegue en Render

Este servicio vive en la carpeta `backend/` del mismo repo que el sitio
estático (monorepo). Se crea como un servicio **separado** en Render:

1. Dashboard de Render -> **New -> Web Service**.
2. Conecta el mismo repositorio de GitHub (`AuraFEV/aurafev-web`).
3. **Root Directory:** `backend`
4. **Runtime:** Node
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. En **Environment**, agrega `ANTHROPIC_API_KEY` (tu llave real) y
   `ALLOWED_ORIGIN` (`https://www.aurafev.com,https://aurafev.com` — ambos, con y sin "www", separados por coma).
8. Una vez desplegado, Render te da una URL tipo
   `https://aura-fev-chat.onrender.com` — esa es la que va en
   `API_BASE_URL` del sitio estático (variable de entorno del OTRO
   servicio, el sitio, no de este).

**Importante:** no uses el flujo de "New -> Blueprint" para crear este
servicio — el sitio estático ya se creó manualmente y no está
gestionado por Blueprint; sincronizar un Blueprint ahora podría crear
una copia duplicada de ese servicio. Créalo manual, como en el paso 1,
igual que se hizo con el sitio.
