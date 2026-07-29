# parra//terminal — Guía de construcción paso a paso
### Todo el código verificado, en orden de construcción

Este documento contiene **el proyecto completo** — el mismo código que fue compilado y verificado (`tsc` sin errores, `vite build` en verde). Síguelo de arriba a abajo: cada paso te dice qué archivo crear, el código va completo, y los comentarios dentro del código explican qué hace cada parte y por qué.

**La regla de construcción:** los pasos van de la capa más profunda (datos, motores) hacia arriba (orquestación, marco). Cada paso termina en un checkpoint — no avances sin que pase.

---

## PASO 0 — Fundación del proyecto

Crea el proyecto y sus dependencias:

```bash
bun create vite parra-terminal --template react-ts
cd parra-terminal
bun install
bun add tailwindcss @tailwindcss/vite
mkdir -p src/engine src/data src/components/blocks src/arcade
```

> Nota: `bun create vite` genera algunos archivos de plantilla (App.css, assets/, etc.). Puedes borrarlos — todos los archivos que importan los vas a crear tú siguiendo esta guía, reemplazando los de la plantilla cuando coincida el nombre.

Ahora reemplaza/crea los archivos de configuración:

**`package.json`**

```json
{
  "name": "parra-terminal",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "@vitejs/plugin-react": "^4.5.0",
    "tailwindcss": "^4.1.0",
    "typescript": "~5.8.0",
    "vite": "^6.3.0"
  }
}
```

> Las versiones exactas con las que se verificó el build. `bun install` tras pegar este package.json regenera el lock.

**`tsconfig.json`**

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }]
}
```

**`tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**`tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

**`vite.config.ts`**

```ts
// ─────────────────────────────────────────────────────────────
// vite.config.ts — configuración del bundler
// Solo dos plugins: React (JSX + Fast Refresh) y Tailwind 4
// (que en v4 se integra aquí, sin postcss.config ni tailwind.config)
// ─────────────────────────────────────────────────────────────
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**`index.html`**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jhorman Parra — Ingeniero de Software · parra@ccs:~$</title>
    <meta name="description" content="Portfolio de Jhorman Parra: full-stack, DevOps y gamedev desde Caracas. Del componente al clúster." />
    <meta property="og:title" content="Jhorman Parra — parra//terminal" />
    <meta property="og:description" content="Un portfolio que se usa como una terminal. Escribe whoami." />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Checkpoint 0:** `bun install && bun dev` levanta sin errores (verás la plantilla o pantalla vacía — normal, aún no hay app).

---

## PASO 1 — La piel completa (capa 0)

El archivo de estilos entero: tokens, CRT, y todas las clases de componentes. Lee el comentario de cabecera — contiene LA regla que evita el error `unknown utility class`.

**`src/index.css`**

```css
@import "tailwindcss";

/* ═══════════════════════════════════════════════════════════════
   CAPA 0 · LA PIEL — tokens y clases de componentes
   ───────────────────────────────────────────────────────────────
   REGLA DE ORO de este archivo (evita el error "unknown utility"):
   · @apply  → SOLO utilidades estándar (layout, espaciado, tamaño)
   · colores/fuentes custom → SIEMPRE var(--token), nunca @apply
   Los tokens de @theme generan además utilidades para el JSX
   (text-cyan, bg-panel, border-line…), que ahí sí funcionan.
   ═══════════════════════════════════════════════════════════════ */
@theme {
  --color-bg: #080a12;      /* fondo del viewport */
  --color-panel: #0a0e1c;   /* fondo de tarjetas */
  --color-fg: #c8d6e5;      /* texto principal */
  --color-fg2: #a9b6cc;     /* texto secundario */
  --color-dim: #5b6a86;     /* texto atenuado */
  --color-line: #17223c;    /* bordes sutiles */
  --color-line2: #24365a;   /* bordes visibles */
  --color-cyan: #22e5ff;    /* sistema / estructura */
  --color-mag: #ff2ea6;     /* acento */
  --color-grn: #4dff9e;     /* ok / juegos */
  --color-amb: #ffcc55;     /* dato vivo / notas personales */
  --color-red: #ff4d6d;     /* error */
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

/* ── BASE ── */
html { background: #000; }

body {
  @apply min-h-screen overflow-x-hidden text-[14px] leading-[1.65];
  font-family: var(--font-mono);
  color: var(--color-fg);
  background-color: var(--color-bg);
  /* halo tenue arriba, como luz de monitor */
  background-image: radial-gradient(120% 90% at 50% 0%, #12173010 0%, transparent 60%);
  -webkit-font-smoothing: antialiased;
}

::selection { background: var(--color-cyan); color: #000; }

a { @apply no-underline; color: var(--color-cyan); }
a:hover { color: var(--color-mag); text-shadow: 0 0 8px currentColor; }

:focus-visible { outline: 2px solid var(--color-amb); outline-offset: 2px; }

/* ── ANIMACIONES (a nivel raíz: dentro de @layer pueden dar
     problemas de orden en algunos procesadores) ── */
@keyframes flick   { 0%, 100% { opacity: 1; } 50% { opacity: .97; } }
@keyframes hoverY  { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@keyframes introIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; } }
@keyframes bootIn  { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; } }
@keyframes bootOut {
  0%   { opacity: 1; max-height: 20em; }
  35%  { opacity: .9; filter: brightness(1.5); }   /* destello antes de irse */
  100% { opacity: 0; max-height: 0; transform: translateY(-10px); }
}
@keyframes blink { 50% { opacity: 0; } }

/* ── COMPONENTES ── */
@layer components {

  /* CRT: scanlines (::before) + viñeta (::after). Fijo, sobre todo,
     sin capturar clics. El flicker es una clase aparte para poder
     desactivarlo con prefers-reduced-motion. */
  .crt { @apply fixed inset-0 z-50 pointer-events-none; }
  .crt::before {
    content: ""; position: absolute; inset: 0; mix-blend-mode: multiply;
    background: repeating-linear-gradient(0deg,
      rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,.28) 3px, rgba(0,0,0,0) 4px);
  }
  .crt::after {
    content: ""; position: absolute; inset: 0;
    background: radial-gradient(130% 130% at 50% 50%, transparent 55%, #000a 100%);
  }
  .crt-flicker { animation: flick .14s infinite; }

  /* glow sutil en el texto, como fósforo de monitor viejo */
  .phosphor { text-shadow: 0 0 2px currentColor; }

  /* partes del prompt: usuario verde, host cyan, ~ magenta */
  .ps-u { @apply font-bold; color: var(--color-grn); }
  .ps-h { @apply font-bold; color: var(--color-cyan); }
  .ps-d { color: var(--color-mag); }

  /* bloque de salida con regla izquierda */
  .out { @apply pl-3.5 my-1 ml-0.5; border-left: 2px solid #1e2a44; }

  /* rejilla clave→valor (neofetch, help, contacto) */
  .kv { @apply grid gap-x-3.5 gap-y-0.5; grid-template-columns: 130px 1fr; }
  .kv .k { color: var(--color-dim); }

  /* nota personal ámbar — la "voz honesta" del sitio */
  .note {
    @apply pl-3 my-1.5 opacity-90 whitespace-pre-wrap;
    color: var(--color-amb);
    border-left: 2px solid var(--color-amb);
  }

  /* encabezado de sección: icono + título + línea degradada.
     Variantes -mag/-grn/-amb solo cambian el color. */
  .sect { @apply flex items-center gap-2.5 mt-3.5 mb-1; color: var(--color-cyan); }
  .sect svg { @apply w-5 h-5 flex-none; filter: drop-shadow(0 0 5px #22e5ff88); }
  .sect .txt { @apply font-bold uppercase text-[12.5px] tracking-[.08em]; }
  .sect::after {
    content: ""; @apply flex-1 h-px;
    background: linear-gradient(90deg, #22e5ff55, transparent);
  }
  .sect-mag { color: var(--color-mag); }
  .sect-mag svg { filter: drop-shadow(0 0 5px #ff2ea688); }
  .sect-mag::after { background: linear-gradient(90deg, #ff2ea655, transparent); }
  .sect-grn { color: var(--color-grn); }
  .sect-grn svg { filter: drop-shadow(0 0 5px #4dff9e88); }
  .sect-grn::after { background: linear-gradient(90deg, #4dff9e55, transparent); }
  .sect-amb { color: var(--color-amb); }
  .sect-amb svg { filter: drop-shadow(0 0 5px #ffcc5588); }
  .sect-amb::after { background: linear-gradient(90deg, #ffcc5555, transparent); }

  /* tarjeta de registro (empleos, proyectos). La variante -game
     cambia el acento a verde: hover, icono y tags. */
  .rec {
    @apply p-3.5 my-2 flex gap-3.5 items-start;
    border: 1px solid var(--color-line);
    background: #0a0e1c8c;
  }
  .rec:hover {
    border-color: var(--color-cyan);
    box-shadow: 0 0 0 1px #22e5ff33, 0 0 22px #22e5ff14;
  }
  .rec-game:hover {
    border-color: var(--color-grn);
    box-shadow: 0 0 0 1px #4dff9e33, 0 0 22px #4dff9e14;
  }
  .ric {
    @apply flex-none w-[38px] h-[38px] rounded-[3px] flex items-center justify-center;
    border: 1px solid var(--color-line2);
    background: #0c1226;
    color: var(--color-cyan);
  }
  .ric svg { @apply w-[22px] h-[22px]; filter: drop-shadow(0 0 4px currentColor); }
  .rec-game .ric { border-color: #1f5a3e; color: var(--color-grn); }
  .tag {
    @apply text-[11px] px-[7px] py-px rounded-[2px];
    border: 1px solid var(--color-line2);
    color: var(--color-cyan);
  }
  .rec-game .tag { border-color: #1f5a3e; color: var(--color-grn); }

  /* marco de sprite pixel-art con flotación suave */
  .sprite {
    @apply flex-none w-14 h-14 rounded-[3px] flex items-center justify-center;
    border: 1px solid #1f5a3e;
    background: #071310;
  }
  .sprite svg {
    @apply w-11 h-11;
    filter: drop-shadow(0 0 6px #4dff9e55);
    animation: hoverY 2.2s ease-in-out infinite;
  }

  /* marco del avatar 24×24 con glow doble cyan/magenta */
  .avatar-px {
    @apply flex-none w-[150px] rounded-[3px] overflow-hidden;
    border: 1px solid var(--color-line2);
    background: var(--color-panel);
    box-shadow: 0 0 0 1px #22e5ff22, 0 0 26px #22e5ff18, 0 0 40px #ff2ea60e;
  }
  .avatar-px svg { @apply block w-full h-auto; }

  /* banner ASCII: inline-block centra el bloque desde fuera
     manteniendo el arte alineado por dentro */
  .banner {
    @apply inline-block text-left whitespace-pre overflow-hidden;
    color: var(--color-cyan);
    font-size: clamp(6px, 1.9vw, 13px);
    line-height: 1.1;
    text-shadow: 0 0 6px #22e5ff88, 0 0 14px #22e5ff44;
  }
  .tagline { @apply mt-1.5; color: var(--color-mag); text-shadow: 0 0 8px #ff2ea666; }
  .intro { @apply text-center my-1.5; animation: introIn .55s ease-out both; }

  /* boot: cada línea entra por la izquierda; el bloque entero
     sale junto (bootlog-out) al completarse la barra */
  .bootlog { @apply overflow-hidden; max-height: 20em; }
  .bootline { animation: bootIn .3s ease-out both; }
  .bootlog-out { animation: bootOut .7s ease-in forwards; }

  /* cursor de bloque parpadeante */
  .cur {
    @apply inline-block w-[9px] h-[1.05em] translate-y-0.5;
    background: var(--color-cyan);
    box-shadow: 0 0 8px var(--color-cyan);
    animation: blink 1s steps(1) infinite;
  }

  /* chip clicable (HintBar y botón de sonido). background y
     font-family explícitos porque ahora es un <button>. */
  .chip {
    @apply px-2 py-px rounded-[2px] cursor-pointer transition-all duration-150 text-[11.5px];
    border: 1px solid var(--color-line2);
    color: var(--color-cyan);
    background: transparent;
    font-family: var(--font-mono);
  }
  .chip:hover {
    background: var(--color-cyan);
    color: #000;
    box-shadow: 0 0 12px #22e5ff66;
  }

  /* panel del arcade */
  .game-host {
    @apply p-2.5 my-2 max-w-[520px];
    border: 1px solid var(--color-line2);
    background: #070a14;
    box-shadow: 0 0 0 1px #22e5ff1a, 0 0 24px #22e5ff10;
  }
  .game-host canvas {
    @apply block w-full;
    border: 1px solid var(--color-line);
    background: #05070f;
    image-rendering: pixelated;   /* el canvas 240×160 se escala nítido */
    touch-action: none;           /* los toques van al juego, no al scroll */
  }
  .game-hud {
    @apply flex justify-between text-[11.5px] mb-2 uppercase tracking-[.06em];
    color: var(--color-dim);
  }
  .game-hud b { color: var(--color-amb); }
}

/* ── ACCESIBILIDAD: sin animaciones si el sistema lo pide ── */
@media (prefers-reduced-motion: reduce) {
  .crt-flicker, .cur, .sprite svg, .intro, .bootline, .bootlog-out {
    animation: none !important;
  }
}
```

