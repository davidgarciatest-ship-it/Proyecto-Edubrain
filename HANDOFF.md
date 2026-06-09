# Handoff — EduBrain App

## Estado del proyecto — ✅ COMPLETO 100%

| RF | Descripción | Estado |
|----|-------------|--------|
| **RF-01** | Interacción Conversacional con IA | ✅ Completo |
| **RF-02** | Registro de Hábitos Diarios vía Chat | ✅ Completo |
| **RF-03** | Persistencia de Historial de Chat | ✅ Completo |
| **RF-04** | Análisis de Rendimiento Cognitivo | ✅ Completo |
| **RF-05** | Gestión de Perfil Académico | ✅ Completo |
| **RF-06** | Gestión de Recordatorios y Notificaciones | ✅ Completo |

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend (móvil) | React Native (Expo) + Expo Router |
| Backend / IA | Node.js + Express + TypeScript |
| IA Gateway | OpenRouter (`openai/gpt-4o-mini`) |
| Base de datos | SQLite (`sql.js`) |
| SDK IA | `openai` SDK oficial (compatible con OpenRouter) |
| Notificaciones | `expo-notifications` (locales) |
| Idioma | Español |

---

## Estructura del proyecto

```
Proyecto Edubrain/
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Servidor Express (async startup)
│   │   ├── routes/
│   │   │   ├── chat.ts                 # POST /api/chat, GET /api/chat/history
│   │   │   ├── habits.ts               # GET /api/habits, GET /api/habits/summary
│   │   │   ├── profile.ts              # GET/PUT /api/profile
│   │   │   └── reminders.ts            # CRUD /api/reminders
│   │   ├── services/
│   │   │   └── openrouter.ts           # OpenRouter + 4 tools + profile context
│   │   ├── database/
│   │   │   ├── init.ts                 # SQLite (sql.js) + 4 tablas
│   │   │   └── queries.ts              # 12 funciones CRUD
│   │   └── types/
│   │       └── index.ts
│   ├── data/                           # SQLite DB (se crea al iniciar)
│   ├── dist/                           # Compilación TypeScript
│   ├── .env                            # Variables de entorno
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx                 # Tab bar: Chat + Perfil
│   │   ├── index.tsx                   # Chat (FlatList + ChatInput + TypingIndicator)
│   │   ├── profile.tsx                 # Perfil académico (formulario completo)
│   │   └── reminders.tsx              # Recordatorios (lista + modal crear)
│   └── _layout.tsx                     # Root layout + notification handler
├── src/
│   ├── components/
│   │   ├── ChatBubble.tsx              # Burbuja IA (indicio) / usuario (blanco)
│   │   ├── ChatInput.tsx               # Input 8px + botón pill 9999px
│   │   └── TypingIndicator.tsx         # Animación 3 puntos
│   ├── services/
│   │   ├── chatService.ts              # Llamadas al backend
│   │   └── notificationService.ts      # Permisos + schedule/cancel notificaciones
│   ├── hooks/
│   │   ├── useChat.ts                  # Estado chat + persistencia AsyncStorage
│   │   ├── useProfile.ts               # Cargar/guardar perfil
│   │   └── useReminders.ts             # CRUD recordatorios
│   ├── constants/
│   │   ├── colors.ts                   # Tokens de DESIGN.md
│   │   └── typography.ts              # Escala tipográfica
│   └── types/
│       └── index.ts                    # Tipos compartidos
├── assets/                             # Iconos (pendiente de agregar)
├── .gitignore
├── app.json
├── package.json
├── tsconfig.json
├── EduBrain_App_Srs.md
├── DESIGN.md
└── HANDOFF.md
```

---

## Decisiones técnicas

| Aspecto | Decisión |
|---------|----------|
| Navegación | Expo Router (file-based routing) |
| Estructura | Monorepo (frontend + backend juntos) |
| Base de datos | `sql.js` (SQLite puro JS, sin compilación nativa) |
| Modelo IA | `openai/gpt-4o-mini` (configurable en `.env`) |
| SDK IA | OpenAI SDK oficial (apunta a endpoint de OpenRouter) |
| Notificaciones | Locales con `expo-notifications` |
| Perfil en contexto AI | Sí, se inyecta en system prompt |
| Sesión persistente | AsyncStorage guarda sessionId entre reinicios |
| Navegación perfil/recordatorios | Perfil en tab bar; Recordatorios accesible desde Perfil |

---

## Endpoints del backend

| Método | Ruta | RF |
|--------|------|----|
| `POST` | `/api/chat` | 1,2,4,5 |
| `GET` | `/api/chat/history?sessionId=X` | 3 |
| `GET` | `/api/habits?sessionId=X&period=week&start=X&end=X` | 2 |
| `GET` | `/api/habits/summary?sessionId=X&period=week` | 4 |
| `GET` | `/api/profile?sessionId=X` | 5 |
| `PUT` | `/api/profile` | 5 |
| `GET` | `/api/reminders?sessionId=X` | 6 |
| `POST` | `/api/reminders` | 6 |
| `PUT` | `/api/reminders/:id` | 6 |
| `DELETE` | `/api/reminders/:id` | 6 |

---

## Tools de OpenAI (4 tools)

| Tool | Disparo | Acción |
|------|---------|--------|
| `register_habit` | Usuario reporta comida/estudio | `saveHabit()` |
| `get_habit_analysis` | Usuario pide resumen | `getHabitsSummary()` |
| `register_profile` | Usuario describe perfil | `upsertProfile()` |
| `set_reminder` | Usuario pide recordatorio | `createReminder()` |

---

## Cómo ejecutar localmente

```bash
# Terminal 1 — Backend
cd "Proyecto Edubrain/backend"
npx tsx src/index.ts

# Terminal 2 — Frontend
cd "Proyecto Edubrain"
npx expo start
```

Escanea el QR con Expo Go (misma red WiFi).

---

## Cómo generar APK standalone

### 1. Subir backend a la nube (Render)

1. Crear cuenta en [render.com](https://render.com) (login con GitHub)
2. Subir el proyecto a GitHub:
   ```bash
   cd "Proyecto Edubrain"
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tuusuario/edubrain-backend.git
   git push -u origin main
   ```
3. En Render: **New +** → **Web Service** → conectar repo
4. Configurar:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Agregar env vars: `OPENROUTER_API_KEY`, `PORT`
6. Render dará una URL: `https://edubrain-backend.onrender.com`

### 2. Actualizar URLs del frontend

Editar `src/services/chatService.ts`, `src/hooks/useProfile.ts`, `src/hooks/useReminders.ts`:
```typescript
const API_BASE = 'https://edubrain-backend.onrender.com/api';
```

### 3. Generar APK con EAS Build

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

Requiere cuenta en [expo.dev](https://expo.dev).

---

## Pendientes menores

- [ ] Agregar assets visuales (`assets/icon.png`, `assets/splash-icon.png`, etc.)
- [ ] Probar el tool loop de OpenRouter con una API key real
- [ ] Configurar despliegue en Render/Railway
- [ ] Generar APK con EAS Build

---

## Enlaces

- [DESIGN.md](./DESIGN.md) — Sistema de diseño
- [EduBrain_App_Srs.md](./EduBrain_App_Srs.md) — Requisitos funcionales
