# Material para la tarea del Laboratorio 8

Proyecto: sistema de login JWT desarrollado en la semana 7 y preparado para Render.
La URL y los resultados reales se registran en `VALIDACION.md`.

## Capturas en orden y titulos para el informe

| N.° | Que debes mostrar | Titulo debajo de la imagen |
| --- | --- | --- |
| 1 | Explorador con `login-jwt`, `app`, `tarea`, `database` y `scripts` | Estructura del sistema de login |
| 2 | `server.js`: configuracion, API, frontend compilado y puerto del entorno | Servidor Express preparado para Render |
| 3 | `tarea/src/App.jsx`: formulario y rutas protegidas | Formularios y control de acceso del frontend |
| 4 | `tarea/src/services/api.js`: `/api` y renovacion del token | Comunicacion entre React y la API |
| 5 | `app/models/index.js` y modelos de usuario, rol y refresh token | Modelos y relaciones de la base de datos |
| 6 | `package.json` del backend y frontend con scripts y dependencias | Dependencias y comandos de ejecucion |
| 7 | `.gitignore` y `.env.example`, sin mostrar `.env` real | Proteccion de claves y archivos locales |
| 8 | Terminal con `npm run build` exitoso | Construccion del frontend para produccion |
| 9 | Terminal con `npm start`, tablas y conexion MySQL; navegador `localhost:8080` | Ejecucion local del login y su base de datos |
| 10 | Terminal con `npm run db:check`, solo nombres de tablas, roles y demos | Verificacion de las tablas y roles |
| 11 | Terminal con `npm run test:integration` y resultado de solicitudes | Pruebas de autenticacion y permisos |
| 12 | `git status`, rama `main` y `git check-ignore` | Revision de archivos antes de publicar |
| 13 | GitHub en `main`, carpeta `login-jwt`, ultimo commit y ausencia de `.env` | Publicacion del proyecto en GitHub |
| 14 | Panel de PostgreSQL: nombre, estado Available y plan Free; claves ocultas | Base de datos PostgreSQL alojada en Render |
| 15 | Settings del Web Service: repositorio, rama, Root Directory y comandos | Configuracion del servicio web en Render |
| 16 | Environment mostrando nombres de variables y valores sensibles ocultos | Variables privadas de produccion |
| 17 | Deploy con estado Deploy succeeded | Despliegue exitoso del sistema de login |
| 18 | Logs con build, tablas, conexion PostgreSQL y puerto asignado | Inicio del backend y conexion a la base alojada |
| 19 | Navegador con URL publica visible, diseño azul y naranja y formulario | Sistema de login funcionando en internet |
| 20 | Cuenta demo_user autenticada y User Content al cargar | Acceso autorizado de un usuario |
| 21 | Cuenta demo_moderator o demo_admin y contenido de su rol | Acceso segun roles de moderador y administrador |
| 22 | Esperar mas de 30 s, volver a cargar contenido; opcional Network mostrando refreshtoken sin abrir su respuesta | Renovacion automatica de la sesion JWT |
| 23 | Cerrar sesion y abrir `/user`: redireccion al login | Proteccion de rutas despues del cierre de sesion |

No muestres contraseñas, JWT completos, refresh tokens, URLs privadas de conexion
o el contenido real de `.env` en las capturas o en el video. Las demostraciones
utilizan cuentas ficticias y correos `example.com`.

Las capturas de Render y URL publica deben coincidir con el estado real del deploy.
Si `VALIDACION.md` marca un paso pendiente, no lo presentes como concluido.

## Guion natural para un video de hasta cuatro minutos

Duracion orientativa: 3 minutos 45 segundos a 4 minutos, dejando algunos segundos
para cambiar de ventana. Usa la URL real indicada en `VALIDACION.md`. Graba la
parte de despliegue despues de confirmar que el servicio esta activo.

### 0:00–0:30 — Presentacion y objetivo

**En pantalla:** pagina inicial del sistema.

«Hola. En esta tarea del Laboratorio numero ocho voy a presentar el despliegue del
sistema de login que desarrolle en la semana siete. Mi objetivo fue conservar su
diseño y hacer que el registro, el inicio de sesion y los permisos funcionen desde
internet, con una base de datos alojada en Render.»

### 0:30–1:30 — Estructura y codigo principal

**En pantalla:** carpeta del proyecto, `server.js`, `App.jsx` y `api.js`.

