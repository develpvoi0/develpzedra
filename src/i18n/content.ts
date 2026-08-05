/* ═══════════════════════════════════════════════════════════════
   content.ts — TODO el texto visible, en cada idioma.
   ───────────────────────────────────────────────────────────────
   Antes vivía en data/profile.ts (solo español). Ahora cada idioma
   tiene su copia completa aquí, con la MISMA forma (el tipo
   LocaleContent lo garantiza). Los campos no traducibles (ids,
   iconos, tags, hrefs, tonos del boot) se repiten idénticos en
   ambos idiomas a propósito: mantiene cada bloque leyendo un solo
   objeto y es trivial de editar en paralelo.

   Para añadir un idioma: copia el bloque `en`, tradúcelo y añádelo
   a `content` + al tipo Lang. Los nombres de comandos NO se
   traducen (son comandos de terminal); solo su descripción. */

export type Lang = "es" | "en";

export interface Identity {
  usuario: string;
  titulo: string;
  rol: string;
  host: string;
  uptime: string;
  shell: string;
  formacion: string;
  idiomas: string;
  estado: string;
  lema: string;
  nota: string;
}

export interface Job {
  id: string;
  empresa: string;
  periodo: string;
  lugar: string;
  rol: string;
  running: boolean;
  logros: readonly string[];
  nota: string;
}

export interface Project {
  id: string;
  nombre: string;
  icono: string;
  game: boolean;
  sprite?: "bat" | "slime";
  meta: string;
  desc: string;
  tags: readonly string[];
  nota?: string;
}

export interface Contact {
  correo: string;
  linkedin: string;
  linkedinLabel: string;
  telefono: string;
  telHref: string;
  nota: string;
}

export interface BootLine {
  text: string;
  dim: boolean;
  delay: number;
  tone: number;
}

export type StackRow = readonly [string, string];

export interface UI {
  /* encabezados de sección */
  sections: {
    identity: string;
    history: string;
    infra: string;
    projects: string;
    stack: string;
    contact: string;
    arcade: string;
  };
  /* etiquetas de la ficha neofetch (columna izquierda) */
  fields: {
    usuario: string;
    titulo: string;
    rol: string;
    host: string;
    uptime: string;
    shell: string;
    formacion: string;
    idiomas: string;
    estado: string;
  };
  /* descripciones de comandos (para `help`), por nombre de comando */
  commands: Record<string, string>;
  /* banner de bienvenida */
  welcome: {
    tagline: string;
    sessionPre: string;   // "Sesión iniciada como"
    city: string;
    hintPre: string;      // "Escribe"
    hintPost: string;     // "para ver comandos, o toca un chip abajo ↓"
  };
  /* barra de pistas inferior */
  hintbar: {
    comandos: string;
    escribePre: string;   // "escribe"
    escribePost: string;  // "↵"
  };
  /* menú arcade */
  arcade: {
    choose: string;
    snake: string;
    bat: string;
    howtoPre: string;     // "Escribe el nombre del juego · dentro:"
    esc: string;          // "para salir"
  };
  /* panel de infra (lo tipo-log se deja tal cual) */
  infra: {
    connecting: string;
    handshake: string;
    demoData: string;
    note: string;
    footerPre: string;    // "Nota: Paneles en modo"
    demo: string;
    footerPost: string;
  };
  /* juegos: título + pista de controles */
  games: {
    snake: { title: string; tip: string };
    bat: { title: string; tip: string };
  };
  /* eco / mensajes de la terminal */
  terminal: {
    notFound: string;     // "comando no encontrado:"
    tryHelp: string;      // "escribe"
    scorePre: string;     // "— puntuación"
    another: string;      // "· otra ronda:"
  };
  /* motivos de fin de juego (los juegos emiten estas claves) */
  gameEnd: Record<"bite" | "cave" | "closed" | "interrupted", string>;
  /* notas de cierre de bloque */
  notes: {
    stack: string;
    projects: string;
  };
  /* barra de progreso del arranque */
  bootBar: string;
  /* etiquetas de la tarjeta de contacto */
  contactLabels: {
    email: string;
    phone: string;
  };
  /* barra superior */
  topbar: {
    sound: string;
    on: string;
    off: string;
  };
  /* etiquetas sueltas */
  labels: {
    running: string;
    exit0: string;
    langName: string;     // nombre del idioma en su propio idioma
  };
}

