# Login Bcrypt - Disponibilidad

## 1. EVALUACIÓN DEL PRIMER PARCIAL - INGENIERÍA DE LA SEGURIDAD DEL SOFTWARE

Aplicación web didáctica que permite registrar usuarios e iniciar sesión mediante contraseñas protegidas con **bcryptjs**.

**Tecnologías utilizadas:**

- Node.js
- npm
- Express
- bcryptjs
- Nginx
- AlmaLinux

Los usuarios se almacenan temporalmente en un vector (arreglo en memoria). No se utiliza una base de datos.

> **IMPORTANTE:** Este proyecto es exclusivamente académico. Los usuarios registrados se pierden cuando se reinicia la aplicación Node.js.

## 2. Requisitos previos

- Servidor AlmaLinux.
- Acceso a una terminal con permisos de administración.
- Nginx instalado.
- Node.js y npm instalados.
- Conexión a Internet para descargar dependencias.
- Repositorio del proyecto disponible en GitHub.

## 3. Verificar AlmaLinux y Nginx

Instalar Nginx y verificar su Status


## 4. Instalar Node.js y npm

Comprobar si están instalados:

```bash
node -v
npm -v
```

Si no están instalados, consultar las versiones disponibles:

```bash
sudo dnf module list nodejs
```

Si el sistema ofrece un módulo compatible, instalar una versión disponible, sustituyendo `XX` por la versión correspondiente:

```bash
sudo dnf module install nodejs:XX/common -y
```

Si el módulo no está disponible, seleccionar un método de instalación compatible con la versión de AlmaLinux.

Verificar nuevamente:

```bash
node -v
npm -v
```

## 5. Instalar Git

Instalar Git si todavía no está disponible:

```bash
sudo dnf install git -y
```

Verificar la instalación:

```bash
git --version
```

## 6. Clonar el proyecto desde GitHub

Ejecutar el siguiente comando, reemplazando la URL por la dirección real del repositorio:

```bash
sudo git clone https://github.com/pablomorales7/login_bcrypt_lab.git /opt/login_bcrypt_lab
```

Ingresar al directorio del proyecto:

```bash
cd /opt/login_bcrypt_lab
```

Verificar los archivos:

```bash
ls -la
```

Deben encontrarse los siguientes elementos:

```text
app.js
package.json
README.md
public/
```

**Nota:** Si el proyecto ya está copiado en el servidor, no es necesario clonarlo nuevamente.

## 7. Instalar las dependencias

Dentro del directorio del proyecto, ejecutar:

```bash
npm install
```

Este comando instala las dependencias definidas en `package.json`, incluyendo Express y bcryptjs.

## 8. Iniciar la aplicación

Ejecutar:

```bash
npm start
```

La aplicación estará disponible internamente en el puerto `3000`.

Para verificar que responde, abrir otra terminal y ejecutar:

```bash
curl http://127.0.0.1:3000/api/estado
```

La respuesta debe indicar que la aplicación está operativa.

> **IMPORTANTE:** Mantener el proceso ejecutándose durante esta primera prueba.

## 9. Configurar Nginx como proxy inverso

Crear el archivo de configuración:

```bash
sudo nano /etc/nginx/conf.d/login-bcrypt.conf
```

Agregar la siguiente configuración:

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

Guardar el archivo y comprobar la configuración:

```bash
sudo nginx -t
```

Si no existen errores, recargar Nginx:

```bash
sudo systemctl reload nginx
```

## 10. Configuración del firewall

Si se utiliza `firewalld` y se necesita acceder desde otros equipos de la red del laboratorio, habilitar HTTP:

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

Verificar los servicios permitidos:

```bash
sudo firewall-cmd --list-services
```

**Nota:** No es necesario abrir el puerto `3000` a toda la red si Nginx y Node.js se ejecutan en el mismo servidor. Para ello, se recomienda configurar Node.js para escuchar únicamente en `127.0.0.1`.

## 11. Acceder al sitio web

Desde un navegador, ingresar a:

```text
http://IP_DEL_SERVIDOR
```

Reemplazar `IP_DEL_SERVIDOR` por la dirección IP real del servidor AlmaLinux.

La página debe mostrar el formulario SecureLogin con las opciones:

- Iniciar sesión.
- Crear cuenta.

Registrar un usuario y probar el inicio de sesión.

## 12. Pruebas de funcionamiento

Realizar las siguientes pruebas:

1. Registrar un usuario nuevo.
2. Intentar registrar nuevamente el mismo usuario.
3. Iniciar sesión con la contraseña correcta.
4. Intentar iniciar sesión con una contraseña incorrecta.
5. Verificar que las contraseñas se procesan mediante bcrypt.
6. Reiniciar la aplicación y comprobar que los usuarios almacenados en memoria desaparecen.

## 13. Integración con Keepalived

Para integrar el proyecto con la arquitectura de alta disponibilidad:

- Instalar Node.js y npm en ambos servidores.
- Copiar el proyecto en los nodos `MASTER` y `BACKUP`.
- Instalar las dependencias en ambos nodos.
- Ejecutar Node.js en ambos servidores.
- Configurar Nginx en ambos nodos.
- Configurar Keepalived y la dirección IP virtual.
- Comprobar que Keepalived detecte la caída de Node.js y no solamente la de Nginx.
- Simular la caída del nodo `MASTER`.
- Verificar que el servicio continúe accesible mediante la IP virtual.

> **LIMITACIÓN:** Cada instancia mantiene su propio vector de usuarios. Los registros no se sincronizan entre `MASTER` y `BACKUP`.


> **ADVERTENCIA:** Este proyecto es exclusivamente para la aplicación de le evaluación de primer parcial de l asignatura de Ingeniería de la Seguridad del Software

