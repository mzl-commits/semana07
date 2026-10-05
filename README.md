# Laboratorio N.° 8: despliegue de aplicaciones

Proyecto **despliegue01**, preparado para GitHub y un Web Service en Render.
Repositorio indicado: https://github.com/mzl-commits/semana07

**Aplicación pública comprobada:** https://despliegue01-pab4.onrender.com

**Estado del servidor:** https://despliegue01-pab4.onrender.com/health

**Servicio en Render:** https://dashboard.render.com/web/srv-db225k4s728c73aq1uq0

El servicio gratuito se creó usando **Public Git Repository**, con el repositorio
indicado y la rama `main`. Para publicar nuevos cambios, usa **Manual Deploy > Deploy
latest commit** en Render. La integración automática con GitHub requiere conectar
la cuenta propietaria del repositorio o usar la opción de Blueprint correspondiente.

Se desarrolla la parte de laboratorio descrita en las instrucciones: una aplicación
Node.js sencilla, Yarn, Nodemon, dotenv, Git y preparación para Render. El documento
no solicita implementar endpoints JWT en esta parte; el proyecto no incluye autenticación.

## Estructura

```text
semana8/                         # Raíz del repositorio Git; rama main
├── .gitignore
├── README.md
├── VALIDACION.md
├── render.yaml
└── despliegue01/
    ├── index.js
    ├── package.json
    ├── yarn.lock
    ├── .node-version
    ├── .env.example
    ├── .gitignore
    ├── .env                    # Solo local; ignorado por Git
    └── node_modules/           # Solo local; ignorado por Git
```

La carpeta local `evidencias/`, también ignorada por Git, contiene capturas del
despliegue y de la aplicación pública.

## 1. Aplicación Node.js

`index.js` utiliza el servidor HTTP de Node.js. `GET /` muestra una página en español
con el mensaje «¡Hola, mundo!» y el nombre del proyecto. `GET /health` devuelve
`{"status":"ok","application":"despliegue01"}`. Las rutas inexistentes responden 404.

Se carga `.env` mediante dotenv. El puerto es `process.env.PORT` o, si no está definido,
3000. El servidor escucha en `0.0.0.0` para ser accesible desde Render. Un `PORT` ya
definido por el entorno tiene prioridad sobre `.env`.

## 2. Git

El repositorio se clonó dentro de `usnayo/semana8`; no hace falta ejecutar `git init`
de nuevo. La rama es `main` y `origin` apunta al repositorio indicado. No se modifica
la configuración global de Git.

Desde `semana8`:

```powershell
git status
git branch --show-current
git remote -v
git check-ignore despliegue01/.env despliegue01/node_modules/
```

## 3. Yarn

Requisitos: Node.js 22, 24 o 26 y Yarn Classic 1.22.22. Render usa Node.js 24 por el
archivo `.node-version`. Para instalar Yarn si no está disponible:

```powershell
npm install --global yarn@1.22.22
```

Desde `semana8/despliegue01`:

```powershell
yarn install --frozen-lockfile
```

En Windows, si PowerShell bloquea el archivo `yarn.ps1`, usa `yarn.cmd` con los mismos
argumentos, sin cambiar la política de ejecución del sistema.

## 4. Nodemon

Nodemon es una dependencia de desarrollo. El script observa `index.js` y reinicia
el servidor al guardar cambios:

```powershell
yarn dev
```

Abre http://localhost:3000. Para demostrar el reinicio, cambia temporalmente el
mensaje «¡Hola, mundo!» en `index.js`, guarda, comprueba `restarting due to changes...`
en la terminal y actualiza el navegador. Después restaura el mensaje. Detén con Ctrl+C.

## 5. dotenv

El archivo `.env` local ya está creado. Para reproducirlo en otra computadora:

```powershell
Copy-Item .env.example .env
```

```dotenv
PORT=3000
NODE_ENV=development
```

No subas `.env`. `.env.example` solo contiene valores de ejemplo y sí se versiona.

## 6. .gitignore

Tanto la raíz como el proyecto ignoran `node_modules/`, `.env`, variantes locales de
`.env` y logs. Antes de subir cambios, revisa:

```powershell
git status --short
git diff --cached --name-only
git ls-files
```

Los archivos ignorados deben quedar fuera de los archivos preparados y versionados.

## 7. Comprobar ejecución

Después de detener Nodemon:

```powershell
yarn check:syntax
yarn start
```

