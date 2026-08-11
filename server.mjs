// server.mjs
// Mock API basada en json-server (beta 1.0.0) con el límite de payload elevado a 5 MB.
// El límite por defecto del parser de body (milliparsec) es 100 KiB, insuficiente para
// imágenes en base64. Solo reemplazamos el handler de ese parser; el resto (rutas REST,
// paginado _page/_per_page, etc.) queda intacto.
// Uso: npm run api
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Observer } from 'json-server/lib/adapters/observer.js';
import { NormalizedAdapter } from 'json-server/lib/adapters/normalized-adapter.js';
import { createApp } from 'json-server/lib/app.js';
import { json } from 'milliparsec';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ?? 3000;
const DB_FILE = join(__dirname, 'db.json');

// Límite del body: 5 MB (un archivo de hasta 1 MB crece ~33% al codificarse en base64, y sobra margen)
const MAX_PAYLOAD = 5 * 1024 * 1024;

// Base de datos (misma configuración que el bin de json-server)
const adapter = new JSONFile(DB_FILE);
const observer = new Observer(new NormalizedAdapter(adapter));
const db = new Low(observer, {});
await db.read();

// App de json-server con todas sus rutas REST intactas
const app = createApp(db, { logger: false });

// El parser JSON de milliparsec es el último middleware "mw" de ruta "/" que agrega createApp.
// Reemplazamos su handler para subir el límite de 100 KiB → 5 MB.
const jsonMiddleware = app.middleware.findLast((m) => m.type === 'mw' && m.path === '/');
if (!jsonMiddleware) {
  throw new Error('No se encontró el middleware de parseo de body de json-server');
}
jsonMiddleware.handler = json({ payloadLimit: MAX_PAYLOAD });

app.listen(PORT, () => {
  console.log(`Mock API → http://localhost:${PORT} (payload limit: ${MAX_PAYLOAD / 1024 / 1024} MB)`);
});