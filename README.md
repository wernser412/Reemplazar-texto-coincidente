# 🔁 Reemplazar texto por sitio web

**Última actualización:** 29 de julio de 2025  
**Compatibilidad:** [es.onlinemschool.com](https://es.onlinemschool.com/), [calculatorsoup.com](https://www.calculatorsoup.com/) y más.

![Interfaz gráfica del script](GUI.png)

Este es un script de [Tampermonkey](https://www.tampermonkey.net/) que permite reemplazar dinámicamente palabras o frases dentro de sitios web específicos. Cada dominio tiene su propia lista de reemplazos, editable desde una interfaz visual integrada.

---

## 🎯 Características principales

- ✅ Reemplazo automático de texto en la página.
- ✅ Soporte por dominio: cada sitio tiene su configuración de reemplazos independiente.
- ✅ Interfaz visual flotante, editable y arrastrable.
- ✅ Soporte para dejar el reemplazo en blanco (elimina la palabra original).
- ✅ Opción rápida para agregar líneas tipo `->` con un solo clic.
- ✅ Persistencia automática con `localStorage`.
- ✅ Exportación e importación de reemplazos en formato `.json`.
- ✅ Observa cambios en la página (DOM) y aplica los reemplazos en tiempo real.

---

## 🚀 Instalación

1. Instala la extensión [Tampermonkey](https://www.tampermonkey.net/) en tu navegador.
2. Abre el [panel de Tampermonkey](chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html).
3. Crea un nuevo script y pega el contenido de este archivo:  
   [`Reemplazar texto coincidente.user.js`](https://github.com/wernser412/Reemplazar-texto-coincidente/raw/refs/heads/main/Reemplazar%20texto%20coincidente.user.js)
4. Guarda el script y asegúrate de que esté habilitado.
5. Visita cualquiera de los sitios compatibles (como [es.onlinemschool.com](https://es.onlinemschool.com/)).
6. Haz clic en el icono de Tampermonkey y abre la opción `Configurar reemplazos`.

---

## 🛠️ Cómo usar

1. Selecciona `Configurar reemplazos` desde el menú de Tampermonkey.
2. En el modal que aparece, ingresa los reemplazos con el formato:

   ```
   palabra_original -> palabra_nueva
   eliminarme ->           (esto eliminará la palabra "eliminarme")
   círculo -> circunferencia
   ```

3. Usa el botón `Agregar línea` para insertar fácilmente nuevos reemplazos.
4. Guarda y cierra. Los cambios se aplicarán automáticamente en la página.

---

## 📤 Importar / Exportar

- **Exportar:** Guarda todos los reemplazos de todos los dominios en un archivo `.json`.
- **Importar:** Carga un archivo `.json` con configuraciones de reemplazos y se fusionarán con los datos existentes.
