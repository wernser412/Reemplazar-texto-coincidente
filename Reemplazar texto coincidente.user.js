// ==UserScript==
// @name         Reemplazar texto coincidente
// @namespace    http://tampermonkey.net/
// @version      2025.09.19
// @description  Reemplaza texto y guarda/exporta datos entre múltiples sitios (usando GM_setValue). Exportación global funciona correctamente. Soporta reemplazos vacíos.
// @author       wernser412
// @icon         https://raw.githubusercontent.com/wernser412/Reemplazar-texto-coincidente/refs/heads/main/ICONO.png
// @downloadURL  https://github.com/wernser412/Reemplazar-texto-coincidente/raw/refs/heads/main/Reemplazar%20texto%20coincidente.user.js
// @match        *://es.onlinemschool.com/*
// @match        *://*.calculatorsoup.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(async function () {
    'use strict';

    const dominio = location.hostname;

    async function obtenerBase() {
        try {
            return JSON.parse(await GM_getValue("reemplazosPorSitio", "{}"));
        } catch {
            return {};
        }
    }

    async function guardarBase(base) {
        await GM_setValue("reemplazosPorSitio", JSON.stringify(base));
    }

    let base = await obtenerBase();
    base[dominio] = base[dominio] || [];
    let reemplazos = base[dominio];

    function aplicarReemplazos(nodo) {
        if (nodo.nodeType !== 3 || !reemplazos.length) return;
        let texto = nodo.nodeValue;
        reemplazos.forEach(([original, nuevo]) => {
            if (original !== undefined && nuevo !== undefined) {
                const regex = new RegExp(`\\b${original}\\b`, 'gi');
                texto = texto.replace(regex, nuevo);
            }
        });
        nodo.nodeValue = texto;
    }

    function recorrerNodos(nodo) {
        if (nodo.nodeType === 3) {
            aplicarReemplazos(nodo);
        } else if (nodo.nodeType === 1 && !['SCRIPT', 'STYLE'].includes(nodo.nodeName)) {
            nodo.childNodes.forEach(recorrerNodos);
        }
    }

    function observarCambios() {
        const observer = new MutationObserver(muts => {
            muts.forEach(m => m.addedNodes.forEach(recorrerNodos));
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    recorrerNodos(document.body);
    observarCambios();

    // === MODAL ===
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        backgroundColor: 'white', border: '1px solid #ccc', padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: '1001', display: 'none',
        width: '500px', height: '400px', resize: 'both', overflow: 'auto'
    });

    const modalHeader = document.createElement('div');
    Object.assign(modalHeader.style, {
        width: '100%', height: '30px', cursor: 'move', background: '#ddd',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold'
    });
    modalHeader.textContent = 'Reemplazos para ' + dominio;
    modal.appendChild(modalHeader);

    let isDragging = false, offsetX, offsetY;
    modalHeader.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - modal.offsetLeft;
        offsetY = e.clientY - modal.offsetTop;
    });
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            requestAnimationFrame(() => {
                modal.style.left = `${e.clientX - offsetX}px`;
                modal.style.top = `${e.clientY - offsetY}px`;
            });
        }
    });
    document.addEventListener('mouseup', () => isDragging = false);

    const textarea = document.createElement('textarea');
    Object.assign(textarea.style, { width: '100%', height: 'calc(100% - 80px)', resize: 'none' });
    textarea.placeholder = 'palabra_original -> palabra_nueva';
    modal.appendChild(textarea);

    const btnGuardar = document.createElement('button');
    btnGuardar.textContent = 'Guardar';
    Object.assign(btnGuardar.style, {
        margin: '10px 5px 0 0', padding: '5px 15px', background: '#28a745', color: 'white',
        border: 'none', borderRadius: '4px', cursor: 'pointer'
    });

    btnGuardar.onclick = async () => {
        const nuevaLista = textarea.value.split('\n')
            .map(l => l.split('->').map(x => x.trim()))
            .filter(p => p.length === 2 && p[0]); // ✅ Solo requiere que la clave no esté vacía

        base = await obtenerBase(); // Recargar base actual
        base[dominio] = nuevaLista;
        await guardarBase(base);
        reemplazos = base[dominio];
        recorrerNodos(document.body);
        modal.style.display = 'none';
    };

    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    Object.assign(btnCancelar.style, {
        margin: '10px 5px 0 0', padding: '5px 15px', background: '#dc3545', color: 'white',
        border: 'none', borderRadius: '4px', cursor: 'pointer'
    });
    btnCancelar.onclick = () => modal.style.display = 'none';

    const btnFlecha = document.createElement('button');
    btnFlecha.textContent = 'Agregar ->';
    Object.assign(btnFlecha.style, {
        margin: '10px 5px 0 0', padding: '5px 15px', background: '#007bff', color: 'white',
        border: 'none', borderRadius: '4px', cursor: 'pointer'
    });
    btnFlecha.onclick = () => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const texto = textarea.value;
        textarea.value = texto.slice(0, start) + ' -> ' + texto.slice(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        textarea.focus();
    };

    modal.appendChild(btnGuardar);
    modal.appendChild(btnCancelar);
    modal.appendChild(btnFlecha);
    document.body.appendChild(modal);

    // === MENÚ DE TAMPERMONKEY ===
    GM_registerMenuCommand("Configurar reemplazos", async () => {
        const datos = await obtenerBase();
        textarea.value = (datos[dominio] || []).map(p => p.join(' -> ')).join('\n');
        modalHeader.textContent = 'Reemplazos para ' + dominio;
        modal.style.display = 'block';
        textarea.focus();
    });

    GM_registerMenuCommand("Exportar reemplazos (todos los sitios)", async () => {
        try {
            const datos = await obtenerBase();
            const pretty = JSON.stringify(datos, null, 2);
            const blob = new Blob([pretty], { type: 'application/json' });
            GM_download({
                url: URL.createObjectURL(blob),
                name: 'reemplazos_global.json',
                saveAs: true
            });
        } catch (e) {
            alert('Error al exportar: ' + e.message);
        }
    });

    GM_registerMenuCommand("Importar reemplazos", () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.addEventListener('change', async () => {
            const file = input.files[0];
            if (!file) return;
            const text = await file.text();
            try {
                const nuevos = JSON.parse(text);
                const actuales = await obtenerBase();
                const fusionados = { ...actuales, ...nuevos };
                await guardarBase(fusionados);
                base = fusionados;
                reemplazos = base[dominio] || [];
                recorrerNodos(document.body);
                alert('Importación completa.');
            } catch (e) {
                alert('Error al importar: ' + e.message);
            }
            input.remove();
        });

        input.click();
    });

})();
