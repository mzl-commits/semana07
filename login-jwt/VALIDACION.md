# Validacion real de la tarea

Fecha: 5 de octubre de 2026 (America/Lima).

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

## Pasos pendientes

- Guardar las variables privadas de conexion, JWT y cuentas demo en Render:
  requiere autorizacion especifica tras el rechazo de revision automatica.
- Crear/iniciar el Web Service, comprobar PostgreSQL desde el backend y verificar
  la URL publica, CSS, JS, registro, login, roles, renovacion y logs.
- Registrar aqui la URL publica, pruebas en Render y capturas del deploy final.

No se trasladaron datos privados de la base anterior. Las claves no se incluyen
en Git. La revision automatica rechazo la posible importacion de `.env` en Render
porque la autorizacion de despliegue no especificaba el envio de sus secretos.
