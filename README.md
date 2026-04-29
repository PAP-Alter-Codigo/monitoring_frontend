# TerritorioRios — Monitoring Frontend

Frontend web para la herramienta de monitoreo periodístico del proyecto **TerritorioRios** (PAP ITESO). Permite registrar, buscar y gestionar artículos periodísticos relacionados con las problemáticas territoriales del proyecto.

## Stack

- **React 19** + **Vite 6**
- **React Router DOM 7** — navegación SPA
- **React Bootstrap 2** + **Bootstrap 5** — UI
- Autenticación via Google OAuth (delegada al backend)

## Páginas

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `LoginPage` | Login con Google OAuth |
| `/dashboard` | `HomePage` | Panel principal con acceso a módulos y noticias recientes |
| `/search` | `Search` | Búsqueda y filtrado de artículos |
| `/article-form` | `ArticleForm` | Formulario para dar de alta artículos |
| `/admin-page` | `AdminPage` | Gestión de tags y fuentes (source URLs) |

## Requisitos

- Node.js 18+
- Backend corriendo (ver repo `monitoring_tool`)

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000
```

Si no se define, la app apunta a `http://localhost:3000` por defecto.

## Comandos

```bash
# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint
```

## Estructura del proyecto

```
src/
├── pages/
│   ├── LoginPage.jsx          # Autenticación Google
│   ├── Home/
│   │   ├── HomePage.jsx       # Dashboard principal
│   │   └── NoticiasRecientes.jsx
│   ├── Search/
│   │   ├── Search.jsx         # Lista y filtros de artículos
│   │   ├── Filters.jsx
│   │   └── ArticleList.jsx
│   ├── ArticleForm/
│   │   └── ArticleForm.jsx    # Alta de artículos
│   └── AdminPage/
│       ├── AdminPage.jsx      # Panel de administración
│       ├── TagsManager.jsx    # CRUD de tags
│       └── SourceUrlsManager.jsx  # CRUD de fuentes
├── components/
│   ├── return-menu.jsx
│   ├── ConfirmModal.jsx
│   └── ToastNotification.jsx
└── utils/
    ├── fetchWithAuth.js       # fetch con credentials: 'include'
    └── brushStrokes.jsx       # Decoraciones SVG
```

## Autenticación

La autenticación está basada en sesiones de Google OAuth manejadas por el backend. El frontend redirige al usuario a `{VITE_API_URL}/auth/google` y todas las peticiones al API incluyen cookies de sesión via `credentials: 'include'` (ver `utils/fetchWithAuth.js`).

## Contexto del proyecto

Este frontend es parte del ecosistema **TerritorioRios**, que también incluye:

- **`monitoring_tool`** — API REST (backend)
- **`muninn`** — agente de scraping/recolección de noticias