**Checkpoint 1:** con un `<div className="note">// prueba</div>` en el App de la plantilla, ves la nota ámbar con borde izquierdo.

---

## PASO 2 — Tus datos (capa 1)

Todo tu contenido en un archivo. No importa nada; nada de abajo puede romperlo. Actualizar tu CV en el futuro = editar solo aquí.

**`src/data/profile.ts`**

```ts
/* ═══════════════════════════════════════════════════════════════
   CAPA 1 · DATOS — todo tu contenido, cero lógica
   ───────────────────────────────────────────────────────────────
   Este archivo no importa NADA. Es la capa más profunda.
   Actualizar tu CV = editar aquí. Ningún componente cambia.
   `as const` congela los datos y da tipos literales: si un
   bloque espera icono "box" | "heart"…, TS avisa si te equivocas.
   ═══════════════════════════════════════════════════════════════ */

export const identity = {
  usuario: "jhorman parra",
  titulo: "Ing. en Informática · FullStack",
  rol: "Líder de proyecto",
  host: "Caracas, Venezuela",
  uptime: "5+ años en producción",
  shell: "React · Node · K8s",
  formacion: "UNERG (2023)",
  idiomas: "es nativo · en técnico",
  estado: "● disponible para contrato",
  lema: "Construyo el producto completo y lo mantengo corriendo yo mismo: del componente al clúster.",
  nota: "// empecé maquetando HTML a mano en Caracas y terminé administrando Kubernetes desde mi cuarto.\n// nunca hubo un plan: hubo curiosidad y cosas que se rompieron.",
} as const;

export const jobs = [
  {
    id: "ent_01",
    empresa: "Sistemas Tecnológicos Alcaraván S.A.",
    periodo: "2021 — presente",
    lugar: "San Juan de los Morros, VE",
    rol: "Líder de proyecto · front-end y back-end",
    running: true,
    logros: [
      "Lidero varios equipos en proyectos simultáneos y respondo por cada entrega.",
      "Ciclo completo bajo metodologías ágiles: planificación, despliegue y soporte.",
      "Aplicaciones full-stack con React, Next.js, Node.js y MongoDB.",
    ],
    nota: "// liderar es sobre todo desbloquear a otros, no escribir más código. me costó un año entenderlo.",
  },
  {
    id: "ent_02",
    empresa: "Requiem Innovation",
    periodo: "2019 — 2020",
    lugar: "Lima, PE",
    rol: "Desarrollador web · Administrador de producto",
    running: false,
    logros: [
      "Aplicaciones web dinámicas en JavaScript moderno.",
      "Ciclo de vida del producto: funcionalidades, lanzamientos y rendimiento.",
      "Trabajo con diseño UX/UI para llevar interfaces a producción.",
    ],
    nota: "// mi primer cliente fuera de Venezuela. aprendí a documentar por necesidad. sigue siendo mi mejor hábito.",
  },
  {
    id: "ent_03",
    empresa: "Waremedia",
    periodo: "2018 — 2019",
    lugar: "Caracas, VE",
    rol: "Desarrollador web · Diseñador UI",
    running: false,
    logros: [
      "Sitios responsivos y optimizados para SEO en HTML, CSS y JavaScript.",
      "Maquetas de diseño convertidas en interfaces funcionales.",
      "Revisiones de código y procesos de equipo.",
    ],
    nota: "// sin frameworks, todo a mano. entendí el navegador antes que React. no lo cambiaría.",
  },
] as const;

/* `sprite` solo existe en los juegos: los bloques comprueban
   ("sprite" in p) para decidir si muestran pixel art o icono. */
export const projects = [
  {
    id: "bld_01", nombre: "Control académico UCV", icono: "box", game: false,
    meta: "MVP · precio cerrado · despliegue propio",
    desc: "Sistema de control de estudiantes para la Facultad de Farmacia. Ocho módulos.",
    tags: ["Next.js", "NestJS", "PostgreSQL", "K3s"],
  },
  {
    id: "bld_02", nombre: "Energía Solidaria", icono: "heart", game: false,
    meta: "respuesta a los sismos de jun/2026",
    desc: "Sitio de ayuda humanitaria con panel público de transparencia sobre lo recaudado y entregado.",
    tags: ["Vite", "React", "TypeScript", "Tailwind"],
  },
  {
    id: "bld_03", nombre: "Aromía Studios", icono: "box", game: false,
    meta: "marca + web + infra, una sola persona",
    desc: "Sitio y calendario de cursos de una escuela de cocina. Diseño, front-end e infraestructura.",
    tags: ["Next.js", "Supabase", "Traefik", "Marca"],
  },
  {
    id: "ent_04", nombre: "VESPER — el vuelo del silencio", icono: "chip", game: true, sprite: "bat",
    meta: "pixel art · supervivencia · Steam",
    desc: "Eres un murciélago. Seis depredadores con comportamiento biológico real, cinco hábitats, ecolocalización como mecánica central.",
    tags: ["Godot", "Game design", "Pixel art"],
    nota: "// llevo meses puliendo la animación de aleteo. nadie lo va a notar. yo sí, y por eso sigo.",
  },
  {
    id: "ent_05", nombre: "Element Slime Survival", icono: "chip", game: true, sprite: "slime",
    meta: "roguelite móvil · sistemas",
    desc: "Nueve estadísticas, estados elementales combinables, cinco zonas y una zona final secreta.",
    tags: ["Sistemas", "Balance", "Pixel art"],
    nota: "// diseñar un sistema de daño elemental y un esquema de base de datos usan el mismo músculo.",
  },
  {
    id: "bld_06", nombre: "Plataformas educativas", icono: "grad", game: false,
    meta: "matemática interactiva",
    desc: "Moodle LMS + editores de fórmulas y gráficas manipulables en el navegador.",
    tags: ["Moodle", "MathLive", "JSXGraph", "Atomic Design"],
  },
] as const;

export const stack = [
  ["Interfaz", "React · Next.js · TypeScript · TailwindCSS · Atomic Design · HTML · CSS"],
  ["Servidor", "Node.js · NestJS · JavaScript · APIs REST · arquitectura de servicios"],
  ["Datos", "PostgreSQL · MongoDB · Redis · SQL y NoSQL · modelado de esquemas"],
  ["Entrega", "Docker · Kubernetes (K3s) · Traefik · cert-manager · GitHub Actions · Git"],
  ["Equipo", "Liderazgo de proyecto · Scrum · Kanban · mentoría · revisión de código"],
  ["Especialidad", "Moodle LMS · MathLive · JSXGraph · Godot · pixel art · diseño de marca"],
] as const;

export const contact = {
  correo: "develpvoi0@gmail.com",
  linkedin: "https://www.linkedin.com/in/jhormanparra/",
  linkedinLabel: "/in/jhormanparra",
  telefono: "+58 414 4677 808",
  telHref: "tel:+584144677808",
  nota: "// respondo. a veces tarde, pero respondo. si no puedo con tu proyecto te lo digo el primer día.",
} as const;

/* Guion del arranque: texto, si va atenuado, cuánto espera antes
   de la siguiente línea, y el tono del beep que la acompaña. */
export const bootScript = [
  { text: "parra//os v5.0 — cargando entorno seguro...", dim: true, delay: 520, tone: 880 },
  { text: "[ ok ] montando /dev/curiosity", dim: false, delay: 480, tone: 520 },
  { text: "[ ok ] conectando k3s://contabo-vps", dim: false, delay: 520, tone: 560 },
  { text: "[ ok ] verificando certificados tls", dim: false, delay: 520, tone: 600 },
  { text: "[ ok ] sincronizando pipeline github-actions", dim: false, delay: 560, tone: 640 },
] as const;
```

**Checkpoint 2:** el archivo compila (`bun run build` no da errores de tipos en él).

---

## PASO 3 — Los motores (capa 2, cero React)

Cuatro módulos de TypeScript puro. En orden: contratos, sonido, arte, y el cable entre hermanos del árbol.

**`src/engine/types.ts`**

