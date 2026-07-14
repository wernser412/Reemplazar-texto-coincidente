// ==UserScript==
// @name         Reemplazar texto coincidente
// @namespace    http://tampermonkey.net/
// @version      2026.07.14
// @description  Reemplaza texto con menú flotante moderno
// @author       wernser412
// @icon         https://raw.githubusercontent.com/wernser412/Reemplazar-texto-coincidente/refs/heads/main/ICONO.png
// @downloadURL  https://github.com/wernser412/Reemplazar-texto-coincidente/raw/refs/heads/main/Reemplazar%20texto%20coincidente.user.js
// @match        *://es.onlinemschool.com/*
// @match        *://*.calculatorsoup.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(async function () {
    'use strict';

    /* ============================ CONFIG ============================ */

    const dominio = location.hostname;
    const MENU_VISIBLE_KEY = 'rt_menu_visible';
    const STORAGE_KEY = 'reemplazosPorSitio';
    const EXCLUDED_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE']);

    async function obtenerBase() {
        try {
            const data = JSON.parse(await GM_getValue(STORAGE_KEY, '{}'));
            return (data && typeof data === 'object' && !Array.isArray(data)) ? data : {};
        } catch {
            return {};
        }
    }

    async function guardarBase(base) {
        await GM_setValue(STORAGE_KEY, JSON.stringify(base));
    }

    const TEXTAREA_HEIGHT_KEY = 'rt_textarea_height';

    let base = await obtenerBase();
    if (!Array.isArray(base[dominio])) base[dominio] = [];
    let reemplazos = base[dominio];
    let alturaGuardada = await GM_getValue(TEXTAREA_HEIGHT_KEY, null);

    // Lista ya compilada a RegExp, para no reconstruir un RegExp por cada
    // nodo de texto recorrido (esto era el cuello de botella del script original).
    let reglasCompiladas = [];

    /* ============================ UTILS ============================ */

    function escapeRegExp(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function perteneceAlPanel(node) {
        return !!node.parentNode?.closest?.('.rt-ui');
    }

    function compilarReemplazos() {
        reglasCompiladas = reemplazos
            .map(([original, nuevo]) => {
                if (typeof original !== 'string' || typeof nuevo !== 'string') return null;
                if (!original.trim()) return null;

                try {
                    if (original.startsWith('regex:')) {
                        const patron = original.slice(6);
                        return { regex: new RegExp(patron, 'gi'), nuevo };
                    }
                    // Igual que en el resaltador: se usan lookarounds de \p{L}\p{N}
                    // en vez de \b, porque \b no delimita bien palabras con tildes/ñ.
                    return {
                        regex: new RegExp(
                            `(?<![\\p{L}\\p{N}])(${escapeRegExp(original)})(?![\\p{L}\\p{N}])`,
                            'giu'
                        ),
                        nuevo
                    };
                } catch {
                    return null; // patrón regex inválido: se ignora esa regla
                }
            })
            .filter(Boolean);
    }

    /* ============================ REEMPLAZOS ============================ */

    function aplicarReemplazos(nodo) {
        if (nodo.nodeType !== 3 || !reglasCompiladas.length) return;
        if (!nodo.parentNode) return;
        if (nodo.parentNode.isContentEditable) return;
        if (perteneceAlPanel(nodo)) return;

        let texto = nodo.nodeValue;
        if (!texto || !texto.trim()) return;

        let cambio = false;

        for (const { regex, nuevo } of reglasCompiladas) {
            regex.lastIndex = 0;
            if (regex.test(texto)) {
                regex.lastIndex = 0;
                texto = texto.replace(regex, nuevo);
                cambio = true;
            }
        }

        if (cambio) nodo.nodeValue = texto;
    }

    function recorrerNodos(nodo) {
        if (nodo.nodeType === 3) {
            aplicarReemplazos(nodo);
        } else if (nodo.nodeType === 1 && !EXCLUDED_TAGS.has(nodo.nodeName)) {
            if (nodo.classList?.contains('rt-ui')) return;
            nodo.childNodes.forEach(recorrerNodos);
        }
    }

    function refresh() {
        compilarReemplazos();
        if (reglasCompiladas.length) recorrerNodos(document.body);
    }

    /* ============================ OBSERVER (con debounce) ============================ */

    let pendingNodes = [];
    let debounceTimer = null;

    function procesarPendientes() {
        clearTimeout(debounceTimer);
        debounceTimer = null;
        const nodes = pendingNodes;
        pendingNodes = [];
        nodes.forEach(recorrerNodos);
    }

    const observer = new MutationObserver(muts => {
        if (!reglasCompiladas.length) return;
        for (const m of muts) m.addedNodes.forEach(n => pendingNodes.push(n));

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(procesarPendientes, 120);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Nota: a diferencia del resaltador, aquí NO se reescanea todo el body
    // al volver de una pestaña en segundo plano. El reemplazo es destructivo
    // (se sobreescribe el texto real), así que repetir el recorrido sobre
    // texto ya reemplazado podría aplicar una regla dos veces por error.
    // El MutationObserver ya cubre el contenido nuevo que llega dinámicamente.

    /* ============================ OVERLAY ============================ */

    let overlay;

    function showOverlay(text) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'rt-ui';
            overlay.style.cssText = `
                position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
                z-index:999999; pointer-events:none;
            `;
            const box = document.createElement('div');
            box.style.cssText = `
                width:min(440px, 82vw);
                background:rgba(15,23,42,.92);
                backdrop-filter:blur(10px);
                color:#fff;
                border:1px solid rgba(255,255,255,.12);
                border-radius:16px;
                padding:18px 22px;
                font:600 17px/1.35 system-ui, -apple-system, sans-serif;
                text-align:center;
                box-shadow:0 16px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.03) inset;
            `;
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        }

        overlay.firstChild.textContent = text;
        overlay.style.display = 'block';
        overlay.style.opacity = '1';
        overlay.style.transition = 'none';

        clearTimeout(overlay._timer);
        overlay._timer = setTimeout(() => {
            overlay.style.transition = 'opacity .35s ease';
            overlay.style.opacity = '0';
            setTimeout(() => { overlay.style.display = 'none'; }, 350);
        }, 1600);
    }

    /* ============================ FUNCIONES ============================ */

    function reglasDesdeTextarea() {
        return textarea.value
            .split('\n')
            .map(l => l.split('->').map(x => x.trim()))
            .filter(p => p.length === 2 && p[0]);
    }

    function updateRuleCount() {
        if (!contador) return;
        const n = reglasDesdeTextarea().length;
        contador.textContent = `${n} regla${n === 1 ? '' : 's'} · ${dominio}`;
    }

    async function guardar() {
        const nuevaLista = reglasDesdeTextarea();

        base = await obtenerBase();
        base[dominio] = nuevaLista;
        await guardarBase(base);

        reemplazos = base[dominio];
        refresh();
        updateRuleCount();

        showOverlay(`💾 Guardado — ${nuevaLista.length} regla${nuevaLista.length === 1 ? '' : 's'}`);
    }

    function limpiarLista() {
        if (!reemplazos.length && !textarea.value.trim()) return;
        if (!confirm(`¿Vaciar las reglas de reemplazo para ${dominio}?`)) return;

        textarea.value = '';
        updateRuleCount();
        showOverlay('🗑️ Lista vaciada (pulsa Guardar para confirmar)');
    }

    async function exportarTodo() {
        try {
            const datos = await obtenerBase();
            const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
            const fecha = new Date().toISOString().slice(0, 10);

            GM_download({
                url: URL.createObjectURL(blob),
                name: `reemplazos-global-${fecha}.json`,
                saveAs: true
            });

            showOverlay('📤 Exportado (todos los sitios)');
        } catch (e) {
            alert('Error al exportar: ' + e.message);
        }
    }

    async function exportarSitio() {
        try {
            const datos = await obtenerBase();
            const parcial = { [dominio]: datos[dominio] || [] };
            const blob = new Blob([JSON.stringify(parcial, null, 2)], { type: 'application/json' });
            const fecha = new Date().toISOString().slice(0, 10);

            GM_download({
                url: URL.createObjectURL(blob),
                name: `reemplazos-${dominio}-${fecha}.json`,
                saveAs: true
            });

            showOverlay(`📤 Exportado (solo ${dominio})`);
        } catch (e) {
            alert('Error al exportar: ' + e.message);
        }
    }

    function importar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.onchange = async e => {
            const file = e.target.files[0];
            if (!file) { input.remove(); return; }

            try {
                const nuevos = JSON.parse(await file.text());

                if (typeof nuevos !== 'object' || nuevos === null || Array.isArray(nuevos)) {
                    alert('Archivo inválido: se esperaba un objeto { "dominio": [[original, nuevo], ...] }.');
                    input.remove();
                    return;
                }

                const actuales = await obtenerBase();
                const fusionados = { ...actuales, ...nuevos };

                await guardarBase(fusionados);

                base = fusionados;
                reemplazos = Array.isArray(base[dominio]) ? base[dominio] : [];

                textarea.value = reemplazos.map(p => p.join(' -> ')).join('\n');
                updateRuleCount();
                refresh();

                showOverlay('📥 Importado');
            } catch (e) {
                alert('Error al importar: ' + e.message);
            }

            input.remove();
        };

        input.click();
    }

    function agregarFlecha() {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const texto = textarea.value;

        textarea.value = texto.slice(0, start) + ' -> ' + texto.slice(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        textarea.focus();
        updateRuleCount();
    }

    /* ============================ PANEL ============================ */

    let rtPanel, rtFab, textarea, contador, expandirBtn;
    let panelAbierto = false;
    let textareaExpandida = false;

    function toggleMenu(forzarEstado) {
        const abrir = forzarEstado ?? !panelAbierto;
        panelAbierto = abrir;

        if (abrir) {
            rtPanel.style.visibility = 'visible';
            rtPanel.style.pointerEvents = 'auto';
            setTimeout(() => {
                rtPanel.style.opacity = '1';
                rtPanel.style.transform = 'translateY(0) scale(1)';
            }, 10);
        } else {
            rtPanel.style.opacity = '0';
            rtPanel.style.transform = 'translateY(14px) scale(.96)';
            rtPanel.style.pointerEvents = 'none';
            setTimeout(() => { if (!panelAbierto) rtPanel.style.visibility = 'hidden'; }, 220);
        }

        rtFab.setAttribute('aria-expanded', String(abrir));
        rtFab.style.transform = abrir ? 'rotate(90deg)' : 'rotate(0deg)';
    }

    async function applyFloatingMenuVisibility() {
        const visible = await GM_getValue(MENU_VISIBLE_KEY, true);
        rtFab.style.display = visible ? 'flex' : 'none';
        if (!visible) toggleMenu(false);
    }

    async function toggleFloatingMenuVisibility() {
        const visible = await GM_getValue(MENU_VISIBLE_KEY, true);
        await GM_setValue(MENU_VISIBLE_KEY, !visible);
        applyFloatingMenuVisibility();
    }

    let alturaPreviaAExpandir = null;

    function toggleExpandirTextarea() {
        textareaExpandida = !textareaExpandida;

        if (textareaExpandida) {
            alturaPreviaAExpandir = getComputedStyle(textarea).height;
            textarea.style.height = '70vh';
        } else {
            textarea.style.height = alturaPreviaAExpandir || '260px';
        }

        expandirBtn.textContent = textareaExpandida ? '🗗 Reducir' : '🗖 Expandir';
    }

    function etiqueta(texto) {
        const l = document.createElement('label');
        l.textContent = texto;
        l.style.cssText = `
            color:#8b96ad; font-size:11.5px; font-weight:700;
            text-transform:uppercase; letter-spacing:.06em;
        `;
        return l;
    }

    function crearBoton(container, text, gradient, action) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = text;
        btn.onclick = action;
        btn.style.cssText = `
            width:100%; border:none; border-radius:10px; padding:9px 12px;
            background:${gradient}; color:white;
            font:600 13px system-ui, -apple-system, sans-serif; cursor:pointer;
            letter-spacing:.01em;
            transition:transform .15s ease, box-shadow .15s ease, filter .15s ease;
            box-shadow:0 2px 6px rgba(0,0,0,.3);
        `;
        btn.onmouseenter = () => {
            btn.style.transform = 'translateY(-1px)';
            btn.style.boxShadow = '0 5px 14px rgba(0,0,0,.4)';
            btn.style.filter = 'brightness(1.1)';
        };
        btn.onmouseleave = () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            btn.style.filter = 'none';
        };
        container.appendChild(btn);
        return btn;
    }

    function createFloatingMenu() {
        if (rtPanel) return;

        rtPanel = document.createElement('div');
        rtPanel.className = 'rt-ui';
        rtPanel.style.cssText = `
            position:fixed; right:20px; bottom:76px;
            width:min(560px, 95vw);
            max-height:90vh;
            overflow-y:auto;
            background:linear-gradient(165deg, rgba(24,29,48,.97), rgba(10,13,24,.97));
            backdrop-filter:blur(14px);
            border:1px solid rgba(255,255,255,.08);
            border-radius:22px;
            padding:22px;
            display:flex; flex-direction:column; gap:11px;
            z-index:999999;
            box-shadow:0 24px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.02) inset;
            font-family:system-ui, -apple-system, sans-serif;
            opacity:0; visibility:hidden; pointer-events:none;
            transform:translateY(14px) scale(.96);
            transition:opacity .22s ease, transform .22s ease;
        `;
        document.body.appendChild(rtPanel);

        /* HEADER */
        const header = document.createElement('div');
        header.style.cssText = 'display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;';

        const tituloWrap = document.createElement('div');
        tituloWrap.style.cssText = 'display:flex; align-items:center; gap:10px;';

        const iconoTitulo = document.createElement('div');
        iconoTitulo.textContent = '🔤';
        iconoTitulo.style.cssText = 'font-size:20px;';
        tituloWrap.appendChild(iconoTitulo);

        const tituloTextos = document.createElement('div');

        const titulo = document.createElement('div');
        titulo.textContent = 'Reemplazador';
        titulo.style.cssText = `
            color:white; font-size:19px; font-weight:750; letter-spacing:-.01em;
        `;
        tituloTextos.appendChild(titulo);

        const subtitulo = document.createElement('div');
        subtitulo.textContent = dominio;
        subtitulo.style.cssText = `
            color:#64748b; font-size:12px; font-family:monospace;
        `;
        tituloTextos.appendChild(subtitulo);

        tituloWrap.appendChild(tituloTextos);
        header.appendChild(tituloWrap);

        const cerrarBtn = document.createElement('button');
        cerrarBtn.type = 'button';
        cerrarBtn.textContent = '✕';
        cerrarBtn.title = 'Cerrar';
        cerrarBtn.style.cssText = `
            background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
            color:#94a3b8; font-size:15px; width:30px; height:30px;
            cursor:pointer; line-height:1; border-radius:9px;
            display:flex; align-items:center; justify-content:center;
            transition:background .15s ease, color .15s ease, transform .15s ease;
        `;
        cerrarBtn.onmouseenter = () => {
            cerrarBtn.style.background = 'rgba(255,255,255,.12)';
            cerrarBtn.style.color = 'white';
            cerrarBtn.style.transform = 'rotate(90deg)';
        };
        cerrarBtn.onmouseleave = () => {
            cerrarBtn.style.background = 'rgba(255,255,255,.05)';
            cerrarBtn.style.color = '#94a3b8';
            cerrarBtn.style.transform = 'rotate(0deg)';
        };
        cerrarBtn.onclick = () => toggleMenu(false);
        header.appendChild(cerrarBtn);

        rtPanel.appendChild(header);

        /* TEXTAREA */
        const filaReglasHeader = document.createElement('div');
        filaReglasHeader.style.cssText = 'display:flex; align-items:center; justify-content:space-between;';
        filaReglasHeader.appendChild(etiqueta('Reglas (original -> nuevo, una por línea)'));

        expandirBtn = document.createElement('button');
        expandirBtn.type = 'button';
        expandirBtn.textContent = '🗖 Expandir';
        expandirBtn.style.cssText = `
            font-size:11.5px; font-weight:600; padding:6px 11px; border-radius:8px;
            border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.04);
            color:#cbd5e1; cursor:pointer; transition:background .15s ease;
        `;
        expandirBtn.onmouseenter = () => { expandirBtn.style.background = 'rgba(255,255,255,.1)'; };
        expandirBtn.onmouseleave = () => { expandirBtn.style.background = 'rgba(255,255,255,.04)'; };
        expandirBtn.onclick = toggleExpandirTextarea;
        filaReglasHeader.appendChild(expandirBtn);

        rtPanel.appendChild(filaReglasHeader);

        textarea = document.createElement('textarea');
        textarea.placeholder = 'hola -> adiós\nregex:\\d+ -> NUMERO';
        textarea.value = reemplazos.map(p => p.join(' -> ')).join('\n');
        textarea.spellcheck = false;
        textarea.style.cssText = `
            width:100%; height:${alturaGuardada || '260px'};
            background:rgba(0,0,0,.35); color:#e5e9f0;
            border:1px solid rgba(255,255,255,.09); border-radius:14px;
            padding:14px; resize:vertical;
            font-size:14.5px; line-height:1.65; font-family:'SFMono-Regular', Menlo, monospace;
            box-sizing:border-box; outline:none;
            transition:border-color .15s ease, box-shadow .15s ease;
        `;
        textarea.onfocus = () => {
            textarea.style.borderColor = '#4fc3ff';
            textarea.style.boxShadow = '0 0 0 3px rgba(79,195,255,.15)';
        };
        textarea.onblur = () => {
            textarea.style.borderColor = 'rgba(255,255,255,.09)';
            textarea.style.boxShadow = 'none';
        };
        textarea.oninput = updateRuleCount;
        rtPanel.appendChild(textarea);

        // Persiste el alto del textarea (arrastrado a mano o vía Expandir/Reducir)
        // para que sobreviva a recargas de la página.
        let alturaSaveTimer = null;
        new ResizeObserver(() => {
            clearTimeout(alturaSaveTimer);
            alturaSaveTimer = setTimeout(() => {
                GM_setValue(TEXTAREA_HEIGHT_KEY, getComputedStyle(textarea).height);
            }, 400);
        }).observe(textarea);

        contador = document.createElement('div');
        contador.style.cssText = 'color:#64748b; font-size:12px; margin-top:-6px;';
        rtPanel.appendChild(contador);
        updateRuleCount();

        const nota = document.createElement('div');
        nota.textContent = '💡 Después de cambios grandes, recarga la página para ver el resultado más limpio.';
        nota.style.cssText = 'color:#54607a; font-size:11px; font-style:italic; margin-top:-4px;';
        rtPanel.appendChild(nota);

        /* SEPARADOR */
        const separador = document.createElement('div');
        separador.style.cssText = 'height:1px; background:rgba(255,255,255,.08); margin:2px 0;';
        rtPanel.appendChild(separador);

        /* BOTONES */
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display:flex; flex-direction:column; gap:8px;';
        rtPanel.appendChild(buttonContainer);

        const filaGuardarAgregar = document.createElement('div');
        filaGuardarAgregar.style.cssText = 'display:flex; gap:8px;';
        buttonContainer.appendChild(filaGuardarAgregar);

        const wrapGuardar = document.createElement('div');
        wrapGuardar.style.cssText = 'flex:2;';
        crearBoton(wrapGuardar, '💾 Guardar', 'linear-gradient(135deg,#34d399,#059669)', guardar);
        filaGuardarAgregar.appendChild(wrapGuardar);

        const wrapAgregar = document.createElement('div');
        wrapAgregar.style.cssText = 'flex:1;';
        crearBoton(wrapAgregar, '➕ ->', 'linear-gradient(135deg,#fb923c,#ea580c)', agregarFlecha);
        filaGuardarAgregar.appendChild(wrapAgregar);

        const filaSecundaria = document.createElement('div');
        filaSecundaria.style.cssText = 'display:flex; gap:8px;';
        buttonContainer.appendChild(filaSecundaria);

        const wrapImport = document.createElement('div');
        wrapImport.style.cssText = 'flex:1;';
        crearBoton(wrapImport, '📥 Importar', 'linear-gradient(135deg,#60a5fa,#2563eb)', importar);
        filaSecundaria.appendChild(wrapImport);

        const wrapExportSitio = document.createElement('div');
        wrapExportSitio.style.cssText = 'flex:1;';
        crearBoton(wrapExportSitio, '📤 Exportar sitio', 'linear-gradient(135deg,#c084fc,#9333ea)', exportarSitio);
        filaSecundaria.appendChild(wrapExportSitio);

        const wrapExportTodo = document.createElement('div');
        wrapExportTodo.style.cssText = 'flex:1;';
        crearBoton(wrapExportTodo, '📦 Exportar todo', 'linear-gradient(135deg,#a78bfa,#6d28d9)', exportarTodo);
        filaSecundaria.appendChild(wrapExportTodo);

        crearBoton(buttonContainer, '🗑️ Limpiar lista', 'linear-gradient(135deg,#fb7185,#e11d48)', limpiarLista);

        /* FAB */
        rtFab = document.createElement('button');
        rtFab.type = 'button';
        rtFab.className = 'rt-ui';
        rtFab.textContent = '☰';
        rtFab.title = 'Menú de reemplazo';
        rtFab.setAttribute('aria-expanded', 'false');
        rtFab.style.cssText = `
            position:fixed; right:20px; bottom:20px; width:44px; height:44px;
            border:none; border-radius:50%;
            background:linear-gradient(140deg,#60a5fa,#2563eb 60%,#1e3a8a);
            color:white; font-size:18px; font-weight:bold; cursor:pointer;
            display:flex; align-items:center; justify-content:center;
            z-index:999999;
            box-shadow:0 6px 18px rgba(37,99,235,.4), 0 0 0 1px rgba(255,255,255,.08) inset;
            transition:transform .2s ease, box-shadow .2s ease;
        `;
        rtFab.onmouseenter = () => {
            rtFab.style.boxShadow = '0 10px 30px rgba(37,99,235,.6), 0 0 0 1px rgba(255,255,255,.08) inset';
        };
        rtFab.onmouseleave = () => {
            rtFab.style.boxShadow = '0 8px 24px rgba(37,99,235,.45), 0 0 0 1px rgba(255,255,255,.08) inset';
        };
        rtFab.onclick = () => toggleMenu();
        document.body.appendChild(rtFab);

        /* CERRAR CON CLIC AFUERA / ESCAPE */
        document.addEventListener('click', e => {
            if (!panelAbierto) return;
            if (rtPanel.contains(e.target) || rtFab.contains(e.target)) return;
            toggleMenu(false);
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && panelAbierto) toggleMenu(false);
        });

        applyFloatingMenuVisibility();
    }

    /* ============================ INIT ============================ */

    // Igual que en el resaltador: se evita el evento 'load' porque en pestañas
    // en segundo plano el navegador retrasa la carga de imágenes y ese evento
    // podía tardar mucho (o no disparar) en llegar. 'document-idle' ya asegura
    // que el DOM esté listo, así que se arranca de inmediato.
    function init() {
        refresh();
        createFloatingMenu();
    }

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    }

    GM_registerMenuCommand('☰ Mostrar/Ocultar botón flotante', toggleFloatingMenuVisibility);

})();
