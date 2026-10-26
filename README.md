# SecureLogin — laboratorio didáctico con bcrypt

Aplicación sencilla de registro e inicio de sesión con Express y bcryptjs. Los usuarios se almacenan en un arreglo en memoria, sin base de datos.

## Requisitos

- Node.js 18 o superior
- npm
- Navegador web

## Ejecutar localmente

1. Descomprimir el proyecto y abrir una terminal en la carpeta `login_bcrypt_lab`.
2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor:

   ```bash
   npm start
   ```

4. Abrir `http://localhost:3000`.

Para desarrollo con recarga automática: `npm run dev`.

## Cómo funciona

- `public/index.html`: interfaz del login y registro.
- `public/styles.css`: estilos.
- `public/app.js`: interacción del navegador y solicitudes HTTP.
- `app.js`: API Express y lógica de autenticación.
- `usuarios`: arreglo en memoria con objetos `{ user, passwordHash }`.
- `bcrypt.hash(password, 10)`: genera el hash de la contraseña.
- `bcrypt.compare(password, hash)`: verifica la contraseña ingresada.

Los usuarios desaparecen al reiniciar Node.js. El arreglo no se comparte entre procesos ni entre servidores: cada instancia tendrá su propio conjunto de usuarios.

## Publicar detrás de Nginx (opcional)

La aplicación Node.js debe seguir ejecutándose en el puerto 3000. Nginx actúa como proxy inverso y entrega el tráfico al proceso Node.

Ejemplo de bloque `server` para una configuración Nginx de laboratorio:

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Validar y recargar Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Este ejemplo presupone que Node.js y Nginx se ejecutan en el mismo servidor. Si están en máquinas diferentes, ajustar `proxy_pass` a la dirección del servidor Node.js.

Para que ambos nodos de Keepalived sirvan la aplicación, Node.js y Nginx deben estar instalados y funcionando en ambos. Como el almacenamiento está en memoria, los registros creados en un nodo no aparecerán automáticamente en el otro.



## Limitaciones y uso

Este proyecto es exclusivamente para implementar en la evaluación de primer parcial de la materia de Ingeniería de Seguridad del Software - ESPE 2026.
