# Validacion real de la tarea

Preparacion local: 5 de octubre de 2026. Despliegue publico: 11 de octubre de 2026
(America/Lima).

## Comprobaciones completadas

- Codigo de semana 7 copiado conservando su CSS original y sus tecnologias.
- `npm run build`: React compilado correctamente con Vite 6.4.3.
- `npm run check:syntax`: sin errores.
- `npm audit --omit=dev`: cero vulnerabilidades tras actualizar uuid indirecto.
- `npm start`: servidor local operativo en puerto 8080 con MySQL de XAMPP.
- Se creo la base local nueva `laboratorio_jwt_despliegue`, sin cambiar la anterior.
- `npm run db:check`: tablas `users`, `roles`, `user_roles`, `refreshtokens`; roles
  `user`, `moderator`, `admin`; tres cuentas demo con roles respectivos.
- `npm run test:integration`: 38 solicitudes correctas: paginas React, health,
  registro, duplicados, login, perfil, permisos, renovacion y revocacion del refresh token.
- Pagina local abierta en navegador con el diseño original; login de `demo_user`
  redirige a `/user` correctamente.
- Tras vencer los 30 segundos del token, Cargar contenido devuelve User Content
  mediante renovacion automatica. La sesion tambien se restaura al recargar `/user`.
- CSS original comparado mediante hash: sin cambios.
- Codigo publicado en GitHub en `main`; commit inicial de la tarea `723f6c9`.
- Base PostgreSQL de Render creada: `semana7-login-db`, PostgreSQL 18, Virginia,
  plan Free, estado Available, identificador `dpg-db22g3m7bikc73c710e0-a`.
- Caducidad de la base gratuita: 4 de noviembre de 2026.

El primer intento de conexion PostgreSQL termino en ETIMEDOUT; se detecto y
corrigio que la configuracion heredaba el puerto MySQL cuando la URL no especificaba
puerto. La configuracion PostgreSQL corregida se verifico sin conectar: puerto
5432. La ejecucion completa local se verifico con MySQL instalado. La conexion
de produccion usara la URL interna entre servicios de Render.

Evidencias locales: `evidencias/login-local.png` y `evidencias/base-render.png`.
Las credenciales de las cuentas demo estan en `evidencias/credenciales-demo.txt`,
un archivo local ignorado por Git que no debe publicarse ni mostrarse en capturas.

## Despliegue publico completado el 11 de octubre

- Variables privadas guardadas al reanudar el despliegue: conexion interna de
  PostgreSQL, clave JWT y contraseña demo. Ninguna se incluyo en GitHub.
- Servicio **semana7-login**, Node, Free, Virginia; identificador
  `srv-db65mvt9fdbs73etehsg`.
- Root Directory: `login-jwt`; Build Command: `npm ci && npm run build`;
  Start Command: `npm start`; Health Check: `/health`.
- Primer deploy `dep-db65n059fdbs73etejkg`, commit `c596b3e`: **Deploy succeeded | Live**.
- Logs: tablas `users`, `roles`, `refreshTokens`, `user_roles`; cuentas demo
  inicializadas; base conectada (`postgres`); servidor en puerto asignado `10000`.
- URL publica: https://semana7-login.onrender.com
- `npm run test:integration` contra la URL publica: **38 solicitudes correctas**.
  Incluye registro 201, duplicados 409, login 200, token ausente 401, usuario sin
  permiso admin 403, roles respectivos, renovacion 200 y refresh revocado 403.
- En el navegador publico se verificaron login, restauracion de sesion al recargar
  `/user` y el boton Cargar contenido devolviendo **User Content.**
- El frontend conserva el CSS original y carga sus archivos CSS y JavaScript.
- Una advertencia nueva de npm en el primer build identifico `source-map-js`
  1.2.1. Se actualizo exclusivamente a 1.2.2: `npm audit` del frontend reporta
  **cero vulnerabilidades**, y se verifico una nueva construccion correcta.

### Verificacion de la version final

- Commit desplegado: `eb8af76`; deploy `dep-db65ph942hec73b0pjg0`, 11 de octubre,
  23:06 (America/Lima); **Deploy succeeded | Live**, duracion 32,5 segundos.
- Los logs finales reportan cero vulnerabilidades en ambas instalaciones, build
  exitoso, cuatro tablas, cuentas demo y conexion PostgreSQL correcta.
- Consulta directa a PostgreSQL externo con TLS: conexion correcta, cuatro tablas,
  tres roles y las tres cuentas demo con sus roles respectivos.
- `/health`: HTTP 200, `status: ok`, `database: connected`, `dialect: postgres`.
- Recursos `/assets/index-CfJd6XKh.js` y `/assets/index-6EdqRStE.css`: HTTP 200.
- Tras el nuevo deploy se recargo `/user`: se restauro la sesion y Cargar contenido
  devolvio **User Content.**, comprobando persistencia en la base alojada.
- Revision final del backend con `npm audit --omit=dev`: cero vulnerabilidades.
- Capturas: `evidencias/login-publico.png`, `evidencias/render-deploy-final.png`
  y `evidencias/render-logs-final.png`; ignoradas por Git.

La actualizacion posterior de este registro solo modifica documentacion; el codigo
verificado corresponde al commit desplegado indicado arriba.

Las cuentas de demostracion usan correos `example.com`; no se trasladaron datos
privados de la base anterior. El servicio mantiene sus datos en PostgreSQL aunque
el backend se reinicie. La base gratuita caduca el **4 de noviembre de 2026**.

Las capturas publicas se guardan localmente en `evidencias/`. El informe y el guion
estan en `INFORME-Y-VIDEO.md`. Para nuevos cambios se utiliza **Manual Deploy >
Deploy latest commit**; la conexion del repositorio es publica.
