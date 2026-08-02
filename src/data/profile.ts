export const identity = {
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
] as const;

/* `sprite` solo existe en los juegos: los bloques comprueban
   ("sprite" in p) para decidir si muestran pixel art o icono. */
export const projects = [
  /* {
    id: "bld_01", nombre: "Control académico UCV", icono: "box", game: false,
    meta: "MVP · precio cerrado · despliegue propio",
    desc: "Sistema de control de estudiantes para la Facultad de Farmacia. Ocho módulos.",
    tags: ["Next.js", "NestJS", "PostgreSQL", "K3s"],
  }, */
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
  }
] as const;

export const stack = [
  [
    "Interfaz",
    "React · Next.js · TypeScript · TailwindCSS · Atomic Design · HTML · CSS",
  ],
  [
    "Servidor",
    "Node.js · NestJS · JavaScript · APIs REST · arquitectura de servicios",
  ],
  [
    "Datos",
    "PostgreSQL · MongoDB · Redis · SQL y NoSQL · Modelado de Esquemas",
  ],
  [
    "Entrega",
    "Docker · Kubernetes (K3s) · Traefik · cert-manager · GitHub Actions · Git",
  ],
  [
    "Equipo",
    "Liderazgo de proyecto · Scrum · Kanban · Mentoría · Revisión de código",
  ],
  [
    "Especialidad",
    "ReactJS · NextJS · SQL y NoSQL · TypeScript · TailwindCSS · JavaScript · CI/CD · DevOps · FullStack",
  ],
] as const;

export const contact = {
  correo: "develpvoi0@gmail.com",
  linkedin: "https://www.linkedin.com/in/jhormanparra/",
  linkedinLabel: "/in/jhormanparra",
  telefono: "+58 414 4677 808",
  telHref: "tel:+584144677808",
  nota: "// Siempre con la mejor disposición a resolver tus problemas tecnicos, si necesitas un software, yo lo construyo.",
} as const;

export const bootScript = [
  {
    text: "develpzedra//os v5.0 — Cargando Entorno Seguro...",
    dim: true,
    delay: 520,
    tone: 880,
  },
  { text: "[ ok ] montando /dev/curiosity", dim: false, delay: 480, tone: 520 },
  {
    text: "[ ok ] conectando k3s://contabo-vps",
    dim: false,
    delay: 520,
    tone: 560,
  },
  {
    text: "[ ok ] verificando certificados tls",
    dim: false,
    delay: 520,
    tone: 600,
  },
  {
    text: "[ ok ] sincronizando pipeline github-actions",
    dim: false,
    delay: 560,
    tone: 640,
  },
] as const;
