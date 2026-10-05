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

La publicación en GitHub se verifica después de crear el commit mediante la
coincidencia entre `git rev-parse HEAD` y `git ls-remote origin refs/heads/main`.

Render mostró la pantalla de inicio de sesión al consultar el panel. No se ha
creado un servicio ni verificado una URL pública o logs de Render. Para completar
estos pasos se necesita una sesión de Render con acceso al repositorio. La
configuración exacta y las capturas requeridas están en `README.md`.

No confundir las pruebas locales satisfactorias con un despliegue público completado.
