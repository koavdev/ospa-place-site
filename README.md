# OSPA place — home

Landing standalone da vertical **OSPA place**, extraída do site institucional (`OSPA-Sites`) para um projeto independente — mesma stack (Vue 3 + Vite + vite-ssg + Tailwind v4), servindo a página em `/`.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Vue 3 (`<script setup>`) |
| Build / SSG | Vite + vite-ssg |
| CSS | Tailwind CSS v4 |
| Roteamento | Vue Router 4 (rota única) |
| Runtime | Node.js ≥ 22 |

## Setup

```bash
cp .env.example .env
npm install
```

## Desenvolvimento

```bash
npm run dev      # http://localhost:5173 (SPA, sem pré-renderização)
```

## Build

```bash
npm run build    # SSG — pré-renderiza '/' em HTML estático em dist/
npm run preview  # serve dist/ em http://localhost:4173
```

## Estrutura

```
src/
  pages/PlacePage.vue     — página da vertical (rota '/')
  components/place/        — seções e modais da OSPA place
  components/shared/       — NavBar/Footer/modais reutilizados
  composables/             — usePageHead, formulários, máscara de telefone, choices
  utils/, data/            — opções de formulário e base de estados/cidades
  router/routes.js         — rota única
public/                    — logos, imagens (images/place) e vídeos (videos/place*)
```