export interface LocaleContent {
  identity: Identity;
  jobs: readonly Job[];
  projects: readonly Project[];
  stack: readonly StackRow[];
  contact: Contact;
  bootScript: readonly BootLine[];
  ui: UI;
}

/* ══════════════════════ ESPAÑOL ══════════════════════ */
const es: LocaleContent = {
  identity: {
    usuario: "Jhorman Parra",
    titulo: "Ing. en Informática · FullStack",
    rol: "Fullstack | Líder de proyecto",
    host: "Caracas, Venezuela",
    uptime: "5+ años en producción",
    shell: "React · Node · K8s",
    formacion: "UNERG (2023)",
    idiomas: "ES nativo · EN técnico",
    estado: "Disponible para contrato",
    lema: "Construyo el producto completo y lo mantengo corriendo yo mismo: del componente al clúster.",
    nota: "// Empecé maquetando HTML a mano en Caracas y terminé administrando Kubernetes desde mi cuarto.\n// Nunca hubo un plan: hubo curiosidad y cosas que se rompieron.",
  },
  jobs: [
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
      nota: "// Liderar es sobre todo desbloquear a otros, no escribir más código. Me costó un año entenderlo.",
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
      nota: "// Mi primer cliente fuera de Venezuela. Aprendí a documentar por necesidad. Sigue siendo mi mejor hábito.",
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
      nota: "// Sin frameworks, todo a mano. Entendí el navegador antes que React. No lo cambiaría.",
    },
  ],
  projects: [
    {
      id: "bld_06", nombre: "Plataforma Educativa", icono: "grad", game: false,
      meta: "Matemática Interactiva",
      desc: "NextJS + editores de fórmulas y gráficas manipulables en el navegador.",
      tags: ["NextJS", "NestJS", "MongoDB", "Redis", "RabbitMQ", "TailwindCSS", "MathLive", "JSXGraph", "Atomic Design"],
    },
    {
      id: "bld_02", nombre: "Energía Solidaria", icono: "heart", game: false,
      meta: "Respuesta a los sismos de jun/2026",
      desc: "Sitio de ayuda humanitaria con panel público de transparencia sobre lo recaudado y entregado.",
      tags: ["Vite", "React", "TypeScript", "Tailwind"],
    },
    {
      id: "bld_03", nombre: "Aromía Studios", icono: "box", game: false,
      meta: "Marca + Web + Infra, una sola persona",
      desc: "Sitio y calendario de cursos de una escuela de cocina. Diseño, front-end e infraestructura.",
      tags: ["Vite", "React", "TypeScript", "Tailwind", "Supabase", "Traefik", "Marca"],
    },
    {
      id: "ent_04", nombre: "VESPER — el vuelo del silencio", icono: "chip", game: true, sprite: "bat",
      meta: "Pixel Art · Supervivencia · Steam",
      desc: "Eres un murciélago. Seis depredadores con comportamiento biológico real, cinco hábitats, ecolocalización como mecánica central.",
      tags: ["Godot", "Game design", "Pixel art"],
      nota: "// Llevo meses puliendo la animación de aleteo. nadie lo va a notar. yo sí, y por eso sigo.",
    },
    {
      id: "ent_05", nombre: "Element Slime Survival", icono: "chip", game: true, sprite: "slime",
      meta: "roguelite móvil · sistemas",
      desc: "Nueve estadísticas, estados elementales combinables, cinco zonas y una zona final secreta.",
      tags: ["Sistemas", "Balance", "Pixel art"],
      nota: "// Diseñar un sistema de daño elemental y un esquema de base de datos usan el mismo músculo.",
    },
  ],
  stack: [
    ["Interfaz", "React · Next.js · TypeScript · TailwindCSS · Atomic Design · HTML · CSS"],
    ["Servidor", "Node.js · NestJS · JavaScript · APIs REST · arquitectura de servicios"],
    ["Datos", "PostgreSQL · MongoDB · Redis · SQL y NoSQL · Modelado de Esquemas"],
    ["Entrega", "Docker · Kubernetes (K3s) · Traefik · cert-manager · GitHub Actions · Git"],
    ["Equipo", "Liderazgo de proyecto · Scrum · Kanban · Mentoría · Revisión de código"],
    ["Especialidad", "ReactJS · NextJS · SQL y NoSQL · TypeScript · TailwindCSS · JavaScript · CI/CD · DevOps · FullStack"],
  ],
  contact: {
    correo: "develpvoi0@gmail.com",
    linkedin: "https://www.linkedin.com/in/jhormanparra/",
    linkedinLabel: "/in/jhormanparra",
    telefono: "+58 414 4677 808",
    telHref: "tel:+584144677808",
    nota: "// Siempre con la mejor disposición a resolver tus problemas tecnicos, si necesitas un software, yo lo construyo.",
  },
  bootScript: [
    { text: "develpzedra//os v5.0 — Cargando Entorno Seguro...", dim: true, delay: 520, tone: 880 },
    { text: "[ ok ] montando /dev/curiosity", dim: false, delay: 480, tone: 520 },
    { text: "[ ok ] conectando k3s://contabo-vps", dim: false, delay: 520, tone: 560 },
    { text: "[ ok ] verificando certificados tls", dim: false, delay: 520, tone: 600 },
    { text: "[ ok ] sincronizando pipeline github-actions", dim: false, delay: 560, tone: 640 },
  ],
  ui: {
    sections: {
      identity: "identity",
      history: "runtime · trayectoria",
      infra: "systems · clúster",
      projects: "builds · producción y juegos",
      stack: "stack · por función",
      contact: "signals · contacto",
      arcade: "arcade · para el aburrimiento",
    },
    fields: {
      usuario: "usuario",
      titulo: "título",
      rol: "rol",
      host: "host",
      uptime: "uptime",
      shell: "shell",
      formacion: "formación",
      idiomas: "idiomas",
      estado: "estado",
    },
    commands: {
      help: "Lista de comandos",
      whoami: "Perfil estilo neofetch",
      history: "Trayectoria profesional",
      infra: "Estado del clúster K3s",
      projects: "Builds: producción y juegos",
      stack: "Tecnologías por función",
      contact: "Canales de contacto",
      tired: "Sala de juegos retro",
      clear: "Limpiar la terminal",
    },
    welcome: {
      tagline: "// Del componente al clúster — Construyo y lo mantengo corriendo.",
      sessionPre: "Sesión iniciada como",
      city: "Caracas, VE",
      hintPre: "Escribe",
      hintPost: "para ver comandos, o toca un chip abajo ↓",
    },
    hintbar: {
      comandos: "comandos:",
      escribePre: "escribe",
      escribePost: "↵",
    },
    arcade: {
      choose: "Sala de Juegos Retro — Elige:",
      snake: "La serpiente clásica, versión neón",
      bat: "Vuela el murciélago de VESPER por la cueva",
      howtoPre: "Escribe el nombre del juego · dentro:",
      esc: "para salir",
    },
    infra: {
      connecting: "Conectando a k3s://contabo-vps ...",
      handshake: "handshake ok",
      demoData: "demo data",
      note:
        "// Tumbé el clúster entero un domingo por un ingress mal escrito.\n" +
        "// Desde entonces todo entra por pull request, incluso lo mío.",
      footerPre: "Nota: Paneles en modo",
      demo: "demo",
      footerPost: ". se conectan a endpoints reales antes de publicar.",
    },
    games: {
      snake: { title: "SNAKE//neon", tip: "flechas o WASD · deslizar en móvil · ESC salir" },
      bat: { title: "VESPER//mini", tip: "espacio o toque para aletear · ESC salir" },
    },
    terminal: {
      notFound: "comando no encontrado:",
      tryHelp: "escribe",
      scorePre: "— puntuación",
      another: "· otra ronda:",
    },
    gameEnd: {
      bite: "te mordiste",
      cave: "contra la cueva",
      closed: "sesión cerrada",
      interrupted: "juego interrumpido",
    },
    notes: {
      stack: "// Ordenado por función, no por porcentaje. Las barras de habilidades son ficción.",
      projects:
        "// dos columnas que pesan igual. quien solo muestra trabajo de cliente parece un servicio;\n" +
        "// yo quiero parecer una persona con criterio.",
    },
    bootBar: "Inicializando Perfil ",
    contactLabels: { email: "Correo", phone: "Teléfono" },
    topbar: { sound: "sonido", on: "on", off: "off" },
    labels: { running: "running", exit0: "exit 0", langName: "ES" },
  },
};