«El proyecto tiene dos partes. En la carpeta tarea esta el frontend de React, con
los formularios de registro y login y las paginas de cada rol. En la carpeta app
estan los modelos, las rutas y los controladores del backend.

El archivo server.js inicia Express, conecta la base de datos y sirve tambien el
frontend compilado. El puerto se toma de una variable del entorno para que Render
pueda asignarlo.

En api.js cambie la direccion fija de localhost por la ruta api del mismo sitio.
Cuando vence el token de acceso, el frontend solicita uno nuevo. Las contraseñas
se guardan como hash, y los roles se comprueban tanto en las paginas como en la API.
El registro publico siempre crea un usuario normal.»

### 1:30–2:20 — Git y GitHub

**En pantalla:** `.gitignore`, terminal y repositorio en GitHub.

«Antes de subir el proyecto revise los archivos con Git. La rama es main y el
repositorio contiene el codigo del backend, el frontend, los archivos de
dependencias y la estructura de la base de datos.

En gitignore exclui node_modules, los archivos de entorno y los archivos generados
por la construccion. Las contraseñas y las claves de conexion no estan en GitHub.
Tambien deje un archivo de ejemplo para saber que variables debemos configurar.
Aqui se puede ver el commit con la preparacion del sistema para el despliegue.»

### 2:20–3:10 — Configuracion del despliegue

**En pantalla:** Web Service Settings y base PostgreSQL, con secretos ocultos.

«En Render cree un servicio web y una base PostgreSQL. Use la misma region para
conectarlos por la red interna. El directorio del servicio es login-jwt; el comando
de construccion instala las dependencias y compila React, y el comando de inicio
ejecuta el servidor.

La conexion de la base, la clave JWT y la contraseña de las cuentas de demostracion
estan en variables privadas. Al iniciar se crean las tablas, los roles y las
cuentas demo que faltan. En los logs compruebo que la base esta conectada y que el
despliegue termino correctamente.»

### 3:10–3:50 — Aplicacion funcionando

**En pantalla:** URL publica, login y contenido de usuario.

«Ahora abro la URL publica e inicio sesion con una cuenta de demostracion. Al
presionar cargar contenido, el servidor devuelve la informacion protegida.
Un usuario normal puede acceder a su pagina, pero no tiene permiso de
administrador. Las cuentas de moderador y administrador tienen sus opciones
correspondientes. La sesion se puede renovar cuando vence el token. Finalmente
cierro sesion y compruebo que la pagina protegida solicita iniciar sesion otra vez.»

### 3:50–4:00 — Conclusion

**En pantalla:** pagina inicial.

«Con este trabajo comprobe la relacion entre frontend, backend y base de datos,
y prepare el sistema de la semana siete para demostrarlo desde una URL publica.»

## Observaciones sugeridas

- Se reutilizo el proyecto de semana 7 y se mantuvo su CSS original.
- En produccion frontend y API se sirven desde el mismo dominio; no se usan URLs
  locales en el codigo compilado.
- Render aloja PostgreSQL; la configuracion conserva MySQL para ejecucion local.
- Solo se prepararon tablas, roles y cuentas nuevas de demostracion; no se
  trasladaron usuarios privados de la base anterior.
- El token de acceso dura 30 segundos para facilitar la demostracion de renovacion.
- La base gratuita creada el 5 de octubre de 2026 caduca el 4 de noviembre de 2026.
  Se debe respaldar o cambiar de plan antes de esa fecha si se desea conservarla.
- El servicio gratuito puede tardar al despertar despues de estar inactivo.
- Las cuentas demo y su contraseña son para el laboratorio; no representan
  administracion de usuarios ni recuperacion de contraseñas de un producto completo.

## Conclusiones sugeridas

1. La preparacion de un proyecto para la nube requiere ajustar las URLs, el puerto,
   las variables de entorno y el proceso de construccion.
2. JWT permite proteger rutas, y los roles limitan las acciones de cada usuario.
   El cierre de sesion invalida el refresh token para impedir renovaciones futuras.
3. Una base de datos alojada permite conservar las cuentas aunque el servicio web
   se reinicie; sus credenciales deben mantenerse fuera del repositorio.
4. Las pruebas de registro, login, permisos y renovacion ayudan a comprobar que
   el frontend y el backend funcionan juntos. El registro de validacion distingue
   las verificaciones completadas de cualquier paso pendiente.
