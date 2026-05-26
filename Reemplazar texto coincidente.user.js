// ==UserScript==
// @name         Reemplazar texto coincidente
// @namespace    http://tampermonkey.net/
// @version      2026.05.26
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

/* ============================ */

const dominio = location.hostname;

const MENU_VISIBLE_KEY = "rt_menu_visible";

/* ============================ DATA */

async function obtenerBase() {

    try {

        return JSON.parse(
            await GM_getValue(
                "reemplazosPorSitio",
                "{}"
            )
        );

    } catch {

        return {};
    }
}

async function guardarBase(base) {

    await GM_setValue(
        "reemplazosPorSitio",
        JSON.stringify(base)
    );
}

let base =
    await obtenerBase();

base[dominio] =
    base[dominio] || [];

let reemplazos =
    base[dominio];

/* ============================ REGEX */

function escaparRegex(texto) {

    return texto.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
    );
}

/* ============================ REEMPLAZOS */

function aplicarReemplazos(nodo) {

    if (
        nodo.nodeType !== 3 ||
        !reemplazos.length
    ) return;

    let texto =
        nodo.nodeValue;

    reemplazos.forEach(([original, nuevo]) => {

        if (
            original === undefined ||
            nuevo === undefined
        ) return;

        try {

            if (
                original.startsWith(
                    "regex:"
                )
            ) {

                const patron =
                    original.slice(6);

                const regex =
                    new RegExp(
                        patron,
                        'gi'
                    );

                texto =
                    texto.replace(
                        regex,
                        nuevo
                    );

            } else {

                const regex =
                    new RegExp(
                        `\\b${escaparRegex(original)}\\b`,
                        'gi'
                    );

                texto =
                    texto.replace(
                        regex,
                        nuevo
                    );
            }

        } catch {}
    });

    nodo.nodeValue =
        texto;
}

function recorrerNodos(nodo) {

    if (
        nodo.nodeType === 3
    ) {

        aplicarReemplazos(nodo);

    } else if (

        nodo.nodeType === 1 &&

        ![
            'SCRIPT',
            'STYLE',
            'TEXTAREA',
            'INPUT',
            'CODE',
            'PRE'
        ].includes(nodo.nodeName)

    ) {

        nodo.childNodes.forEach(
            recorrerNodos
        );
    }
}

function refresh() {

    recorrerNodos(
        document.body
    );
}

/* ============================ OBSERVER */

new MutationObserver(muts => {

    muts.forEach(m => {

        m.addedNodes.forEach(
            recorrerNodos
        );
    });

}).observe(document.body, {

    childList: true,

    subtree: true
});

/* ============================ OVERLAY */

let overlay;

function showOverlay(text) {

    if (!overlay) {

        overlay =
            document.createElement("div");

        overlay.style.cssText = `
            position:fixed;

            top:50%;
            left:50%;

            transform:
                translate(-50%,-50%);

            z-index:999999;
        `;

        const box =
            document.createElement("div");

        box.style.cssText = `
            width:420px;

            background:#0b1220;

            color:#fff;

            border:4px solid #4fc3ff;

            border-radius:20px;

            padding:20px;

            font-size:20px;
            font-weight:bold;

            text-align:center;

            white-space:pre-line;
        `;

        overlay.appendChild(box);

        document.body.appendChild(
            overlay
        );
    }

    overlay.firstChild.textContent =
        text;

    overlay.style.display =
        "block";

    setTimeout(() => {

        overlay.style.display =
            "none";

    }, 1800);
}

/* ============================ FUNCIONES */

async function guardar() {

    const nuevaLista =
        textarea.value
            .split('\n')

            .map(l =>
                l.split('->')
                    .map(x =>
                        x.trim()
                    )
            )

            .filter(p =>
                p.length === 2 &&
                p[0]
            );

    base =
        await obtenerBase();

    base[dominio] =
        nuevaLista;

    await guardarBase(
        base
    );

    reemplazos =
        base[dominio];

    refresh();

    showOverlay(
        "💾 Guardado"
    );
}

async function exportar() {

    try {

        const datos =
            await obtenerBase();

        const pretty =
            JSON.stringify(
                datos,
                null,
                2
            );

        const blob =
            new Blob(
                [pretty],
                {
                    type:
                        'application/json'
                }
            );

        GM_download({

            url:
                URL.createObjectURL(
                    blob
                ),

            name:
                'reemplazos_global.json',

            saveAs: true
        });

        showOverlay(
            "📤 Exportado"
        );

    } catch (e) {

        alert(
            'Error al exportar: ' +
            e.message
        );
    }
}

function importar() {

    const input =
        document.createElement(
            'input'
        );

    input.type = 'file';

    input.accept = '.json';

    input.style.display =
        'none';

    document.body.appendChild(
        input
    );

    input.addEventListener(
        'change',
        async () => {

            const file =
                input.files[0];

            if (!file)
                return;

            const text =
                await file.text();

            try {

                const nuevos =
                    JSON.parse(
                        text
                    );

                const actuales =
                    await obtenerBase();

                const fusionados = {

                    ...actuales,

                    ...nuevos
                };

                await guardarBase(
                    fusionados
                );

                base =
                    fusionados;

                reemplazos =
                    base[dominio] || [];

                textarea.value =
                    reemplazos
                        .map(p =>
                            p.join(
                                ' -> '
                            )
                        )
                        .join('\n');

                refresh();

                showOverlay(
                    "📥 Importado"
                );

            } catch (e) {

                alert(
                    'Error al importar: ' +
                    e.message
                );
            }

            input.remove();
        }
    );

    input.click();
}

