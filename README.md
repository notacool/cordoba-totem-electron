
# cordoba-totem-electron
Totem informativo para Cordoba

## Descarga del repositorio

Clona este repositorio usando git:

```sh
git clone https://github.com/notacool/cordoba-totem-electron.git
cd cordoba-totem-electron
```

## Env variables
El proyecto necesita un fichero .env para su ejecución, este fichero debe seguir el siguiente formato:

```sh
VITE_ODOO_DB= # Nombre de la base de datos de odoo 
VITE_ODOO_USERNAME= # usuario de odoo
VITE_ODOO_PASSWORD= # contraseña del usuario de odoo
```

## Instalación de dependencias y ejecución

Instala las dependencias y ejecuta el proyecto usando el siguiente script en Linux:

```sh
# Da permisos de ejecución al script (solo la primera vez)
chmod +x init

# Ejecuta el script de inicio
./init
```

O si prefieres hacerlo manualmente:

```sh
# Instala las dependencias
npm install

# Inicia el backend y guarda el log y el PID
nohup npm run start > start.log &
echo $! > killpid

# Lanza Electron (sin sandbox)
ELECTRON_DISABLE_SANDBOX=true npx electron electron/main.js
```

Esto ejecutará el backend y el frontend en segundo plano, guardando el PID en el archivo `killpid` y el log en `start.log`. Luego, Electron se ejecutará en primer plano.

```