```ts
/* ═══════════════════════════════════════════════════════════════
   CAPA 2 · types.ts — los contratos del sistema
   ───────────────────────────────────────────────────────────────
   CommandCtx es la pieza clave: un comando NO recibe acceso al
   Terminal, recibe un menú de CAPACIDADES. Eso lo hace testeable
   (pásale un ctx falso) y desacoplado (el Terminal puede cambiar
   por dentro sin que ningún comando se entere).
   ═══════════════════════════════════════════════════════════════ */
import type { ReactNode } from "react";

export type GameKind = "snake" | "bat";

export type CommandCtx = {
  print: (node: ReactNode) => void;      // añade una entrada al log
  clear: () => void;                     // vacía el log
  launchGame: (kind: GameKind) => void;  // monta un juego
};

export type Command = {
  desc: string;                          // texto que muestra `help`
  run: (ctx: CommandCtx) => void;        // qué hace el comando
};
```

**`src/engine/audio.ts`**

```ts
/* ═══════════════════════════════════════════════════════════════
   CAPA 2 · audio.ts — motor de sonido (singleton, CERO React)
   ───────────────────────────────────────────────────────────────
   ¿Por qué módulo y no estado de React? Porque el sonido es un
   EFECTO del mundo, no algo que la UI refleje. Los componentes
   lo INVOCAN en handlers; nunca depende de renders.
   El AudioContext se crea PEREZOSAMENTE (primer uso): los
   navegadores lo bloquean hasta que el usuario interactúa.
   Todo va en try/catch: si el audio falla, la app sigue muda
   pero viva.
   ═══════════════════════════════════════════════════════════════ */
let ac: AudioContext | null = null;
let noiseBuf: AudioBuffer | null = null;   // ruido pre-generado para el clic
let muted = false;

function ctx(): AudioContext {
  if (!ac) {
    ac = new AudioContext();
    // 60ms de ruido blanco con decaimiento cuadrático: la "carne"
    // del clic mecánico. Se genera una vez y se reutiliza.
    const len = ac.sampleRate * 0.06;
    noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  }
  if (ac.state === "suspended") void ac.resume();
  return ac;
}

export const audio = {
  setMuted(v: boolean) { muted = v; },
  isMuted: () => muted,

  /* Clic de tecla = ruido filtrado (bandpass) + pop tonal corto.
     La frecuencia lleva un random leve para que dos teclas nunca
     suenen idénticas — como un teclado real.
     deep: versión grave (Enter). soft: mitad de volumen (tecleo
     automático del typewriter). */
  keyClick(deep = false, soft = false) {
    if (muted) return;
    try {
      const a = ctx(), t = a.currentTime, v = soft ? 0.5 : 1;
      const n = a.createBufferSource(); n.buffer = noiseBuf!;
      const f = a.createBiquadFilter(); f.type = "bandpass";
      f.frequency.value = (deep ? 900 : 2200) + Math.random() * 600;
      f.Q.value = 1.4;
      const g = a.createGain();
      g.gain.setValueAtTime((deep ? 0.22 : 0.12) * v, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + (deep ? 0.09 : 0.05));
      n.connect(f); f.connect(g); g.connect(a.destination); n.start(t);
      const o = a.createOscillator(); o.type = "square";
      o.frequency.setValueAtTime((deep ? 140 : 340) + Math.random() * 40, t);
      const og = a.createGain();
      og.gain.setValueAtTime((deep ? 0.05 : 0.025) * v, t);
      og.gain.exponentialRampToValueAtTime(0.0008, t + 0.03);
      o.connect(og); og.connect(a.destination); o.start(t); o.stop(t + 0.04);
    } catch { /* sin audio: la app sigue */ }
  },

  /* Beep de sistema: onda triángulo con decaimiento. Boot,
     confirmaciones, puntos del arcade… */
  beep(freq: number, dur = 0.08, vol = 0.05) {
    if (muted) return;
    try {
      const a = ctx(), t = a.currentTime;
      const o = a.createOscillator(), g = a.createGain();
      o.type = "triangle"; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
    } catch { /* sin audio: la app sigue */ }
  },

  /* Error: dos zumbidos graves descendentes. */
  errBuzz() {
    audio.beep(110, 0.16, 0.07);
    setTimeout(() => audio.beep(92, 0.18, 0.07), 70);
  },
};
```

**`src/engine/sprites.ts`**

```ts
/* ═══════════════════════════════════════════════════════════════
   CAPA 2 · sprites.ts — arte como datos (fuente única)
   ───────────────────────────────────────────────────────────────
   Cada sprite es UN string-mapa + UNA paleta que alimentan DOS
   renderizadores: <PixelSprite/> (SVG, tarjetas) y drawMap()
   (canvas, arcade). Rediseñas el murciélago aquí y ambos mundos
   se actualizan. Cada letra del mapa es un color de la paleta;
   los caracteres sin entrada ('.') son transparentes.
   ═══════════════════════════════════════════════════════════════ */

export const BATMAP = `
..a......a..
.aba....aba.
abbba..abbba
abbbbaabbbba
.abbbccbbba.
..abccccba..
...acdcda...
...acccca...
....a..a....
....e..e....`;

export const BATPAL: Record<string, string> = {
  a: "#1a2f4a", b: "#3b5a8a", c: "#22e5ff", d: "#ff2ea6", e: "#5b6a86",
};

export const SLIMEMAP = `
....abba....
..abbbbbba..
.abbcbbcbba.
.abbbbbbbba.
abbdbbbbdbba
abbbbbbbbbba
abbbbeebbbba
.abbbbbbbba.
..aabbbbaa..
....aaaa....`;

export const SLIMEPAL: Record<string, string> = {
  a: "#0f3d2a", b: "#4dff9e", c: "#071310", d: "#c8ffe4", e: "#071310",
};

/* Retrato 24×24: buzz cut, lentes redondos con cristal cyan,
   barba, chaqueta; letreros de neón magenta/cyan a los lados. */
export const FACEMAP = `
aabaamaabaaaaaaaabaacaba
abaaamaaaaaaaaaaaaaacaab
aamaaabaaahhhhhhaabacaaa
aabmaaaaahhhhhhhhaaaacba
aamaaaaahhhhhhhhhhaacaaa
abaaaaaahsssssssshaaacab
aamaaaaahsssssssshaacaaa
aabaaaaahsssssssshaabaca
aamaaabtgllggggllgtbacaa
aabaaaatgllggggllgtaacba
aamaaaaassssttssssaacaaa
aabaaaaassssttssssaabaaa
aamaaaaasffffffffsaacaba
abaaaaaaffffttffffaaacaa
aabaaaaaffffffffffaabaaa
aabaaaaaaffffffffaaacaba
aamaaaaaabffffffbaaacaab
aabajjjkjjjtsstjjjkjjjba
abjjjkkjjjkttkjjjkkjjjaa
ajjkjjjjkkjjjjkkjjjjkjja
jjjjkjjjjjjkkjjjjjjkjjjj
jkjjjjjkjjjjjjkjjjjjjjkj
jjjjjjjjjjkjjjjjjkjjjjjj
jjjjjjjjjjjjjjjjjjjjjjjj`;

export const FACEPAL: Record<string, string> = {
  a: "#0a0e1c", b: "#141d33", m: "#ff2ea6", c: "#22e5ff", h: "#1c2233",
  s: "#d9a066", t: "#b3763f", f: "#2b2018", g: "#dde8f4", l: "#7fdcff",
  j: "#0d1016", k: "#222c42",
};

/* Banner JPARRA en ANSI-shadow. String.raw evita que los escapes
   se interpreten; .slice(1) quita el salto de línea inicial. */
export const BANNER = String.raw`
     ██╗██████╗  █████╗ ██████╗ ██████╗  █████╗ 
     ██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗
     ██║██████╔╝███████║██████╔╝██████╔╝███████║
██╗  ██║██╔═══╝ ██╔══██║██╔══██╗██╔══██╗██╔══██║
╚█████╔╝██║     ██║  ██║██║  ██║██║  ██║██║  ██║
 ╚════╝ ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝`.slice(1);

/* Dibuja un mapa en canvas (lo usa el arcade). El +0.2 en el
   tamaño evita hairlines entre celdas por redondeo de subpíxel. */
export function drawMap(
  c2: CanvasRenderingContext2D,
  map: string,
  pal: Record<string, string>,
  x: number,
  y: number,
  s: number,
): void {
  const rows = map.trim().split("\n");
  for (let ry = 0; ry < rows.length; ry++) {
    for (let rx = 0; rx < rows[ry].length; rx++) {
      const col = pal[rows[ry][rx]];
      if (col) {
        c2.fillStyle = col;
        c2.fillRect(x + rx * s, y + ry * s, s + 0.2, s + 0.2);
      }
    }
  }
}
```

**`src/engine/bus.ts`**

```ts
/* ═══════════════════════════════════════════════════════════════
   CAPA 2 · bus.ts — un cable entre hermanos del árbol
   ───────────────────────────────────────────────────────────────
   Problema: la HintBar necesita ejecutar comandos que viven en el
   Terminal, pero son HERMANOS en React (ninguno es padre del otro).
   Subir el estado a App contaminaría App; un Context es maquinaria
   pesada para un solo mensaje. Solución honesta: este emisor
   mínimo de un solo enchufe. El Terminal se suscribe al montar y
   `on` devuelve la des-suscripción para el cleanup del efecto.
   ═══════════════════════════════════════════════════════════════ */
type Handler = (cmd: string) => void;
let handler: Handler | null = null;

export const bus = {
  emit(cmd: string) { handler?.(cmd); },
  on(h: Handler): () => void {
    handler = h;
    return () => { handler = null; };
  },
};
```

**Checkpoint 3:** en la consola del navegador (con `bun dev` corriendo y tras un clic en la página), importar y llamar `audio.beep(660)` suena.

---

## PASO 4 — Los primitivos (capa 3)

Las tres piezas UI reutilizables. En `TypedBlock`, lee con calma el comentario de `skip0`: es el detalle más sutil del proyecto.

**`src/components/PixelSprite.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 3 · PixelSprite.tsx — mapa de píxeles → SVG
   ───────────────────────────────────────────────────────────────
   Componente PURO: mismos props → mismo SVG. Sin estado, sin
   efectos. shapeRendering="crispEdges" es lo que mantiene el
   pixel art nítido al escalar (sin él, el navegador lo suaviza).
   ═══════════════════════════════════════════════════════════════ */
export function PixelSprite({ map, palette, cell = 4, className }: {
  map: string;
  palette: Record<string, string>;
  cell?: number;
  className?: string;
}) {
  const rows = map.trim().split("\n");
  return (
    <svg
      viewBox={`0 0 ${rows[0].length * cell} ${rows.length * cell}`}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          palette[ch] ? (
            <rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell}
              height={cell}
              fill={palette[ch]}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
```

