# Reemplazar texto en es.onlinemschool.com

Este es un script de [Tampermonkey](https://www.tampermonkey.net/) que permite reemplazar texto en la página [es.onlinemschool.com](https://es.onlinemschool.com/) con una interfaz de usuario para gestionar las palabras a reemplazar.

## Características

✅ Reemplazo dinámico de palabras en la página.

✅ Configuración de reemplazos a través de un menú en Tampermonkey.

✅ Persistencia de los reemplazos usando `localStorage`.

✅ Interfaz de usuario flotante para gestionar los reemplazos.

✅ Modal arrastrable con área de texto editable.

✅ Observación de cambios en la página para aplicar reemplazos automáticamente.

## Instalación

1. Instala la extensión [Tampermonkey](https://www.tampermonkey.net/) en tu navegador.
2. Abre el [panel de Tampermonkey](chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html).
3. Crea un nuevo script y copia el código del archivo [`script.js`](script.js).
4. Guarda el script y asegúrate de que está habilitado.
5. Visita [es.onlinemschool.com](https://es.onlinemschool.com/) y usa el menú de Tampermonkey para abrir la configuración.

## Uso

1. Haz clic en el ícono de Tampermonkey en la barra de herramientas.
2. Selecciona `Configurar reemplazos`.
3. En el modal emergente, introduce las palabras a reemplazar en el formato:
   ```
   palabra_original -> palabra_nueva
   ejemplo -> demo
   matemáticas -> cálculo
   ```
4. Cierra el modal para guardar los cambios y aplicarlos automáticamente en la página.


## Contribución

¡Las contribuciones son bienvenidas! Si tienes sugerencias o mejoras, abre un `Issue` o envía un `Pull Request`.

## Licencia

Este proyecto está bajo la licencia MIT.