/* ══════════════════════ ENGLISH ══════════════════════ */
const en: LocaleContent = {
  identity: {
    usuario: "Jhorman Parra",
    titulo: "Computer Engineer · FullStack",
    rol: "Fullstack | Project lead",
    host: "Caracas, Venezuela",
    uptime: "5+ years in production",
    shell: "React · Node · K8s",
    formacion: "UNERG (2023)",
    idiomas: "ES native · EN technical",
    estado: "Available for contract",
    lema: "I build the whole product and keep it running myself: from the component to the cluster.",
    nota: "// I started hand-coding HTML in Caracas and ended up running Kubernetes from my bedroom.\n// There was never a plan: there was curiosity and things that broke.",
  },
  jobs: [
    {
      id: "ent_01",
      empresa: "Sistemas Tecnológicos Alcaraván S.A.",
      periodo: "2021 — present",
      lugar: "San Juan de los Morros, VE",
      rol: "Project lead · front-end and back-end",
      running: true,
      logros: [
        "I lead several teams across simultaneous projects and own every delivery.",
        "Full cycle under agile methodologies: planning, deployment and support.",
        "Full-stack applications with React, Next.js, Node.js and MongoDB.",
      ],
      nota: "// Leading is mostly about unblocking others, not writing more code. It took me a year to get it.",
    },
    {
      id: "ent_02",
      empresa: "Requiem Innovation",
      periodo: "2019 — 2020",
      lugar: "Lima, PE",
      rol: "Web developer · Product manager",
      running: false,
      logros: [
        "Dynamic web applications in modern JavaScript.",
        "Product life cycle: features, releases and performance.",
        "Worked with UX/UI design to ship interfaces to production.",
      ],
      nota: "// My first client outside Venezuela. I learned to document out of necessity. Still my best habit.",
    },
    {
      id: "ent_03",
      empresa: "Waremedia",
      periodo: "2018 — 2019",
      lugar: "Caracas, VE",
      rol: "Web developer · UI designer",
      running: false,
      logros: [
        "Responsive, SEO-optimized sites in HTML, CSS and JavaScript.",
        "Design mockups turned into functional interfaces.",
        "Code reviews and team processes.",
      ],
      nota: "// No frameworks, everything by hand. I understood the browser before React. Wouldn't change it.",
    },
  ],
  projects: [
    {
      id: "bld_06", nombre: "Educational Platform", icono: "grad", game: false,
      meta: "Interactive Mathematics",
      desc: "NextJS + formula editors and graphs you can manipulate right in the browser.",
      tags: ["NextJS", "NestJS", "MongoDB", "Redis", "RabbitMQ", "TailwindCSS", "MathLive", "JSXGraph", "Atomic Design"],
    },
    {
      id: "bld_02", nombre: "Solidarity Energy", icono: "heart", game: false,
      meta: "Response to the Jun/2026 earthquakes",
      desc: "Humanitarian aid site with a public transparency panel for what was raised and delivered.",
      tags: ["Vite", "React", "TypeScript", "Tailwind"],
    },
    {
      id: "bld_03", nombre: "Aromía Studios", icono: "box", game: false,
      meta: "Brand + Web + Infra, one person",
      desc: "Site and course calendar for a cooking school. Design, front-end and infrastructure.",
      tags: ["Vite", "React", "TypeScript", "Tailwind", "Supabase", "Traefik", "Branding"],
    },
    {
      id: "ent_04", nombre: "VESPER — the flight of silence", icono: "chip", game: true, sprite: "bat",
      meta: "Pixel Art · Survival · Steam",
      desc: "You are a bat. Six predators with real biological behavior, five habitats, echolocation as the core mechanic.",
      tags: ["Godot", "Game design", "Pixel art"],
      nota: "// I've spent months polishing the wing-flap animation. no one will notice. I do, and that's why I keep going.",
    },
    {
      id: "ent_05", nombre: "Element Slime Survival", icono: "chip", game: true, sprite: "slime",
      meta: "mobile roguelite · systems",
      desc: "Nine stats, combinable elemental states, five zones and a secret final area.",
      tags: ["Systems", "Balance", "Pixel art"],
      nota: "// Designing an elemental damage system and a database schema use the same muscle.",
    },
  ],
  stack: [
    ["Interface", "React · Next.js · TypeScript · TailwindCSS · Atomic Design · HTML · CSS"],
    ["Server", "Node.js · NestJS · JavaScript · REST APIs · service architecture"],
    ["Data", "PostgreSQL · MongoDB · Redis · SQL & NoSQL · Schema modeling"],
    ["Delivery", "Docker · Kubernetes (K3s) · Traefik · cert-manager · GitHub Actions · Git"],
    ["Team", "Project leadership · Scrum · Kanban · Mentoring · Code review"],
    ["Specialty", "ReactJS · NextJS · SQL & NoSQL · TypeScript · TailwindCSS · JavaScript · CI/CD · DevOps · FullStack"],
  ],
  contact: {
    correo: "develpvoi0@gmail.com",
    linkedin: "https://www.linkedin.com/in/jhormanparra/",
    linkedinLabel: "/in/jhormanparra",
    telefono: "+58 414 4677 808",
    telHref: "tel:+584144677808",
    nota: "// Always glad to solve your technical problems — if you need software, I build it.",
  },
  bootScript: [
    { text: "develpzedra//os v5.0 — Loading Secure Environment...", dim: true, delay: 520, tone: 880 },
    { text: "[ ok ] mounting /dev/curiosity", dim: false, delay: 480, tone: 520 },
    { text: "[ ok ] connecting k3s://contabo-vps", dim: false, delay: 520, tone: 560 },
    { text: "[ ok ] verifying tls certificates", dim: false, delay: 520, tone: 600 },
    { text: "[ ok ] syncing github-actions pipeline", dim: false, delay: 560, tone: 640 },
  ],
  ui: {
    sections: {
      identity: "identity",
      history: "runtime · career",
      infra: "systems · cluster",
      projects: "builds · production & games",
      stack: "stack · by function",
      contact: "signals · contact",
      arcade: "arcade · for the boredom",
    },
    fields: {
      usuario: "user",
      titulo: "title",
      rol: "role",
      host: "host",
      uptime: "uptime",
      shell: "shell",
      formacion: "education",
      idiomas: "languages",
      estado: "status",
    },
    commands: {
      help: "Command list",
      whoami: "neofetch-style profile",
      history: "Professional career",
      infra: "K3s cluster status",
      projects: "Builds: production & games",
      stack: "Tech by function",
      contact: "Contact channels",
      tired: "Retro game room",
      clear: "Clear the terminal",
    },
    welcome: {
      tagline: "// From the component to the cluster — I build it and keep it running.",
      sessionPre: "Session started as",
      city: "Caracas, VE",
      hintPre: "Type",
      hintPost: "to see commands, or tap a chip below ↓",
    },
    hintbar: {
      comandos: "commands:",
      escribePre: "type",
      escribePost: "↵",
    },
    arcade: {
      choose: "Retro Game Room — Choose:",
      snake: "The classic snake, neon edition",
      bat: "Fly the VESPER bat through the cave",
      howtoPre: "Type the game name · inside:",
      esc: "to exit",
    },
    infra: {
      connecting: "Connecting to k3s://contabo-vps ...",
      handshake: "handshake ok",
      demoData: "demo data",
      note:
        "// I took the whole cluster down one Sunday over a badly written ingress.\n" +
        "// Since then everything goes through a pull request, even my own.",
      footerPre: "Note: Panels in",
      demo: "demo",
      footerPost: " mode. they connect to real endpoints before publishing.",
    },
    games: {
      snake: { title: "SNAKE//neon", tip: "arrows or WASD · swipe on mobile · ESC to exit" },
      bat: { title: "VESPER//mini", tip: "space or tap to flap · ESC to exit" },
    },
    terminal: {
      notFound: "command not found:",
      tryHelp: "type",
      scorePre: "— score",
      another: "· another round:",
    },
    gameEnd: {
      bite: "you bit yourself",
      cave: "hit the cave",
      closed: "session closed",
      interrupted: "game interrupted",
    },
    notes: {
      stack: "// Ordered by function, not by percentage. Skill bars are fiction.",
      projects:
        "// two columns that weigh the same. showing only client work looks like a service;\n" +
        "// I'd rather look like a person with judgment.",
    },
    bootBar: "Initializing Profile ",
    contactLabels: { email: "Email", phone: "Phone" },
    topbar: { sound: "sound", on: "on", off: "off" },
    labels: { running: "running", exit0: "exit 0", langName: "EN" },
  },
};

export const content: Record<Lang, LocaleContent> = { es, en };