**`src/components/TypedBlock.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 3 · TypedBlock.tsx — el typewriter React-idiomático
   ───────────────────────────────────────────────────────────────
   Idea central: NO se "camina el DOM tecleando" (eso pelearía con
   React). El texto es DATO (segmentos) y lo visible es ESTADO
   (un contador de caracteres). El render recorta los segmentos
   hasta el contador; React reconcilia el resto.
   ═══════════════════════════════════════════════════════════════ */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { audio } from "../engine/audio";

/* Un trozo de texto con estilo opcional. Una salida = Seg[] */
export type Seg = { text: string; className?: string };

/* Señal global de salto: el Terminal la incrementa con cualquier
   interacción. Los bloques la observan por Context. */
export const SkipCtx = createContext(0);

export function usePrefersReducedMotion(): boolean {
  // useMemo: se consulta una sola vez por montaje; no cambia en vivo
  return useMemo(() => matchMedia("(prefers-reduced-motion: reduce)").matches, []);
}

export function TypedBlock({ segs, className, onDone }: {
  segs: Seg[];
  className?: string;
  onDone?: () => void;
}) {
  const skip = useContext(SkipCtx);

  /* ── EL DETALLE MÁS SUTIL DEL PROYECTO ──
     La señal de salto es un contador global que crece con cada
     interacción de la sesión. Si reaccionáramos a "señal > 0",
     todo bloque montado DESPUÉS del primer clic nacería ya
     completo: el tecleo moriría para siempre tras la primera
     interacción. Solución: memorizar el valor de la señal AL
     NACER (skip0) y saltar solo si cambió DESPUÉS. Distingue
     "hubo un clic alguna vez" de "hubo un clic durante MI tecleo". */
  const skip0 = useRef(skip);

  const still = usePrefersReducedMotion();
  const total = useMemo(() => segs.reduce((n, s) => n + s.text.length, 0), [segs]);

  /* Accesibilidad como valor inicial, no como parche: con
     animaciones reducidas el bloque NACE completo. */
  const [count, setCount] = useState(still ? total : 0);

  /* onDone debe disparar EXACTAMENTE una vez, aunque el efecto
     corra doble (StrictMode en dev duplica efectos). */
  const doneRef = useRef(false);

  /* saltar si la señal cambió después de nuestro nacimiento */
  useEffect(() => {
    if (skip !== skip0.current) setCount(total);
  }, [skip, total]);

  /* El motor: cada 12ms revela 3 caracteres más. El timeout se
     limpia en el return — desmontar el bloque detiene el tecleo
     sin fugas. El clic suave suena cada ~9 caracteres (27/3):
     presencia sin metralleta. */
  useEffect(() => {
    if (count >= total) {
      if (!doneRef.current) { doneRef.current = true; onDone?.(); }
      return;
    }
    if (count % 27 === 0) audio.keyClick(false, true);
    const id = setTimeout(() => setCount(c => Math.min(total, c + 3)), 12);
    return () => clearTimeout(id);
  }, [count, total, onDone]);

  /* Render: repartir `count` caracteres entre los segmentos en
     orden. `left` es cuántos quedan por asignar. */
  let left = count;
  return (
    <div className={`whitespace-pre-wrap ${className ?? ""}`}>
      {segs.map((s, i) => {
        const take = Math.max(0, Math.min(s.text.length, left));
        left -= take;
        return (
          <span key={i} className={s.className}>
            {s.text.slice(0, take)}
          </span>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   useSteps — coreografía sin coreógrafo
   ───────────────────────────────────────────────────────────────
   Para encadenar bloques tecleados dentro de una salida:
   la parte N llama next() en su onDone, la parte N+1 se renderiza
   cuando step >= N. Cada bloque compone su propia secuencia; no
   hay un director central que pueda romperse.
   ═══════════════════════════════════════════════════════════════ */
export function useSteps() {
  const [step, setStep] = useState(0);
  return { step, next: () => setStep(s => s + 1) };
}
```

**`src/components/Icons.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 3 · Icons.tsx — iconografía de trazo neón + Section
   ───────────────────────────────────────────────────────────────
   Los iconos son JSX estático compartiendo props de trazo (P).
   `satisfies` valida el shape sin perder los nombres literales:
   así `keyof typeof Icons` sirve como tipo ("user" | "clock" | …)
   y los datos de profile.ts quedan verificados contra él.
   Section es el encabezado icono+título+línea que abre cada
   comando; `tone` elige la variante de color del CSS.
   ═══════════════════════════════════════════════════════════════ */
import type { ReactNode } from "react";

const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.6 } as const;

export const Icons = {
  user: (
    <svg viewBox="0 0 24 24" {...P}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" {...P}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  server: (
    <svg viewBox="0 0 24 24" {...P}>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <circle cx="7.5" cy="7.5" r=".9" fill="currentColor" />
      <circle cx="7.5" cy="16.5" r=".9" fill="currentColor" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" {...P}>
      <path d="M12 2 21 7v10l-9 5-9-5V7l9-5z" />
      <path d="M3.2 7.3 12 12l8.8-4.7M12 12v9.5" />
    </svg>
  ),
  chip: (
    <svg viewBox="0 0 24 24" {...P}>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <path d="M10 2v4M14 2v4M10 18v4M14 18v4M2 10h4M2 14h4M18 10h4M18 14h4" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" {...P}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  ),
  grad: (
    <svg viewBox="0 0 24 24" {...P}>
      <path d="M2 9.5 12 5l10 4.5L12 14 2 9.5z" />
      <path d="M6.5 11.7V16c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.3M21 10v5" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" {...P}>
      <path d="M12 20.5S4 15 4 9.6C4 6.8 6.2 5 8.5 5c1.6 0 3 .8 3.5 2 .5-1.2 1.9-2 3.5-2C17.8 5 20 6.8 20 9.6c0 5.4-8 10.9-8 10.9z" />
    </svg>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof Icons;

export function Section({ icon, children, tone }: {
  icon: IconName;
  children: ReactNode;
  tone?: "mag" | "grn" | "amb";
}) {
  return (
    <div className={`sect ${tone ? `sect-${tone}` : ""}`}>
      {Icons[icon]}
      <span className="txt">{children}</span>
    </div>
  );
}
```

**Checkpoint 4:** montando `<PixelSprite map={BATMAP} palette={BATPAL} className="w-12"/>` en el App temporal se ve el murciélago nítido, y un `<TypedBlock segs={[{text:"hola mundo"}]}/>` teclea con clics suaves.

---

## PASO 5 — Los bloques de contenido (capa 4)

Un componente por comando. Todos siguen el mismo patrón (léelo en el comentario de Neofetch): **lo estructural aparece, lo personal se teclea**. Puedes desarrollar cada uno montándolo suelto en App antes de conectarlo.

**`src/components/blocks/Neofetch.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 4 · Neofetch.tsx — salida de `whoami`
   ───────────────────────────────────────────────────────────────
   Patrón de todo bloque: LO ESTRUCTURAL APARECE, LO PERSONAL SE
   TECLEA. Avatar y ficha → instantáneos (teclearlos sería ruido).
   Lema y nota → TypedBlock (el efecto les da voz).
   La coreografía lema→nota se encadena con useSteps: el lema
   llama next() al terminar y eso habilita la nota.
   onDone es opcional: el bloque funciona igual suelto que dentro
   del Terminal — por eso puedes desarrollarlo aislado.
   ═══════════════════════════════════════════════════════════════ */
import { PixelSprite } from "../PixelSprite";
import { TypedBlock, useSteps } from "../TypedBlock";
import { Section } from "../Icons";
import { FACEMAP, FACEPAL } from "../../engine/sprites";
import { identity } from "../../data/profile";

export function Neofetch({ onDone }: { onDone?: () => void }) {
  const { step, next } = useSteps();

  const ficha: [string, string][] = [
    ["usuario", identity.usuario],
    ["título", identity.titulo],
    ["rol", identity.rol],
    ["host", identity.host],
    ["uptime", identity.uptime],
    ["shell", identity.shell],
    ["formación", identity.formacion],
    ["idiomas", identity.idiomas],
    ["estado", identity.estado],
  ];

  return (
    <div>
      <Section icon="user">identity</Section>

      {/* avatar + ficha: instantáneos */}
      <div className="flex flex-wrap gap-5 items-start my-2.5">
        <div className="avatar-px">
          <PixelSprite map={FACEMAP} palette={FACEPAL} cell={5} />
        </div>
        <div className="kv min-w-[260px] self-center">
          {ficha.map(([k, v]) => (
            // `contents` hace que k y v participen del grid del padre
            <div key={k} className="contents">
              <span className="k">{k}</span>
              <span
                className={
                  k === "usuario" ? "text-cyan font-bold"
                  : k === "uptime" ? "text-amb"
                  : k === "estado" ? "text-grn"
                  : ""
                }
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* lema tecleado → habilita la nota → la nota cierra con onDone */}
      <TypedBlock segs={[{ text: identity.lema }]} onDone={next} />
      {step >= 1 && (
        <TypedBlock className="note" segs={[{ text: identity.nota }]} onDone={onDone} />
      )}
    </div>
  );
}
```

**`src/components/blocks/HistoryList.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 4 · HistoryList.tsx — salida de `history`
   ───────────────────────────────────────────────────────────────
   Mapea jobs de profile.ts a tarjetas .rec. El empleo activo
   muestra "● running" verde; los cerrados, "exit 0" atenuado.
   Solo la ÚLTIMA nota recibe onDone: es la que cierra el bloque.
   ═══════════════════════════════════════════════════════════════ */
import { Icons, Section } from "../Icons";
import { TypedBlock } from "../TypedBlock";
import { jobs } from "../../data/profile";

export function HistoryList({ onDone }: { onDone?: () => void }) {
  return (
    <div>
      <Section icon="clock">runtime · trayectoria</Section>
      {jobs.map((j, i) => (
        <article key={j.id} className="rec">
          <div className="ric">{Icons.clock}</div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-2.5 flex-wrap items-baseline">
              <span className="font-bold">{j.empresa}</span>
              <span className="text-[11.5px] text-mag">
                {j.id} ·{" "}
                {j.running
                  ? <span className="text-grn">● running</span>
                  : <span className="text-dim">exit 0</span>}
              </span>
            </div>
            <div className="text-dim text-xs mt-0.5 mb-2">
              {j.periodo} · {j.lugar} — {j.rol}
            </div>
            {j.logros.map((l, k) => (
              <div key={k} className="text-dim">
                {"  ─ "}<span className="text-fg2">{l}</span>
              </div>
            ))}
            <TypedBlock
              className="note mt-2.5"
              segs={[{ text: j.nota }]}
              onDone={i === jobs.length - 1 ? onDone : undefined}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
```