function agregarFlecha() {

    const start =
        textarea.selectionStart;

    const end =
        textarea.selectionEnd;

    const texto =
        textarea.value;

    textarea.value =

        texto.slice(0, start) +

        ' -> ' +

        texto.slice(end);

    textarea.selectionStart =
        textarea.selectionEnd =
            start + 4;

    textarea.focus();
}

/* ============================ MENU */

let rtPanel;

let rtFab;

let textarea;

function toggleMenu() {

    rtPanel.style.display =

        rtPanel.style.display === "flex"

            ? "none"

            : "flex";
}

async function applyFloatingMenuVisibility() {

    const visible =
        await GM_getValue(
            MENU_VISIBLE_KEY,
            true
        );

    rtFab.style.display =
        visible
            ? "block"
            : "none";

    if (!visible) {

        rtPanel.style.display =
            "none";
    }
}

async function toggleFloatingMenuVisibility() {

    const visible =
        await GM_getValue(
            MENU_VISIBLE_KEY,
            true
        );

    await GM_setValue(
        MENU_VISIBLE_KEY,
        !visible
    );

    applyFloatingMenuVisibility();
}

/* ============================ PANEL */

async function createFloatingMenu() {

    if (rtPanel)
        return;

    rtPanel =
        document.createElement("div");

    rtPanel.id =
        "rt-panel";

    rtPanel.style.cssText = `
        position:fixed;

        right:20px;
        bottom:90px;

        width:420px;

        background:#0f172a;

        border:2px solid #334155;

        border-radius:18px;

        padding:16px;

        display:none;

        flex-direction:column;

        gap:12px;

        z-index:999999;

        box-shadow:
            0 10px 30px rgba(0,0,0,.45);
    `;

    document.body.appendChild(
        rtPanel
    );

    /* HEADER */

    const header =
        document.createElement("div");

    header.textContent =
        "🔤 Reemplazos";

    header.style.cssText = `
        color:white;

        font-size:18px;

        font-weight:bold;
    `;

    rtPanel.appendChild(
        header
    );

    /* TEXTAREA */

    textarea =
        document.createElement(
            "textarea"
        );

    textarea.placeholder =
        "hola -> adios\nregex:\\d+ -> NUMERO";

    textarea.value =
        reemplazos
            .map(p =>
                p.join(' -> ')
            )
            .join('\n');

    textarea.style.cssText = `
        width:100%;

        height:220px;

        background:#111827;

        color:white;

        border:1px solid #334155;

        border-radius:12px;

        padding:12px;

        resize:vertical;

        font-size:14px;

        font-family:monospace;

        box-sizing:border-box;
    `;

    rtPanel.appendChild(
        textarea
    );

    /* BOTONES */

    const buttonContainer =
        document.createElement("div");

    buttonContainer.style.cssText = `
        display:flex;

        flex-direction:column;

        gap:10px;
    `;

    rtPanel.appendChild(
        buttonContainer
    );

    function createBtn(
        text,
        color,
        action
    ) {

        const btn =
            document.createElement(
                "button"
            );

        btn.textContent =
            text;

        btn.onclick =
            action;

        btn.style.cssText = `
            width:100%;

            border:none;

            border-radius:12px;

            padding:12px;

            background:${color};

            color:white;

            font-size:14px;

            font-weight:600;

            cursor:pointer;
        `;

        buttonContainer.appendChild(
            btn
        );
    }

    createBtn(
        "💾 Guardar",
        "#16a34a",
        guardar
    );

    createBtn(
        "📥 Importar",
        "#2563eb",
        importar
    );

    createBtn(
        "📤 Exportar",
        "#9333ea",
        exportar
    );

    createBtn(
        "➕ Agregar ->",
        "#ea580c",
        agregarFlecha
    );

    /* FAB */

    rtFab =
        document.createElement(
            "button"
        );

    rtFab.textContent =
        "☰";

    rtFab.title =
        "Menú";

    rtFab.style.cssText = `
        position:fixed;

        right:20px;
        bottom:20px;

        width:60px;
        height:60px;

        border:none;

        border-radius:50%;

        background:#3b82f6;

        color:white;

        font-size:28px;

        font-weight:bold;

        cursor:pointer;

        z-index:999999;

        box-shadow:
            0 4px 12px rgba(0,0,0,.4);
    `;

    rtFab.onclick =
        toggleMenu;

    document.body.appendChild(
        rtFab
    );

    applyFloatingMenuVisibility();
}

/* ============================ ESTILOS */

GM_addStyle(`

#rt-panel textarea::placeholder{

    color:#94a3b8;
}

`);

/* ============================ INIT */

window.addEventListener(
    "load",
    async () => {

        refresh();

        createFloatingMenu();
    }
);

/* ============================ MENU */

GM_registerMenuCommand(

    "☰ Mostrar/Ocultar botón flotante",

    toggleFloatingMenuVisibility
);

})();
