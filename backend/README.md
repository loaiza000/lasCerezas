# Las Cerezas

Sistema de gestión para el negocio Las Cerezas. Esta aplicación web proporciona funcionalidades para la gestión de pagos, turnos y usuarios.

## Características

- Gestión de pagos
- Sistema de turnos
- Gestión de usuarios
- Autenticación segura
- API RESTful

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB (con Mongoose)
- JWT para autenticación
- bcrypt para encriptación de contraseñas
- Nodemailer para envío de correos

## Requisitos previos

- Node.js (versión 14 o superior)
- MongoDB
- npm (Node Package Manager)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto
   - Agrega las siguientes variables:
     ```
     PORT=3000
     MONGODB_URI=tu_uri_de_mongodb
     JWT_SECRET=tu_secret
     ```

4. Inicia el servidor:
   ```bash
   npm run dev
   ```

## Endpoints disponibles

- `/pago` - Rutas relacionadas con pagos
- `/turno` - Rutas relacionadas con turnos
- `/usuario` - Rutas relacionadas con usuarios

## Seguridad

- Autenticación JWT
- Encriptación de contraseñas con bcrypt
- Protección contra CORS
- Validación de datos en el servidor

