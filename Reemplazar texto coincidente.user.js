// ==UserScript==
// @name         Reemplazar texto coincidente
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Reemplaza palabras en es.onlinemschool.com con menú en Tampermonkey. Optimizado con mejor rendimiento.
// @author       wernser412
// @icon         https://raw.githubusercontent.com/wernser412/Reemplazar-texto-coincidente/refs/heads/main/icono.png
// @downloadURL  https://github.com/wernser412/Reemplazar-texto-coincidente/raw/refs/heads/main/Reemplazar%20texto%20coincidente.user.js
// @match        *://es.onlinemschool.com/*
// @match        *://calculatorsoup.com/*
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    let reemplazosGuardados = JSON.parse(localStorage.getItem('reemplazosTexto')) || [];

    function aplicarReemplazos(element) {
        if (!element || element.nodeType !== 3) return;
        let texto = element.nodeValue;
        reemplazosGuardados.forEach(pair => {
            let [original, nuevo] = pair;
            if (original && nuevo) {
                let regex = new RegExp(`\\b${original}\\b`, 'gi');
                texto = texto.replace(regex, nuevo);
            }
        });
        element.nodeValue = texto;
    }

    function recorrerNodos(node) {
        if (node.nodeType === 3) {
            aplicarReemplazos(node);
        } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
            node.childNodes.forEach(recorrerNodos);
        }
    }

    function observarCambios() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => recorrerNodos(node));
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    recorrerNodos(document.body);
    observarCambios();

    // Crear modal optimizado
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
    modalHeader.textContent = 'Mover formulario';
    modal.appendChild(modalHeader);

    let isDragging = false, offsetX, offsetY;
    modalHeader.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - modal.offsetLeft;
        offsetY = event.clientY - modal.offsetTop;
    });

    function handleMouseMove(event) {
        if (isDragging) {
            requestAnimationFrame(() => {
                modal.style.left = `${event.clientX - offsetX}px`;
                modal.style.top = `${event.clientY - offsetY}px`;
            });
        }
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => isDragging = false);

    const closeButton = document.createElement('button');
    Object.assign(closeButton.style, {
        position: 'absolute', top: '5px', right: '10px', backgroundColor: '#DC3545',
        color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
    });
    closeButton.textContent = 'X';
    closeButton.onclick = () => {
        reemplazosGuardados = textarea.value.split('\n')
            .map(line => line.split(' -> ').map(p => p.trim()))
            .filter(pair => pair.length === 2 && pair[0] && pair[1]);
        localStorage.setItem('reemplazosTexto', JSON.stringify(reemplazosGuardados));
        recorrerNodos(document.body);
        modal.style.display = 'none';
    };
    modal.appendChild(closeButton);

    const textarea = document.createElement('textarea');
    Object.assign(textarea.style, { width: '100%', height: 'calc(100% - 40px)', resize: 'none' });
    textarea.placeholder = 'Ingrese cada reemplazo en formato: palabra_original -> palabra_nueva';
    textarea.value = reemplazosGuardados.map(pair => pair.join(' -> ')).join('\n');
    modal.appendChild(textarea);

    document.body.appendChild(modal);
    GM_registerMenuCommand("Configurar reemplazos", () => {
        modal.style.display = 'block';
        textarea.focus();
    });
})();