**`src/components/blocks/ProjectList.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 4 · ProjectList.tsx — salida de `projects`
   ───────────────────────────────────────────────────────────────
   Dos familias visuales: producción (icono cyan) y juegos
   (sprite pixel-art + acento verde vía .rec-game). La decisión
   la toman los datos: `game` y `sprite` en profile.ts.
   ("sprite" in p) es narrowing de TS: solo los juegos lo tienen.
   ═══════════════════════════════════════════════════════════════ */
import { Icons, Section, type IconName } from "../Icons";
import { PixelSprite } from "../PixelSprite";
import { TypedBlock } from "../TypedBlock";
import { BATMAP, BATPAL, SLIMEMAP, SLIMEPAL } from "../../engine/sprites";
import { projects } from "../../data/profile";

const SPRITES = {
  bat: { map: BATMAP, pal: BATPAL },
  slime: { map: SLIMEMAP, pal: SLIMEPAL },
} as const;

export function ProjectList({ onDone }: { onDone?: () => void }) {
  return (
    <div>
      <Section icon="box">builds · producción y juegos</Section>

      {projects.map(p => (
        <article key={p.id} className={`rec ${p.game ? "rec-game" : ""}`}>
          {"sprite" in p ? (
            <div className="sprite">
              <PixelSprite map={SPRITES[p.sprite].map} palette={SPRITES[p.sprite].pal} />
            </div>
          ) : (
            <div className="ric">{Icons[p.icono as IconName]}</div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-2.5 flex-wrap items-baseline">
              <span className="font-bold">{p.nombre}</span>
              <span className={`text-[11.5px] ${p.game ? "text-grn" : "text-mag"}`}>
                {p.id}
              </span>
            </div>
            <div className="text-dim text-xs mt-0.5 mb-2">{p.meta}</div>
            <p className="text-fg2 text-[13px]">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            {"nota" in p && (
              <TypedBlock className="note mt-2.5" segs={[{ text: p.nota }]} />
            )}
          </div>
        </article>
      ))}

      {/* nota de cierre del bloque completo */}
      <TypedBlock
        className="note"
        onDone={onDone}
        segs={[{
          text:
            "// dos columnas que pesan igual. quien solo muestra trabajo de cliente parece un servicio;\n" +
            "// yo quiero parecer una persona con criterio.",
        }]}
      />
    </div>
  );
}
```

**`src/components/blocks/InfraPanel.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 4 · InfraPanel.tsx — salida de `infra`
   ───────────────────────────────────────────────────────────────
   Paneles en modo DEMO (constantes de texto). El plan futuro:
   un useEffect con fetch a /api/cluster de tu K3s con estados
   loading|ok|error — y solo cambia ESTE archivo, porque qué
   muestra un bloque siempre fue asunto exclusivo del bloque.
   Los <pre> van instantáneos; la nota personal se teclea.
   ═══════════════════════════════════════════════════════════════ */
import { Section } from "../Icons";
import { TypedBlock } from "../TypedBlock";

const PODS = `$ kubectl get pods -A

NAMESPACE     NAME                  READY  AGE
aromia        landing-aromia-7d4    1/1    41d
aromia        solidarity-energy-2f  1/1    27d
kube-system   traefik-6b9c8         1/1    96d
cert-manager  cert-manager-5f7      1/1    96d

nodo ok   cpu 12%   mem 61%   disco 34%`;

const DEPLOYS = `aromia.com.ve            TLS ok · renueva 58d
energia.aromia.com.ve    TLS ok · renueva 58d

— github actions ————————————
✓ deploy landing-aromia    main@8f2a1c  1m42s
✓ build solidarity-energy  main@c04e77  2m08s
✓ lint + typecheck         main@c04e77  0m31s`;

export function InfraPanel({ onDone }: { onDone?: () => void }) {
  return (
    <div>
      <Section icon="server">systems · clúster</Section>
      <div className="text-dim">conectando a k3s://contabo-vps ...</div>
      <div>
        <span className="text-grn">✓</span> handshake ok ·{" "}
        <span className="text-amb">demo data</span>
      </div>
      <pre className="out text-[12.5px] leading-[1.85] overflow-x-auto">{PODS}</pre>
      <pre className="out text-[12.5px] leading-[1.85] overflow-x-auto">{DEPLOYS}</pre>
      <TypedBlock
        className="note"
        onDone={onDone}
        segs={[{
          text:
            "// tumbé el clúster entero un domingo por un ingress mal escrito.\n" +
            "// desde entonces todo entra por pull request, incluso lo mío.",
        }]}
      />
      <div className="text-dim">
        nota: paneles en modo <span className="text-amb">demo</span>. se conectan a
        endpoints reales antes de publicar.
      </div>
    </div>
  );
}
```

**`src/components/blocks/StackList.tsx`**

```tsx
/* CAPA 4 · StackList.tsx — salida de `stack`.
   Agrupado por FUNCIÓN en el sistema, no por porcentaje de
   dominio — y la nota lo dice explícito. */
import { Section } from "../Icons";
import { TypedBlock } from "../TypedBlock";
import { stack } from "../../data/profile";

export function StackList({ onDone }: { onDone?: () => void }) {
  return (
    <div>
      <Section icon="chip" tone="amb">stack · por función</Section>
      <div className="out">
        {stack.map(([n, v]) => (
          <div key={n} className="my-1">
            <span className="text-mag font-bold">▍{n}</span>
            <div className="pl-2 text-fg2 text-[13.5px]">{v}</div>
          </div>
        ))}
      </div>
      <TypedBlock
        className="note"
        onDone={onDone}
        segs={[{ text: "// ordenado por función, no por porcentaje. las barras de habilidades son ficción." }]}
      />
    </div>
  );
}
```

**`src/components/blocks/ContactCard.tsx`**

```tsx
/* CAPA 4 · ContactCard.tsx — salida de `contact`.
   Enlaces reales (mailto/tel/https) en rejilla clave→valor. */
import { Section } from "../Icons";
import { TypedBlock } from "../TypedBlock";
import { contact } from "../../data/profile";

export function ContactCard({ onDone }: { onDone?: () => void }) {
  return (
    <div>
      <Section icon="mail" tone="mag">signals · contacto</Section>
      <div className="out kv">
        <span className="k">correo</span>
        <a href={`mailto:${contact.correo}`}>{contact.correo}</a>
        <span className="k">linkedin</span>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          {contact.linkedinLabel}
        </a>
        <span className="k">teléfono</span>
        <a href={contact.telHref}>{contact.telefono}</a>
      </div>
      <TypedBlock className="note" segs={[{ text: contact.nota }]} onDone={onDone} />
    </div>
  );
}
```

**`src/components/blocks/HelpList.tsx`**

```tsx
/* CAPA 4 · HelpList.tsx — salida de `help`.
   No tiene contenido propio: recibe las filas YA generadas desde
   el registro (helpRows). Por eso la ayuda no puede mentir:
   se deriva de los comandos reales, no se escribe a mano. */
export function HelpList({ list }: { list: [string, string][] }) {
  return (
    <div className="out kv">
      {list.map(([name, desc]) => (
        <div key={name} className="contents">
          <span className="text-cyan">{name}</span>
          <span>{desc}</span>
        </div>
      ))}
    </div>
  );
}
```

**`src/components/blocks/ArcadeMenu.tsx`**

```tsx
/* CAPA 4 · ArcadeMenu.tsx — salida de `tired`.
   Solo un menú informativo: lanzar el juego es OTRO comando
   (snake/bat), así el flujo es siempre el mismo: run → registro. */
import { Section } from "../Icons";

export function ArcadeMenu() {
  return (
    <div>
      <Section icon="chip" tone="grn">arcade · para el aburrimiento</Section>
      <div>sala de juegos retro — elige:</div>
      <div className="out kv">
        <span className="text-cyan">snake</span>
        <span>la serpiente clásica, versión neón</span>
        <span className="text-cyan">bat</span>
        <span>vuela el murciélago de VESPER por la cueva</span>
      </div>
      <div className="text-dim">
        escribe el nombre del juego · dentro: <span className="text-cyan">ESC</span> para salir
      </div>
    </div>
  );
}
```

**Checkpoint 5:** cada bloque montado suelto en App renderiza con tus datos reales, idéntico al prototipo.

---

## PASO 6 — El arcade (capas 2 y 8)

Primero los motores puros (contrato `start → stop`, léelo en el comentario de snake), luego el puente con React.

**`src/arcade/snake.ts`**

```ts
/* ═══════════════════════════════════════════════════════════════
   CAPA 2 · snake.ts — lógica de juego pura (CERO React)
   ───────────────────────────────────────────────────────────────
   EL CONTRATO: start(canvas, hooks) => stopFn.
   Esa firma calza EXACTO con useEffect (montar → cleanup): por
   eso "desmontar el componente" y "terminar el juego" son la
   misma operación, y la interrupción limpia sale gratis.
   El juego reporta hacia arriba SOLO por los hooks (onScore,
   onEnd); no sabe que React existe.
   ═══════════════════════════════════════════════════════════════ */
import { audio } from "../engine/audio";

export type GameHooks = {
  onScore(n: number): void;
  onEnd(msg: string): void;
};

type P = { x: number; y: number };

export function startSnake(cv: HTMLCanvasElement, hooks: GameHooks): () => void {
  const c2 = cv.getContext("2d")!;
  const cell = 10, cols = 24, rows = 16;         // 24×16 celdas = 240×160 px

  let snake: P[] = [{ x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }];
  let dir: P = { x: 1, y: 0 };
  let ndir = dir;      // dirección PENDIENTE: se aplica al inicio del tick
  let score = 0;       //   (evita el bug de girar dos veces en un tick
  let over = false;    //    y morderse el cuello)

  const place = (): P => {
    let p: P;
    do {
      p = { x: (Math.random() * cols) | 0, y: (Math.random() * rows) | 0 };
    } while (snake.some(s => s.x === p.x && s.y === p.y));
    return p;
  };
  let food = place();

  /* nunca permitir reversa directa (izq→der en un tick) */
  const setDir = (d: P) => {
    if (d.x !== -dir.x || d.y !== -dir.y) ndir = d;
  };

  const draw = () => {
    c2.fillStyle = "#05070f"; c2.fillRect(0, 0, 240, 160);
    // rejilla de puntos tenue
    c2.fillStyle = "#0d1428";
    for (let gx = 0; gx < cols; gx++)
      for (let gy = 0; gy < rows; gy++)
        c2.fillRect(gx * cell + 4.5, gy * cell + 4.5, 1, 1);
    // comida magenta con halo
    c2.fillStyle = "#ff2ea640"; c2.fillRect(food.x * cell, food.y * cell, 10, 10);
    c2.fillStyle = "#ff2ea6";   c2.fillRect(food.x * cell + 2, food.y * cell + 2, 6, 6);
    // serpiente: cabeza cyan brillante, cuerpo alternando tonos
    snake.forEach((s, i) => {
      c2.fillStyle = i === 0 ? "#22e5ff" : i % 2 ? "#17b8d6" : "#118aa8";
      c2.fillRect(s.x * cell + 1, s.y * cell + 1, 8, 8);
    });
  };

  const end = (msg: string) => {
    if (!over) { over = true; hooks.onEnd(msg); }
  };

  /* tick del juego cada 110ms */
  const iv = setInterval(() => {
    dir = ndir;
    // bordes que envuelven (túnel): más amable para partidas casuales
    const h: P = {
      x: (snake[0].x + dir.x + cols) % cols,
      y: (snake[0].y + dir.y + rows) % rows,
    };
    if (snake.some(s => s.x === h.x && s.y === h.y)) {
      audio.errBuzz();
      return end("te mordiste");
    }
    snake.unshift(h);
    if (h.x === food.x && h.y === food.y) {
      hooks.onScore(++score);
      audio.beep(700 + score * 18, 0.05, 0.045);  // tono sube con el score
      food = place();
    } else {
      snake.pop();
    }
    draw();
  }, 110);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      audio.beep(300, 0.08, 0.04);
      return end("sesión de juego cerrada");
    }
    const m: Record<string, P> = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
    };
    if (m[e.key]) { e.preventDefault(); setDir(m[e.key]); }
  };

  /* móvil: swipe = dirección (umbral de 12px para ignorar taps) */
  let tx = 0, ty = 0;
  const onTS = (e: TouchEvent) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; };
  const onTE = (e: TouchEvent) => {
    const t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Math.abs(dx) + Math.abs(dy) < 12) return;
    if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
    else setDir(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
  };

  document.addEventListener("keydown", onKey, true);
  cv.addEventListener("touchstart", onTS, { passive: true });
  cv.addEventListener("touchend", onTE, { passive: true });
  draw();

  /* TODO se desregistra aquí — la mitad del contrato */
  return () => {
    over = true;
    clearInterval(iv);
    document.removeEventListener("keydown", onKey, true);
    cv.removeEventListener("touchstart", onTS);
    cv.removeEventListener("touchend", onTE);
  };
}
```

