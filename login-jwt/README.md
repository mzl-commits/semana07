# Tarea del Laboratorio 8: desplegar el login de la semana 7

Version preparada desde `usnayo/smeana07`; se conserva el frontend y su CSS original.
Esta carpeta se publica en `mzl-commits/semana07`, rama `main`, junto al laboratorio
`despliegue01`. El registro de pruebas y la URL final estan en `VALIDACION.md`.

## Revision del proyecto existente

| Elemento | Tecnologia / archivo |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 6, Axios; `tarea/src/App.jsx` |
| Apariencia | `tarea/src/index.css`; se conserva el diseño azul y naranja |
| Backend | Node.js, Express 5; `server.js` |
| Autenticacion | JWT de acceso, refresh token y bcrypt para contraseñas |
| Persistencia | Sequelize 6; MySQL local y PostgreSQL en Render |
| Modelos | `app/models/`: usuario, rol, refresh token y tabla intermedia |
| Configuracion | `app/config/`, `.env` local y variables privadas en Render |
| Ejecucion original | Backend `npm start`; frontend `npm run dev` dentro de `tarea` |

Se corrigieron la URL fija `localhost` del frontend, la ausencia de carga de dotenv,
la clave JWT fija, la perdida de la sesion al recargar la pagina y el permiso de
elegir administrador en el registro publico. Se agregaron rutas directas de React
y el proceso de construccion. Se actualizo la dependencia indirecta uuid mediante
un override compatible con Sequelize, conservando la tecnologia existente.

## Estructura

```text
login-jwt/
├── server.js
├── package.json
├── package-lock.json
├── .node-version
├── .gitignore
├── .env.example
├── .env                       # Privado; ignorado
├── .env.render                # Conexion externa de prueba; privado e ignorado
├── app/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   └── routes/
├── database/schema.sql        # Solo estructura y roles
├── scripts/
│   ├── database-check.js
│   └── verify-api.js
├── tarea/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── src/
├── render.yaml
├── README.md
├── VALIDACION.md
└── INFORME-Y-VIDEO.md
```

Los directorios `node_modules`, `tarea/dist` y `evidencias` solo se generan localmente
o en Render y estan ignorados. No se publican documentos antiguos, bases locales
completas, contraseñas, tokens, ni usuarios privados.

## Ejecucion local

1. Inicia MySQL de XAMPP (puerto 3306).
2. Abre una terminal en `usnayo/semana8/login-jwt`.
3. Ejecuta:

```powershell
npm ci
npm run build
npm start
```

Abre http://localhost:8080. El backend sirve el frontend compilado y la API desde
el mismo origen. El `.env` local preparado utiliza una base nueva llamada
`laboratorio_jwt_despliegue`; no altera la base original de semana 7.

Para desarrollar con recarga automatica usa `npm run dev` en la raiz y, en otra
terminal, `npm --prefix tarea run dev`. Vite redirige `/api` al backend local;
esa configuracion se utiliza solo durante el desarrollo. La version de produccion
utiliza `/api` y no depende de localhost.

En otra computadora, copia `.env.example` a `.env` y genera una clave JWT privada:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Guarda el resultado en `JWT_SECRET`. Para crear demos, define `SEED_DEMO=true` y una
`DEMO_PASSWORD` aleatoria de al menos 12 caracteres. Las cuentas son `demo_user`,
`demo_moderator` y `demo_admin`, con sus roles respectivos. Las contraseñas se
almacenan en la base mediante hash bcrypt; no hay claves incluidas en el codigo.

## Base de datos alojada

Render Postgres conserva las tablas `users`, `roles`, `user_roles` y `refreshTokens`.
Sequelize crea las tablas faltantes y los roles sin borrar datos al iniciar. Las
cuentas demo se crean una sola vez si no existen; reiniciar el servicio no cambia
sus contraseñas ni duplica usuarios. `database/schema.sql` permite revisar la
estructura PostgreSQL sin exponer datos de la base.

`DATABASE_URL` selecciona PostgreSQL; si esta vacia, se utiliza MySQL. En Render,
la URL interna conecta el backend con la base en la misma region, sin trafico
externo. Para una conexion externa con TLS usa `DB_SSL=true`.

## Git y GitHub

Desde `usnayo/semana8`:

```powershell
git status
git branch --show-current
git remote -v
git check-ignore login-jwt/.env login-jwt/.env.render login-jwt/node_modules/ login-jwt/tarea/dist/
git add login-jwt
git diff --cached --name-only
git diff --cached --check
git commit -m "Preparar login de semana 7 para despliegue"
git push origin main
```

Antes del commit, comprueba que solo se incluyen fuentes, lockfiles, modelos,
estructura SQL y documentacion. Las claves se configuran separadamente en Render.

## Configuracion de Render

1. Crea una base **Postgres Free**, nombre `semana7-login-db`, database
   `laboratorio_jwt`, en Virginia.
2. Crea un **Web Service Free** desde `https://github.com/mzl-commits/semana07`.
3. Usa estos valores:

| Campo | Valor |
| --- | --- |
| Nombre | `semana7-login` |
| Rama | `main` |
| Region | Virginia, la misma que la base |
| Runtime | Node |
| Root Directory | `login-jwt` |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Health Check | `/health` |
| NODE_ENV | `production` |
| DATABASE_URL | URL interna privada de la base |
| DB_SSL | `false` para la conexion interna |
| JWT_SECRET | Clave aleatoria privada de 32 caracteres como minimo |
| JWT_EXPIRES_IN | `30s`, para demostrar renovacion |
| SEED_DEMO | `true` durante la inicializacion de cuentas demo |
| DEMO_PASSWORD | Contraseña aleatoria privada para las cuentas demo |

No fijes `PORT`; Render lo asigna. No expongas las claves en las capturas. En una
conexion **Public Git Repository**, usa **Manual Deploy > Deploy latest commit**
para publicar cambios posteriores. `render.yaml` es una alternativa Blueprint
para crear servicios nuevos; no lo uses para duplicar los ya creados manualmente.

## Comprobaciones

```powershell
npm run check:syntax
npm audit --omit=dev
npm run db:check
npm run test:integration
```

`db:check` muestra solo tablas, roles y nombres de demos, sin claves ni datos privados.
El test de integracion comprueba registro, duplicados, login, rutas protegidas,
roles, renovacion y cierre de sesion. Crea una cuenta ficticia con dominio
`example.com` por ejecucion. Para repetir contra la URL publica:

```powershell
$env:TEST_BASE_URL = "URL_REAL_DEL_SERVICIO"
npm run test:integration
Remove-Item Env:TEST_BASE_URL
```

Tambien verifica en el navegador: registrar un usuario, iniciar sesion, cargar
contenido, esperar mas de 30 segundos y cargar otra vez, recargar la pagina,
cerrar sesion y comprobar que no se puede acceder a `/user` sin login.

## Evidencias y video

`INFORME-Y-VIDEO.md` contiene la lista ordenada de capturas con titulos, el guion
de cuatro minutos, observaciones y conclusiones. Los resultados reales de las
pruebas y los enlaces finales se registran en `VALIDACION.md`.

La base gratuita caduca 30 dias despues de su creacion. El Web Service gratuito
puede tardar en responder tras un periodo de inactividad. Estas condiciones deben
mencionarse en el informe y no equivalen a un servicio permanente de produccion.
Fuentes: [Render Free](https://render.com/docs/free),
[Render Postgres](https://render.com/docs/postgresql-creating-connecting).