Visita http://localhost:3000 y http://localhost:3000/health. Para demostrar que el
puerto del entorno tiene prioridad:

```powershell
$env:PORT = "3100"
yarn start
```

Visita http://localhost:3100. Detén el servidor y elimina la variable de esa sesión:

```powershell
Remove-Item Env:PORT
```

También funciona con `yarn install --production=true --frozen-lockfile`: el inicio
de producción solo necesita dotenv; Nodemon no es necesario.

## 8. GitHub

Desde `semana8`, revisa los archivos preparados antes de hacer commit:

```powershell
git add .
git status
git diff --cached --name-only
git commit -m "Listo para ir a GitHub"
git push -u origin main
git log --oneline
```

Verifica en https://github.com/mzl-commits/semana07 que aparezcan `despliegue01/index.js`,
`package.json`, `yarn.lock` y `.gitignore`, junto con `render.yaml`. No deben aparecer
`.env` ni `node_modules`. Si GitHub rechaza el push por permisos, autentica Git con
una cuenta que pueda escribir en `mzl-commits/semana07` y repite el push.

## 9. Preparación para Render

### Configuración manual

1. Inicia sesión en https://dashboard.render.com.
2. Selecciona **New > Web Service** y conecta el repositorio `mzl-commits/semana07`.
3. Configura los siguientes valores:

| Campo | Valor |
| --- | --- |
| Name | `despliegue01` (u otro nombre disponible) |
| Branch | `main` |
| Language / Runtime | `Node` |
| Root Directory | `despliegue01` |
| Build Command | `yarn install --frozen-lockfile` |
| Start Command | `yarn start` |
| Instance Type | `Free`, si está disponible para tu cuenta |
| Health Check Path | `/health` |
| Environment | `NODE_ENV=production` |

4. Crea el servicio y espera que termine el despliegue. No fijes `PORT`: Render lo asigna.
5. Abre la URL **real** que Render muestre para el servicio; no se puede anticipar el nombre.
6. Comprueba la página principal y `/health`, y revisa los logs.

### Blueprint

También puedes usar **New > Blueprint**, conectar el repositorio y seleccionar
`render.yaml` en la raíz. El archivo ya define el directorio, los comandos y `/health`.

La configuración sigue la [guía oficial de Node.js en Render](https://render.com/docs/deploy-node-express-app)
y la [configuración de versión de Node.js](https://render.com/docs/node-version).

## 10. Validación y evidencias

El estado de las verificaciones realizadas está en `VALIDACION.md`. El despliegue
solo se considera exitoso cuando Render muestra el servicio activo y su URL responde.

Toma estas capturas para el informe, en este orden:

1. **Carpeta del proyecto:** explorador con `semana8/despliegue01` expandido; mostrar
   `index.js`, `package.json`, `yarn.lock`, `.env`, `.gitignore` y `node_modules`.
2. **Código:** `index.js`, mostrando dotenv, `process.env.PORT`, puerto alternativo
   y `server.listen(PORT, "0.0.0.0", ...)`.
3. **Paquetes:** `package.json`, con los scripts `dev` y `start`, dotenv y Nodemon.
4. **Archivos ignorados:** `.gitignore` abierto mostrando `.env` y `node_modules/`.
5. **Desarrollo:** terminal con `yarn dev`, Nodemon y el mensaje del puerto.
6. **Reinicio:** terminal con `restarting due to changes...` después de guardar `index.js`.
7. **Producción local:** terminal con `yarn start` y la aplicación en el navegador.
8. **Git:** terminal con `git status`, `git branch --show-current` y `git check-ignore`;
   debe verse `main`, el estado y que los archivos locales están ignorados.
9. **Commit:** terminal con `git log --oneline -5` y el mensaje del commit.
10. **GitHub:** página del repositorio en `main`, incluyendo el commit y la carpeta
    `despliegue01`; otra captura de sus archivos sin `.env` ni `node_modules`.
11. **Render / configuración:** pantalla con repositorio, rama, Root Directory,
    Build Command y Start Command.
12. **Deploy exitoso:** pantalla de Render mostrando el último deploy activo/exitoso.
13. **URL pública:** navegador con la URL de Render visible y la página funcionando.
14. **Logs de Render:** salida de instalación, `yarn start` y el mensaje de inicio sin errores.

GitHub y el primer despliegue en Render ya se completaron y comprobaron. Usa las
capturas guardadas en `evidencias/` como apoyo y toma las restantes de esta lista.