**`src/arcade/batGame.ts`**

```ts
/* ═══════════════════════════════════════════════════════════════
   CAPA 2 · batGame.ts — VESPER//mini (mismo contrato que snake)
   ───────────────────────────────────────────────────────────────
   Estilo flappy: gravedad + aleteo. El murciélago se dibuja con
   drawMap desde BATMAP — el MISMO mapa del sprite de la tarjeta
   de proyectos (fuente única). Usa requestAnimationFrame porque
   necesita física suave a 60fps (snake usa setInterval porque
   su ritmo ES el tick de la rejilla).
   ═══════════════════════════════════════════════════════════════ */
import { audio } from "../engine/audio";
import { BATMAP, BATPAL, drawMap } from "../engine/sprites";
import type { GameHooks } from "./snake";

type Wall = { x: number; gy: number; gh: number; passed: boolean };

export function startBat(cv: HTMLCanvasElement, hooks: GameHooks): () => void {
  const c2 = cv.getContext("2d")!;
  const S = 1.6;                 // escala del sprite
  const BW = 12 * S, BH = 10 * S; // caja de colisión (12×10 celdas)
  const BX = 44;                  // x fija del murciélago

  let by = 72, vy = 0;            // posición y velocidad vertical
  let t = 0, score = 0, over = false, raf = 0;
  let walls: Wall[] = [];

  const end = (msg: string) => {
    if (!over) { over = true; hooks.onEnd(msg); }
  };

  const flap = () => {
    if (!over) { vy = -2.5; audio.keyClick(true, true); }  // golpe de ala
  };

  const draw = () => {
    c2.fillStyle = "#05070f"; c2.fillRect(0, 0, 240, 160);
    // motas de cueva desplazándose (parallax barato)
    c2.fillStyle = "#101a30";
    for (let i = 0; i < 26; i++)
      c2.fillRect(((i * 67 - ((t * 0.4) | 0)) % 252 + 252) % 252 - 6, (i * 53) % 160, 2, 2);
    // columnas: cuerpo oscuro + borde cyan en el hueco
    walls.forEach(w => {
      c2.fillStyle = "#101b33";
      c2.fillRect(w.x, 0, 16, w.gy);
      c2.fillRect(w.x, w.gy + w.gh, 16, 160 - w.gy - w.gh);
      c2.fillStyle = "#22e5ff";
      c2.fillRect(w.x, w.gy - 1.5, 16, 1.5);
      c2.fillRect(w.x, w.gy + w.gh, 16, 1.5);
    });
    drawMap(c2, BATMAP, BATPAL, BX, by, S);
  };

  const loop = () => {
    if (over) return;
    t++;
    vy += 0.12;   // gravedad
    by += vy;

    // nueva pared cada 100 frames, hueco de 64px a altura aleatoria
    if (t % 100 === 1)
      walls.push({ x: 244, gy: 22 + Math.random() * (160 - 44 - 64), gh: 64, passed: false });
    walls.forEach(w => (w.x -= 1.2));
    walls = walls.filter(w => w.x > -18);

    // techo/suelo
    if (by < -2 || by + BH > 162) {
      audio.errBuzz();
      return end("contra la cueva");
    }
    // colisión con paredes + punto al pasarlas (con margen de 2px
    // a favor del jugador: los juegos justos se sienten mejor)
    for (const w of walls) {
      if (BX + BW - 2 > w.x && BX + 2 < w.x + 16 &&
          (by + 2 < w.gy || by + BH - 2 > w.gy + w.gh)) {
        audio.errBuzz();
        return end("contra la cueva");
      }
      if (!w.passed && w.x + 16 < BX) {
        w.passed = true;
        hooks.onScore(++score);
        audio.beep(760 + score * 14, 0.05, 0.04);
      }
    }

    draw();
    raf = requestAnimationFrame(loop);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      audio.beep(300, 0.08, 0.04);
      return end("sesión de juego cerrada");
    }
    if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
      e.preventDefault();  // que el espacio no haga scroll
      flap();
    }
  };
  const onTap = (e: PointerEvent) => { e.preventDefault(); flap(); };

  document.addEventListener("keydown", onKey, true);
  cv.addEventListener("pointerdown", onTap);
  loop();

  return () => {
    over = true;
    cancelAnimationFrame(raf);
    document.removeEventListener("keydown", onKey, true);
    cv.removeEventListener("pointerdown", onTap);
  };
}
```

**`src/arcade/GameCanvas.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 8 · GameCanvas.tsx — el puente motor ↔ React
   ───────────────────────────────────────────────────────────────
   Un juego puede terminar por TRES caminos que podrían pisarse:
   (1) muerte/ESC (onEnd interno del motor),
   (2) interrupción desde el Terminal (registerStop),
   (3) desmontaje del componente (cleanup del efecto).
   La bandera `stopped` asegura que gane el primero y los demás
   sean no-ops. Para añadir un tercer juego NO toques nada de
   esto: si cumple el contrato start→stop, se hospeda tal cual.
   ═══════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from "react";
import { startSnake } from "./snake";
import { startBat } from "./batGame";
import type { GameKind } from "../engine/types";

export function GameCanvas({ kind, title, tip, onEnd, registerStop }: {
  kind: GameKind;
  title: string;
  tip: string;
  onEnd: (msg: string, score: number) => void;
  registerStop: (stop: (() => void) | null) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let final = 0;
    let stopped = false;
    const start = kind === "snake" ? startSnake : startBat;

    const stop = start(ref.current!, {
      onScore: n => { final = n; setScore(n); },
      onEnd: msg => {
        if (!stopped) { stopped = true; registerStop(null); onEnd(msg, final); }
      },
    });

    // botón rojo que el Terminal puede pulsar para interrumpir
    registerStop(() => {
      if (!stopped) {
        stopped = true; stop(); registerStop(null);
        onEnd("juego interrumpido", final);
      }
    });

    // desmontar = terminar (sin mensaje: la entrada ya no existe)
    return () => {
      if (!stopped) { stopped = true; stop(); registerStop(null); }
    };
  }, [kind]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="game-host">
      <div className="game-hud">
        <span>{title}</span>
        <span>score <b>{score}</b></span>
      </div>
      <canvas ref={ref} width={240} height={160} />
      <div className="text-dim text-[11px] mt-1.5">{tip}</div>
    </div>
  );
}
```

**Checkpoint 6:** `<GameCanvas kind="snake" title="test" tip="" onEnd={console.log} registerStop={()=>{}}/>` suelto en App: el juego corre, ESC lo termina, y quitar el componente detiene el loop (no sigue sonando).

---

## PASO 7 — El registro de comandos (capa 5)

El mapa que define qué puede hacer la terminal. De aquí se deriva el `help` — imposible que la ayuda mienta.

**`src/engine/commands.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 5 · commands.tsx — el registro: qué puede hacer la terminal
   ───────────────────────────────────────────────────────────────
   Un solo mapa nombre → {desc, run} del que se DERIVAN tres cosas
   sin código extra: el despacho (Terminal busca por clave), el
   `help` (helpRows itera el registro — imposible que la ayuda
   mienta) y los alias (tabla de redirecciones, no lógica).

   RECETA para añadir un comando: crea su bloque en blocks/,
   añade UNA línea aquí. El Terminal no se toca. Si para añadir
   un comando tocaste Terminal.tsx, algo hiciste mal.
   ═══════════════════════════════════════════════════════════════ */
import type { Command } from "./types";
import { Neofetch } from "../components/blocks/Neofetch";
import { HistoryList } from "../components/blocks/HistoryList";
import { InfraPanel } from "../components/blocks/InfraPanel";
import { ProjectList } from "../components/blocks/ProjectList";
import { StackList } from "../components/blocks/StackList";
import { ContactCard } from "../components/blocks/ContactCard";
import { ArcadeMenu } from "../components/blocks/ArcadeMenu";
import { HelpList } from "../components/blocks/HelpList";

export const commands: Record<string, Command> = {
  help:     { desc: "lista de comandos",           run: c => c.print(<HelpList list={helpRows()} />) },
  whoami:   { desc: "perfil estilo neofetch",      run: c => c.print(<Neofetch />) },
  history:  { desc: "trayectoria profesional",     run: c => c.print(<HistoryList />) },
  infra:    { desc: "estado del clúster K3s",      run: c => c.print(<InfraPanel />) },
  projects: { desc: "builds: producción y juegos", run: c => c.print(<ProjectList />) },
  stack:    { desc: "tecnologías por función",     run: c => c.print(<StackList />) },
  contact:  { desc: "canales de contacto",         run: c => c.print(<ContactCard />) },
  tired:    { desc: "sala de juegos retro",        run: c => c.print(<ArcadeMenu />) },
  snake:    { desc: "SNAKE//neon",                 run: c => c.launchGame("snake") },
  bat:      { desc: "VESPER//mini",                run: c => c.launchGame("bat") },
  clear:    { desc: "limpiar la terminal",         run: c => c.clear() },
};

/* Alias: puras redirecciones de nombre. */
export const aliases: Record<string, string> = {
  neofetch: "whoami", cat: "whoami", about: "whoami", ls: "help",
  bored: "tired", aburrido: "tired", play: "tired", games: "tired",
};

/* snake/bat no salen en help: se descubren desde el menú `tired`. */
const HIDDEN = new Set(["snake", "bat"]);

export const helpRows = (): [string, string][] =>
  Object.entries(commands)
    .filter(([n]) => !HIDDEN.has(n))
    .map(([n, c]) => [n, c.desc]);

/* Normaliza la entrada del usuario y traduce alias. */
export const resolve = (raw: string): string => {
  const c = raw.trim().toLowerCase();
  return aliases[c] ?? c;
};
```

