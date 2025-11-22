# CrediStore

Panel web para gestionar fiados/deudas, usuarios y productos de una pulpería. Construido con Next.js (App Router), React, Tailwind v4, Zustand (persistencia en IndexedDB) y listo como PWA instalable.

## Stack y arquitectura
- **Frontend**: Next.js 16 (App Router) + React 19.
- **Estilos**: Tailwind CSS v4 (clases utilitarias).
- **Estado/Persistencia**: Zustand + idb-keyval (IndexedDB) con clave `credistore-data-v2`.
- **PWA**: `manifest.webmanifest` + `sw.js` + registro en `ServiceWorkerRegister`.
- **Selects**: react-select con avatares para usuarios/fiadores.

## Features principales
- **Dashboard**: métricas resumidas, deudas próximas, inventario y productos por agotar.
- **Deudas (Fiadores)**:
  - Filtros: estado, fecha, búsqueda por fiador (debounce).
  - Crear deuda (mobile-first): select de fiador con foto, fecha, estado, selector de productos con control de cantidades y actualización de stock.
  - Tabla/cards: fiador, # productos, estado editable, total, detalle y eliminar.
  - Detalle muestra productos y totales.
- **Usuarios**: CRUD con modal, conteo de deudas activas, subida de imagen (data URL).
- **Productos**: CRUD, tipos fijos, stock y precio; tabla/cards responsivas.

## Scripts
- `npm run dev` — modo desarrollo.
- `npm run build` — build producción.
- `npm run start` — servir build.
- `npm run lint` — linting.

## Estructura relevante
- `app/page.tsx` — Dashboard.
- `app/fiadores/page.tsx` — Deudas (vista principal de fiados).
- `app/usuarios/page.tsx`, `app/productos/page.tsx` — secciones CRUD.
- `app/components/*` — UI reutilizable (shell, modales, tablas, formularios, stats).
- `app/store/data-store.ts` — Zustand + IndexedDB, sincroniza deudas y actualiza stock/fiadores.
- `public/manifest.webmanifest`, `public/sw.js`, `app/components/ServiceWorkerRegister.tsx` — PWA.

## Persistencia y datos
- El estado se guarda en IndexedDB; los arrays iniciales están vacíos (sin seeds).
- Crear deudas descuenta stock; editar estado de deuda actualiza fiadores agregados.

## Instalación / uso local
```bash
npm install
npm run dev
# abrir http://localhost:3000
```

## Notas PWA
- Ejecutar en modo prod para registrar SW: `npm run build && npm run start`.
- HTTPS requerido en despliegue para instalación.
