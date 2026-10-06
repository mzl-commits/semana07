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
- Base PostgreSQL de Render creada: `semana7-login-db`, PostgreSQL 18, Virginia,
  plan Free, estado Available, identificador `dpg-db22g3m7bikc73c710e0-a`.
- Caducidad de la base gratuita: 4 de noviembre de 2026.

El intento de conexion directa desde esta computadora al PostgreSQL externo de
Render termino en ETIMEDOUT. La ejecucion local se verifico con MySQL instalado.
La conexion de produccion debe usar la URL interna entre servicios de Render.

## Pasos pendientes

- Guardar las variables privadas de conexion, JWT y cuentas demo en Render:
  requiere autorizacion especifica tras el rechazo de revision automatica.
- Crear/iniciar el Web Service, comprobar PostgreSQL desde el backend y verificar
  la URL publica, CSS, JS, registro, login, roles, renovacion y logs.
- Registrar aqui la URL, commit publicado, pruebas publicas y capturas finales.

No se trasladaron datos privados de la base anterior. Las claves no se incluyen
en Git. La revision automatica rechazo la posible importacion de `.env` en Render
porque la autorizacion de despliegue no especificaba el envio de sus secretos.