**Checkpoint 7:** compila; `helpRows()` en consola devuelve las filas.

---

## PASO 8 — La orquestación (capa 6)

El Prompt tonto y el Terminal orquestador. En Terminal, lee el comentario sobre estado vs refs — es la disciplina que evita renders fantasma.

**`src/components/Prompt.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 6 · Prompt.tsx — la línea de entrada (deliberadamente tonta)
   ───────────────────────────────────────────────────────────────
   Su único trabajo: (a) sonar en cada tecla, (b) entregar el
   texto crudo con onSubmit al recibir Enter. NO sabe qué es un
   comando — esa ignorancia lo hace reemplazable por cualquier
   otra fuente (los chips de la HintBar lo demuestran).
   Cuando disabled (juego activo) retorna null: no hay estado
   "prompt bloqueado" que gestionar; simplemente no existe.
   El caret nativo va transparente y el cursor visible es el
   .cur de bloque parpadeante — estética de terminal.
   ═══════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from "react";
import { audio } from "../engine/audio";

export function Prompt({ onSubmit, disabled }: {
  onSubmit: (raw: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  // al reaparecer tras un juego, recuperar el foco solo
  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  if (disabled) return null;

  return (
    <div className="flex items-baseline gap-2 mt-2 flex-wrap">
      <span className="whitespace-nowrap">
        <span className="ps-u">parra</span><span className="text-dim">@</span>
        <span className="ps-h">ccs</span><span className="text-dim">:</span>
        <span className="ps-d">~</span><span className="text-dim">$</span>
      </span>
      <input
        ref={ref}
        value={value}
        aria-label="terminal"
        autoComplete="off"
        spellCheck={false}
        className="bg-transparent border-0 outline-none flex-1 min-w-[120px] phosphor caret-transparent"
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            audio.keyClick(true);          // Enter suena grave
            onSubmit(value);
            setValue("");
          } else if (e.key.length === 1 || e.key === "Backspace") {
            audio.keyClick();              // tecla normal
          }
        }}
      />
      <span className="cur" />
    </div>
  );
}
```

**`src/components/Terminal.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 6 · Terminal.tsx — el orquestador
   ───────────────────────────────────────────────────────────────
   EL PRINCIPIO: la terminal es un ARRAY DE ESTADO, no DOM.
   Imprimir = añadir al array. React pinta. Cero appendChild.

   Solo TRES piezas de estado (lo que la UI refleja):
   · entries    — el historial (solo crece por el final)
   · skip       — señal de salto del typewriter (contador)
   · gameActive — si hay partida (oculta el Prompt)
   Lo demás son REFS (lo que la lógica recuerda sin repintar):
   · idRef (ids), stopRef (botón rojo del juego), bottomRef (scroll).
   Confundir estado con ref es la fuente #1 de renders fantasma.
   ═══════════════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { audio } from "../engine/audio";
import { bus } from "../engine/bus";
import { commands, resolve } from "../engine/commands";
import type { GameKind } from "../engine/types";
import { BANNER } from "../engine/sprites";
import { GameCanvas } from "../arcade/GameCanvas";
import { Prompt } from "./Prompt";
import { SkipCtx } from "./TypedBlock";

type Entry = { id: number; node: ReactNode };

const GAME_META: Record<GameKind, { title: string; tip: string }> = {
  snake: { title: "SNAKE//neon",  tip: "flechas o WASD · deslizar en móvil · ESC salir" },
  bat:   { title: "VESPER//mini", tip: "espacio o toque para aletear · ESC salir" },
};

export function Terminal() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [skip, setSkip] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const idRef = useRef(0);
  const stopRef = useRef<(() => void) | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* useCallback estabiliza identidades: run depende de print,
     los efectos dependen de run — sin esto, cada render crearía
     funciones nuevas y una cadena de re-suscripciones inútiles. */
  const print = useCallback((node: ReactNode) => {
    setEntries(prev => [...prev, { id: ++idRef.current, node }]);
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  /* Monta el juego como una entrada más del log. El GameCanvas
     nos entrega su función de parada vía registerStop (el
     Terminal NO sabe cómo se detiene un juego — solo guarda el
     botón rojo que el juego mismo le dio). */
  const launchGame = useCallback((kind: GameKind) => {
    setGameActive(true);
    const meta = GAME_META[kind];
    print(
      <GameCanvas
        kind={kind}
        title={meta.title}
        tip={meta.tip}
        registerStop={s => { stopRef.current = s; }}
        onEnd={(msg, score) => {
          setGameActive(false);
          print(
            <div>
              {msg} — puntuación <b className="text-amb">{score}</b> · otra ronda:{" "}
              <span className="text-cyan">tired</span>
            </div>,
          );
        }}
      />,
    );
  }, [print]);

  /* EL VIAJE DE UN COMANDO — cuatro pasos en orden:
     1. saltar tecleos pendientes  2. interrumpir juego activo
     3. eco del prompt             4. resolver y despachar */
  const run = useCallback((raw: string) => {
    setSkip(s => s + 1);
    stopRef.current?.();
    print(
      <div>
        <span className="ps-u">parra</span><span className="text-dim">@</span>
        <span className="ps-h">ccs</span><span className="text-dim">:</span>
        <span className="ps-d">~</span><span className="text-dim">$</span>{" "}
        <span className="font-medium">{raw}</span>
      </div>,
    );
    const cmd = resolve(raw);
    if (cmd === "") return;
    const c = commands[cmd];
    if (c) {
      c.run({ print, clear, launchGame });   // inyección de capacidades
      audio.beep(760, 0.05, 0.035);
    } else {
      audio.errBuzz();
      print(
        <div>
          <span className="text-red">comando no encontrado:</span> {cmd} — escribe{" "}
          <span className="text-cyan">help</span>
        </div>,
      );
    }
  }, [print, clear, launchGame]);

  /* chips de la HintBar → bus → run. bus.on devuelve la
     des-suscripción: el return del efecto ES el cleanup. */
  useEffect(() => bus.on(cmd => { audio.keyClick(true); run(cmd); }), [run]);

  /* Cualquier clic salta el tecleo en curso (los TypedBlock nuevos
     no se ven afectados gracias a su skip0). Se excluyen enlaces
     y botones para no robarles la interacción. */
  useEffect(() => {
    const bump = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest?.("a") || t.closest?.("button")) return;
      setSkip(s => s + 1);
    };
    document.addEventListener("pointerdown", bump);
    return () => document.removeEventListener("pointerdown", bump);
  }, []);

  /* Banner de bienvenida como primera entrada + fanfarria.
     Deps vacías: solo al montar. */
  useEffect(() => {
    print(
      <div className="intro">
        <pre className="banner">{BANNER}</pre>
        <div className="tagline">
          {"// del componente al clúster — construyo y lo mantengo corriendo."}
        </div>
        <div className="mt-2">
          Sesión iniciada como <b className="text-grn">jhorman parra</b> · Caracas, VE ·{" "}
          <span className="text-amb">5+ años</span>
        </div>
        <div className="text-dim">
          escribe <b className="text-cyan">help</b> para ver comandos, o toca un chip abajo ↓
        </div>
      </div>,
    );
    audio.beep(660, 0.07, 0.045);
    const t = setTimeout(() => audio.beep(990, 0.09, 0.045), 110);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* autoscroll al fondo con cada entrada nueva */
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [entries.length]);

  return (
    <SkipCtx.Provider value={skip}>
      <main
        role="log"
        aria-live="polite"
        className="max-w-[920px] mx-auto px-4 pt-6 pb-32 phosphor"
        onClick={e => {
          // clic en cualquier parte → foco al input (como toda
          // terminal real). Enlaces y canvas quedan fuera.
          const t = e.target as HTMLElement;
          if (!t.closest("a") && !t.closest("canvas")) {
            (document.querySelector('input[aria-label="terminal"]') as HTMLInputElement | null)?.focus();
          }
        }}
      >
        {entries.map(e => <div key={e.id}>{e.node}</div>)}
        <Prompt onSubmit={run} disabled={gameActive} />
        <div ref={bottomRef} />
      </main>
    </SkipCtx.Provider>
  );
}
```

**Checkpoint 8:** montando `<Terminal/>` directo en App: banner, todos los comandos funcionan, tecleo con salto, `tired`→juegos, interrupción limpia, `clear`.

---

## PASO 9 — El marco (capa 7)

Boot, barras, overlay CRT, y la composición final en App.

**`src/components/BootSequence.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 7 · BootSequence.tsx — animación como reducción de estado
   ───────────────────────────────────────────────────────────────
   En vez de timers encadenados a mano (frágil), dos números
   (lines, bar) y UN solo efecto que mira el estado y decide el
   siguiente paso: ¿faltan líneas? programa la próxima. ¿Falta
   barra? avanza. ¿Todo listo? arpegio y salida. Cada timeout se
   limpia en el return: desmontar el boot en cualquier instante
   lo detiene sin fugas.
   doneRef garantiza UN solo onDone aunque lleguen a la vez el
   animationend y el respaldo de 1400ms (y absorbe StrictMode).
   ═══════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from "react";
import { audio } from "../engine/audio";
import { bootScript } from "../data/profile";
import { usePrefersReducedMotion } from "./TypedBlock";

const TOTAL = 28;   // segmentos de la barra

export function BootSequence({ onDone }: { onDone: () => void }) {
  const still = usePrefersReducedMotion();
  const [lines, setLines] = useState(0);     // líneas ya mostradas
  const [bar, setBar] = useState(-1);        // -1: aún no · 0..TOTAL: llenando
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (!doneRef.current) { doneRef.current = true; onDone(); }
  };

  useEffect(() => {
    if (still) { finish(); return; }         // accesibilidad: sin boot

    // fase 1: líneas del guion, cada una con su beep ascendente
    if (lines < bootScript.length) {
      audio.beep(bootScript[lines].tone, 0.05, 0.03);
      const id = setTimeout(() => setLines(l => l + 1), bootScript[lines].delay);
      return () => clearTimeout(id);
    }
    // fase 2: barra con blips que suben de tono con el progreso
    if (bar < 0) { setBar(0); return; }
    if (bar < TOTAL) {
      if (bar > 0 && bar % 2 === 0) audio.beep(300 + (bar / TOTAL) * 600, 0.03, 0.022);
      const id = setTimeout(() => setBar(b => b + 1), 44);
      return () => clearTimeout(id);
    }
    // fase 3: 100% → arpegio de completado → todo el log sale junto
    audio.beep(660, 0.09, 0.05);
    const t1 = setTimeout(() => audio.beep(880, 0.09, 0.05), 90);
    const t2 = setTimeout(() => audio.beep(1320, 0.14, 0.055), 180);
    const t3 = setTimeout(() => setLeaving(true), 480);
    const t4 = setTimeout(finish, 1400);     // respaldo si animationend no llega
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [lines, bar, still]); // eslint-disable-line react-hooks/exhaustive-deps

  if (still) return null;

  return (
    <div
      className={`max-w-[920px] mx-auto px-4 pt-6 phosphor bootlog ${leaving ? "bootlog-out" : ""}`}
      onAnimationEnd={leaving ? finish : undefined}
    >
      {bootScript.slice(0, lines).map((l, i) => (
        <div key={i} className={`bootline ${l.dim ? "text-dim" : ""}`}>
          {!l.dim && <span className="text-grn">{"[ ok ] "}</span>}
          {l.text.replace("[ ok ] ", "")}
        </div>
      ))}
      {bar >= 0 && (
        <div>
          <span className="text-dim">Inicializando Perfil </span>
          <span className={bar >= TOTAL
            ? "text-grn [text-shadow:0_0_10px_#4dff9e99]"
            : "text-grn"}>
            [{"█".repeat(bar)}
          </span>
          <span className="text-dim">{"░".repeat(TOTAL - bar)}]</span>
          <span className={bar >= TOTAL ? "text-grn" : "text-amb"}>
            {" "}{Math.round((100 * bar) / TOTAL)}%
          </span>
        </div>
      )}
    </div>
  );
}
```

