# ── Etapa 1: build con Bun ──────────────────────────────
FROM oven/bun:1 AS build

WORKDIR /app

# Copiar solo los manifiestos primero aprovecha la cache de Docker:
# si no cambian las dependencias, esta capa se reutiliza
COPY package.json bun.lock* bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# ── Etapa 2: servir con nginx ───────────────────────────
FROM nginx:1.27-alpine

# El resultado del build de Vite vive en /app/dist
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]