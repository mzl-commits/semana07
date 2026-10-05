# Validación del laboratorio

Fecha: 5 de octubre de 2026 (America/Lima).

## Verificaciones locales realizadas

| Comprobación | Resultado |
| --- | --- |
| Node.js y Yarn | Node.js 26.1.0; Yarn 1.22.22 instalado |
| Instalación con `yarn.lock` | Correcta con `--frozen-lockfile` |
| `yarn check:syntax` | Correcto; `node --check index.js` sin errores |
| `yarn dev` | Correcto; Nodemon 3.1.14 ejecuta `index.js` en puerto 3000 |
| Reinicio automático | Cambio real del mensaje en `index.js`; Nodemon mostró `restarting due to changes...`, inició de nuevo y la respuesta HTTP reflejó la restauración del mensaje |
| `GET /` | HTTP 200 y página HTML en español |
| `GET /health` | HTTP 200; `status: ok`, `application: despliegue01` |
| `GET /no-existe` | HTTP 404 |
| `POST /` | HTTP 405 |
| `HEAD /` | HTTP 200 |
| `yarn start` con `PORT=3100` | HTTP 200 y `/health` correcto en puerto 3100, aunque `.env` contiene 3000 |
| Instalación de producción | Correcta; dotenv disponible, Nodemon ausente de `node_modules` |
| Inicio sin `.env` ni Nodemon | Correcto; HTTP 200 con `yarn start` en puerto alternativo 3000 |
| Restauración local | `.env` restaurado y dependencias de desarrollo reinstaladas |
| `.env` y `node_modules` ignorados | Confirmado mediante `git check-ignore` y revisión de archivos preparados |
| Rama y remoto | `main`; `origin` = `https://github.com/mzl-commits/semana07.git` |
| Configuración Render | `render.yaml`, Root Directory `despliegue01`, Node 24, instalación con lockfile, inicio y health check definidos |

El primer intento de comprobar Nodemon dentro del entorno restringido no pudo
completar el reinicio. La prueba se repitió con acceso autorizado a procesos y red
local y fue correcta. La advertencia de Yarn sobre un `package.json` de una carpeta
superior sin licencia no proviene de este proyecto y no impide su ejecución.

## GitHub y Render

Publicación en GitHub completada. El commit `d92d412` (`Listo para ir a GitHub`)
se subió a `origin/main`; se verificó la coincidencia entre `git rev-parse HEAD`
y `git ls-remote origin refs/heads/main`, y se leyó `despliegue01/index.js`
directamente desde GitHub. `.env` y `node_modules` no están versionados.
La actualización de este registro se guarda en un commit posterior.

Tras iniciar sesión, se creó un Web Service **Free** en Render usando **Public Git
Repository** con `mzl-commits/semana07`, rama `main` y Root Directory `despliegue01`.

| Comprobación en Render | Resultado |
| --- | --- |
| Servicio | `despliegue01`; `srv-db225k4s728c73aq1uq0` |
| Primer deploy | `dep-db225kks728c73aq20d0`, commit `b2fbf91`; **Deploy succeeded** |
| Fecha del primer deploy | 5 de octubre de 2026, 17:21 (America/Lima) |
| Node.js | 24.21.0, leído desde `.node-version` |
| Yarn | 1.22.22 |
| Build | `yarn install --frozen-lockfile`; **Build successful** |
| Inicio | `yarn start`, `node index.js`; puerto asignado 10000 |
| URL pública | https://despliegue01-pab4.onrender.com; HTTP 200 y página comprobada en navegador |
| Health check | https://despliegue01-pab4.onrender.com/health; `status: ok`, `application: despliegue01` |
| Logs | Sin errores de instalación o ejecución; **Your service is live** |

Los logs incluyen el aviso de que Render no tiene credenciales para el repositorio;
el clonado público y el despliegue fueron correctos. Al usar la conexión pública,
los siguientes despliegues se pueden iniciar con **Manual Deploy > Deploy latest commit**.

Panel del deploy: https://dashboard.render.com/web/srv-db225k4s728c73aq1uq0/deploys/dep-db225kks728c73aq20d0

Las capturas del resultado están en la carpeta local `evidencias/`, ignorada por Git.