**`src/components/TopBar.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 7 · TopBar.tsx — barra superior: semáforo, ruta, sonido, reloj
   ───────────────────────────────────────────────────────────────
   Hoja del árbol: no conoce al Terminal. Toca audio.setMuted
   (capa 2, permitido: hacia abajo). useClock es el patrón de
   limpieza en miniatura: el return del efecto mata el interval.
   ═══════════════════════════════════════════════════════════════ */
import { useEffect, useState } from "react";
import { audio } from "../engine/audio";

function useClock(): string {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now.toTimeString().slice(0, 8);
}

export function TopBar() {
  const clock = useClock();
  const [on, setOn] = useState(true);   // estado VISUAL del botón;
                                        // el estado real vive en audio.ts
  return (
    <div className="sticky top-0 z-30 flex items-center gap-2.5 px-3.5 py-2 bg-[#05060caa] backdrop-blur-sm border-b border-[#1b2e4b] text-[11.5px] text-dim tracking-[.04em]">
      <span className="flex gap-1.5">
        <i className="w-[11px] h-[11px] rounded-full bg-red block" />
        <i className="w-[11px] h-[11px] rounded-full bg-amb block" />
        <i className="w-[11px] h-[11px] rounded-full bg-grn block" />
      </span>
      <span className="text-cyan hidden md:inline">parra@ccs</span>
      <span className="hidden md:inline">:~/portfolio</span>
      <span className="flex-1" />
      <button
        className={`chip flex items-center gap-1.5 ${on ? "" : "text-dim"}`}
        onClick={() => {
          const v = !on;
          setOn(v);
          audio.setMuted(!v);
          if (v) audio.beep(660, 0.07, 0.05);   // confirma al reactivar
        }}
      >
        sonido {on ? "on" : "off"}
      </button>
      <span className="hidden md:inline">
        conn <b className="text-grn">secure</b> · {clock}
      </span>
    </div>
  );
}
```

**`src/components/HintBar.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 7 · HintBar.tsx — chips de comandos (red de seguridad para
   quien no sabe qué escribir en una terminal)
   ───────────────────────────────────────────────────────────────
   Hermana del Terminal en el árbol: le habla por el bus, no por
   props. Emitir un comando aquí y escribirlo en el prompt son
   EXACTAMENTE el mismo flujo — run() no distingue la fuente.
   ═══════════════════════════════════════════════════════════════ */
import { bus } from "../engine/bus";

const CHIPS = ["whoami", "history", "infra", "projects", "stack", "contact", "tired"];

export function HintBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-[#05060cf2] border-t border-[#1b2e4b] px-3.5 py-2 text-[11.5px] text-dim flex gap-x-4 gap-y-2 flex-wrap items-center">
      <span><b className="text-cyan">comandos:</b></span>
      {CHIPS.map(c => (
        <button key={c} className="chip" onClick={() => bus.emit(c)}>{c}</button>
      ))}
      <span className="flex-1" />
      <span className="hidden md:inline">
        escribe <b className="text-cyan">help</b> ↵
      </span>
    </div>
  );
}
```

**`src/components/CrtOverlay.tsx`**

```tsx
/* CAPA 7 · CrtOverlay.tsx — scanlines + viñeta sobre todo.
   Puro CSS; el componente solo decide si el flicker va activo
   (se apaga con prefers-reduced-motion). pointer-events: none
   en el CSS garantiza que nunca captura clics. */
import { usePrefersReducedMotion } from "./TypedBlock";

export function CrtOverlay() {
  const still = usePrefersReducedMotion();
  return <div className={`crt ${still ? "" : "crt-flicker"}`} aria-hidden />;
}
```

**`src/App.tsx`**

```tsx
/* ═══════════════════════════════════════════════════════════════
   CAPA 7 · App.tsx — máquina de estados de dos fases
   ───────────────────────────────────────────────────────────────
   "boot" | "ready". El boot NO es un overlay: la Terminal no
   existe durante el boot. Al terminar (onDone), App conmuta, el
   boot se desmonta (sus timers mueren con él) y la Terminal nace
   imprimiendo el banner. Cada fase es dueña de su pantalla.
   RECETA para quitar el boot: estado inicial "ready". Ya.
   ═══════════════════════════════════════════════════════════════ */
import { useState } from "react";
import { CrtOverlay } from "./components/CrtOverlay";
import { TopBar } from "./components/TopBar";
import { HintBar } from "./components/HintBar";
import { BootSequence } from "./components/BootSequence";
import { Terminal } from "./components/Terminal";

export default function App() {
  const [phase, setPhase] = useState<"boot" | "ready">("boot");

  return (
    <>
      <CrtOverlay />
      <TopBar />
      {phase === "boot"
        ? <BootSequence onDone={() => setPhase("ready")} />
        : <Terminal />}
      <HintBar />
    </>
  );
}
```

**`src/main.tsx`**

```tsx
/* main.tsx — punto de entrada.
   NOTA StrictMode: en desarrollo monta los efectos DOS veces
   (es intencional de React para detectar efectos sucios). Si el
   boot suena doble en dev, es eso — los guards doneRef lo
   absorben y en producción no ocurre. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

**Checkpoint 9 — la experiencia completa:** boot sonoro → barra con arpegio → desvanecimiento conjunto → banner JPARRA → terminal con todo. Si el boot suena doble en dev, es StrictMode (lee el comentario en main.tsx), no un bug.

---

## PASO 10 — Producción

Los cuatro archivos del pipeline. Ajusta `TU_USUARIO` y el host en el manifiesto de K8s.

**`nginx.conf`**

```nginx
# nginx.conf — sirve el build estático.
# try_files → index.html: patrón SPA (aquí no hay rutas, pero no estorba).
# /assets/ inmutable: los nombres llevan hash, cachear 1 año es seguro.
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  gzip on;
  gzip_types text/css application/javascript image/svg+xml;

  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }
  location / {
    try_files $uri /index.html;
  }
}
```

**`Dockerfile`**

```dockerfile
# Multi-stage: Bun construye (imagen pesada), nginx sirve (ligera).
# La imagen final solo contiene el dist — ~10MB.
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

**`k8s/portfolio.yaml`**

```yaml
# Despliegue en tu K3s. Ajusta: imagen (TU_USUARIO) y host.
# Requiere una vez: kubectl create ns personal · DNS al VPS.
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
  namespace: personal
spec:
  replicas: 1
  selector: { matchLabels: { app: portfolio } }
  template:
    metadata: { labels: { app: portfolio } }
    spec:
      containers:
        - name: web
          image: ghcr.io/TU_USUARIO/parra-terminal:latest
          ports: [{ containerPort: 80 }]
          resources:
            requests: { cpu: 10m, memory: 16Mi }
            limits: { cpu: 100m, memory: 64Mi }
---
apiVersion: v1
kind: Service
metadata: { name: portfolio, namespace: personal }
spec:
  selector: { app: portfolio }
  ports: [{ port: 80, targetPort: 80 }]
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolio
  namespace: personal
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: traefik
  rules:
    - host: jhorman.aromia.com.ve
      http:
        paths:
          - path: /
            pathType: Prefix
            backend: { service: { name: portfolio, port: { number: 80 } } }
  tls:
    - hosts: [jhorman.aromia.com.ve]
      secretName: portfolio-tls
```

**`.github/workflows/deploy.yml`**

```yaml
# push a main → imagen a GHCR → rollout en tu K3s por SSH.
# Secrets requeridos: VPS_HOST, VPS_USER, VPS_DEPLOY_KEY.
name: deploy
on: { push: { branches: [main] } }

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    steps:
      - uses: actions/checkout@v4

      - name: Login GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build & push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}

      - name: Rollout en K3s
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_DEPLOY_KEY }}
          script: |
            kubectl -n personal set image deployment/portfolio \
              web=ghcr.io/${{ github.repository }}:${{ github.sha }}
            kubectl -n personal rollout status deployment/portfolio --timeout=90s
```

Prueba local antes de subir:

```bash
bun run build
docker build -t parra-terminal .
docker run -p 8080:80 parra-terminal   # http://localhost:8080
```

Primera vez en el clúster: `kubectl create ns personal` → DNS del host al VPS → `kubectl apply -f k8s/portfolio.yaml` → los tres secrets en GitHub (`VPS_HOST`, `VPS_USER`, `VPS_DEPLOY_KEY`). Commitea el `bun.lock` que generó `bun install` — el Dockerfile lo necesita.

**Checkpoint 10 — el definitivo:** `git push` → Actions en verde → tu dominio responde con TLS válido y el boot suena en tu teléfono.

---

## Referencia rápida

**El flujo de un comando:** Enter → `Prompt.onSubmit` → `Terminal.run` → salta tecleos → interrumpe juego → eco del prompt → `resolve` → `commands[cmd].run(ctx)` → `ctx.print(<Bloque/>)` → el bloque se auto-coreografía.

**Recetas:** comando nuevo = 1 bloque + 1 línea en el registro (sin tocar Terminal) · juego nuevo = contrato start→stop + caso en GameCanvas + GAME_META + registro · quitar boot = `useState("ready")` en App · retemar = los 12 hex de `@theme` · infra real = solo `InfraPanel.tsx` con un fetch.

**Comandos:** `help` · `whoami`/`neofetch` · `history` · `infra` · `projects` · `stack` · `contact` · `tired`/`bored`/`aburrido`/`play` → `snake`/`bat` · `clear`.
