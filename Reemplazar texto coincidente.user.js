// ==UserScript==
// @name         Reemplazar texto coincidente
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Reemplaza palabras por sitio con menú en Tampermonkey, exporta/importa desde archivo. Optimizado y modular.
// @author       wernser412
// @icon         https://raw.githubusercontent.com/wernser412/Reemplazar-texto-coincidente/refs/heads/main/icono.png
// @match        *://es.onlinemschool.com/*
// @match        *://*.calculatorsoup.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// ==/UserScript==

(function () {
    'use strict';

    const dominio = location.hostname;
    let base = JSON.parse(localStorage.getItem('reemplazosPorSitio') || '{}');
    base[dominio] = base[dominio] || [];
    let reemplazos = base[dominio];

    function aplicarReemplazos(nodo) {
        if (nodo.nodeType !== 3 || !reemplazos.length) return;
        let texto = nodo.nodeValue;
        reemplazos.forEach(([original, nuevo]) => {
            if (original && nuevo) {
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

    // ====== MODAL UI ======
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        backgroundColor: 'white', border: '1px solid #ccc', padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: '1001', display: 'none',
        width: '500px', height: '400px', resize: 'both', overflow: 'hidden'
    });

    const modalHeader = document.createElement('div');
    Object.assign(modalHeader.style, {
        width: '100%', height: '30px', cursor: 'move', background: '#ddd',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '16px'
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
    btnGuardar.onclick = () => {
        base[dominio] = textarea.value.split('\n')
            .map(l => l.split('->').map(x => x.trim()))
            .filter(p => p.length === 2 && p[0] && p[1]);
        localStorage.setItem('reemplazosPorSitio', JSON.stringify(base));
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

    modal.appendChild(btnGuardar);
    modal.appendChild(btnCancelar);
    document.body.appendChild(modal);

    // ====== FUNCIONES TAMpermonkey ======
    GM_registerMenuCommand("Configurar reemplazos", () => {
        textarea.value = base[dominio].map(p => p.join(' -> ')).join('\n');
        modalHeader.textContent = 'Reemplazos para ' + dominio;
        modal.style.display = 'block';
        textarea.focus();
    });

    GM_registerMenuCommand("Exportar reemplazos", () => {
        const blob = new Blob([JSON.stringify(base, null, 2)], { type: 'application/json' });
        GM_download({
            url: URL.createObjectURL(blob),
            name: 'reemplazos.json',
            saveAs: true
        });
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
                const data = JSON.parse(text);
                if (typeof data === 'object') {
                    base = data;
                    reemplazos = base[dominio] || [];
                    localStorage.setItem('reemplazosPorSitio', JSON.stringify(base));
                    recorrerNodos(document.body);
                    alert('Reemplazos importados correctamente.');
                } else {
                    alert('El archivo no es válido.');
                }
            } catch (e) {
                alert('Error al leer el archivo.');
            }
            input.remove();
        });

        input.click();
    });

})();
