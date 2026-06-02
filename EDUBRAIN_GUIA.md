# Guía de Desarrollo — EduBrain v1.0.0

> Documento creado para el equipo. Explica qué construimos, cómo funciona y cómo replicar el proceso de principio a fin.

---

## Índice

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
4. [Arquitectura](#4-arquitectura)
5. [Regla de Máximo 100 Líneas por Archivo](#5-regla-de-máximo-100-líneas-por-archivo)
6. [Guía de Despliegue](#6-guía-de-despliegue)
7. [Generación de APK](#7-generación-de-apk)
8. [Lecciones Aprendidas](#8-lecciones-aprendidas)
9. [Hoja de Referencia Rápida](#9-hoja-de-referencia-rápida)

---

## 1. Resumen del Proyecto

**EduBrain** es una aplicación móvil asistente educativo impulsada por IA. Ayuda a estudiantes de colegio/universidad a:

- **RF-01** — Conversar con una IA sobre técnicas de estudio y nutrición
- **RF-02** — Registrar hábitos diarios (comidas, sesiones de estudio) vía chat
- **RF-03** — Persistir el historial de chat entre sesiones
- **RF-04** — Solicitar análisis de rendimiento cognitivo
- **RF-05** — Gestionar perfil académico (nivel, materias, objetivos)
- **RF-06** — Crear recordatorios con notificaciones push locales

### Público objetivo

Estudiantes de 12-22 años (secundaria y universidad). Interfaz minimalista, amigable, en español.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Frontend móvil | React Native + Expo SDK 52 | Una base de código para Android/iOS, hot reload, facilidad de build |
| Navegación | Expo Router | Routing basado en archivos (similar a Next.js), intuitivo |
| Backend | Node.js + Express + TypeScript | Rápido de desarrollar, tipado seguro, mismo lenguaje que el frontend |
| IA Gateway | OpenRouter (`openai/gpt-4o-mini`) | Acceso a GPT-4o-mini sin API key directa de OpenAI, más barato |
| Base de datos | SQLite (`sql.js`) | Sin servidor, archivo local, ideal para MVP y usuarios individuales |
| Notificaciones | `expo-notifications` | Notificaciones locales programadas, sin depender de servicios cloud |
| SDK IA | OpenAI SDK oficial | Apunta a endpoint de OpenRouter, código estándar y documentado |

### Por qué NO usamos otras opciones

| No usamos | Motivo |
|-----------|--------|
| Firebase Firestore | Requiere internet constante, agrega latencia, más complejo para MVP |
| PostgreSQL/MySQL | Requiere servidor de base de datos externo, overkill para datos locales |
| OOP con clases | El equipo prefirió estilo funcional + hooks (ver sección 5) |
| MongoDB | Datos relacionales (mensajes, hábitos, perfil) se modelan mejor en SQL |

---

## 3. Estructura del Proyecto

```
Proyecto Edubrain/
│
├── backend/                          # Servidor Express
│   ├── src/
│   │   ├── index.ts                  # Punto de entrada, levanta Express
│   │   ├── routes/                   # Controladores HTTP
│   │   │   ├── chat.ts               # POST/GET /api/chat
│   │   │   ├── habits.ts             # GET /api/habits
│   │   │   ├── profile.ts            # GET/PUT /api/profile
│   │   │   └── reminders.ts          # CRUD /api/reminders (40 líneas)
│   │   ├── services/
│   │   │   └── openrouter/           # Integración con OpenRouter
│   │   │       ├── index.ts          # processChatMessage (loop IA)
│   │   │       ├── client.ts         # Inicialización del cliente OpenAI
│   │   │       ├── prompts.ts        # System prompt con contexto
│   │   │       ├── tools.ts          # Combina tools de IA
│   │   │       ├── tools-habits.ts   # register_habit, get_habit_analysis
│   │   │       ├── tools-profile.ts  # register_profile, set_reminder
│   │   │       └── executors.ts      # Ejecuta cada tool llamando DB
│   │   ├── database/
│   │   │   ├── init.ts               # Inicializa SQLite + tablas
│   │   │   └── queries/              # Acceso a datos
│   │   │       ├── _shared.ts        # helpers prepare(), run(), getOne()
│   │   │       ├── chat.ts           # saveMessage, getMessagesBySession
│   │   │       ├── habits.ts         # saveHabit, getHabitsSummary
│   │   │       ├── profile.ts        # upsertProfile, getProfile
│   │   │       ├── reminders.ts      # CRUD recordatorios
│   │   │       └── index.ts          # Barrel: re-exporta todo
│   │   └── types/
│   │       └── index.ts              # Interfaces compartidas
│   ├── data/                         # Archivo SQLite (se crea solo)
│   ├── .env                          # OPENROUTER_API_KEY, PORT
│   └── package.json
│
├── app/                              # Pantallas (Expo Router)
│   ├── _layout.tsx                   # Layout raíz
│   └── (tabs)/
│       ├── _layout.tsx               # Tab bar (Chat | Perfil)
│       ├── index.tsx                 # Pantalla de chat (36 líneas)
│       ├── profile.tsx               # Perfil académico (61 líneas)
│       └── reminders.tsx             # Lista de recordatorios (70 líneas)
│
├── src/                              # Lógica compartida frontend
│   ├── components/
│   │   ├── ChatBubble.tsx            # Burbuja de chat para IA/usuario
│   │   ├── ChatInput.tsx             # Input + botón enviar
│   │   ├── TypingIndicator.tsx       # Animación de 3 puntos
│   │   ├── reminders/
│   │   │   ├── ReminderCard.tsx      # Tarjeta individual
│   │   │   ├── DayPicker.tsx         # Selector de días
│   │   │   └── CreateReminderModal.tsx # Modal para crear
│   │   └── profile/
│   │       ├── LevelSelector.tsx     # Botones nivel educativo
│   │       └── TagInput.tsx          # Input para agregar tags
│   ├── hooks/
│   │   ├── useChat.ts                # Estado y lógica del chat
│   │   ├── useProfile.ts             # Cargar/guardar perfil
│   │   └── useReminders.ts           # CRUD recordatorios
│   ├── services/
│   │   ├── chatService.ts            # Llamadas HTTP al backend
│   │   └── notificationService.ts    # Permisos + schedule notificaciones
│   ├── constants/
│   │   ├── api.ts                    # URL del backend (centralizada)
│   │   ├── colors.ts                 # Tokens de color
│   │   └── typography.ts             # Escala tipográfica
│   └── types/
│       └── index.ts                  # Interfaces (ChatMessage, HabitLog, etc.)
│
├── assets/                           # Iconos de la app
│   ├── icon.png                      # 1024×1024
│   ├── adaptive-icon.png             # 1024×1024
│   ├── splash-icon.png               # 512×512
│   └── favicon.png                   # 48×48
│
├── .gitignore                        # node_modules, dist, .env, *.db
├── app.json                          # Configuración de Expo
├── package.json                      # Dependencias del frontend
├── tsconfig.json
├── EduBrain_App_Srs.md               # Requisitos funcionales
├── DESIGN.md                         # Sistema de diseño
├── HANDOFF.md                        # Estado del proyecto
└── EDUBRAIN_GUIA.md                  # Este archivo
```

---

## 4. Arquitectura

### 4.1 Flujo de una conversación

```
Usuario escribe mensaje
        │
        ▼
┌─────────────────────────┐
│  ChatScreen (index.tsx) │  ← Vista (React component)
│  └─ llama send(mensaje) │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  useChat (hook)         │  ← Controlador frontend
│  └─ actualiza estado    │
│  └─ llama chatService   │
└──────────┬──────────────┘
           │  fetch() HTTP POST
           ▼
┌─────────────────────────┐
│  POST /api/chat         │  ← Controlador backend
│  (routes/chat.ts)       │
│  └─ valida input        │
│  └─ llama processMsg    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  processChatMessage     │  ← Servicio IA
│  (openrouter/index.ts)  │
│  └─ buildSystemPrompt   │
│  └─ llama OpenAI API    │
│  └─ si hay tool_call:   │
│     └─ executeTool()    │  ← ejecutors.ts
│        └─ saveHabit()   │  ← queries/habits.ts
│        └─ getSummary()  │
│        └─ upsertProfile │  ← queries/profile.ts
│        └─ createReminder│  ← queries/reminders.ts
│  └─ devuelve respuesta  │
└──────────┬──────────────┘
           │
           ▼  (respuesta JSON)
┌─────────────────────────┐
│  useChat actualiza msgs │
│  ChatScreen re-renderiza│
└─────────────────────────┘
```

### 4.2 Patrón: Funcional + Hooks (NO OOP)

El proyecto **evita explícitamente** clases y patrones OOP tradicionales. Usa:

| En lugar de clases... | Usamos funciones sueltas |
|-----------------------|--------------------------|
| `class Database { private db }` | `let db` (módulo) + `initDb()` |
| `class ChatService { send() }` | `export function sendMessage()` |
| `class ProfileController` | `router.get('/profile', handler)` |
| `class ChatScreen extends Component` | `function ChatScreen()` (React component) |

Ventajas de este enfoque:
- Menos boilerplate (sin `this`, sin constructores)
- Tipado más simple (tipos inferidos, interfaces planas)
- Fácil de testear (funciones puras > objetos con estado)
- Coincide con el estilo moderno de React (hooks)

### 4.3 Base de datos: SQLite con sql.js

```typescript
// init.ts
let db: SqlJsDatabase;

export async function initDb(): Promise<SqlJsDatabase> {
  if (db) return db;  // singleton
  const SQL = await initSqlJs();
  // ... carga o crea archivo
}

// queries/_shared.ts
export function prepare<T>(sql, params): T[] { /* ejecuta SELECT */ }
export function run(sql, params): { changes, lastInsertRowid } { /* ejecuta INSERT/UPDATE/DELETE */ }
export function getOne<T>(sql, params): T | undefined { /* primer resultado */ }
```

Las 4 tablas:
- `chat_messages` — historial de chat
- `habit_log` — comidas y sesiones de estudio
- `user_profile` — datos del estudiante
- `reminders` — recordatorios

---

## 5. Regla de Máximo 100 Líneas por Archivo

### 5.1 El problema

Había archivos que excedían el límite de 100 líneas:

| Archivo | Líneas | Penalizable |
|---------|--------|:-----------:|
| `backend/src/database/queries.ts` | 323 | ❌ |
| `backend/src/services/openrouter.ts` | 300 | ❌ |
| `app/(tabs)/reminders.tsx` | 415 | ❌ |
| `app/(tabs)/profile.tsx` | 306 | ❌ |
| `app/(tabs)/index.tsx` | 118 | ❌ |
| `backend/src/routes/reminders.ts` | 139 | ❌ |

### 5.2 La solución: dividir en archivos más pequeños

**Estrategia:** Extraer cada responsabilidad en su propio archivo.

#### `queries.ts` → 6 archivos

| Archivo | Líneas | Contiene |
|---------|--------|----------|
| `queries/_shared.ts` | 22 | `prepare()`, `run()`, `getOne()` |
| `queries/chat.ts` | 9 | `saveMessage`, `getMessagesBySession` |
| `queries/habits.ts` | 52 | `saveHabit`, `getHabitsSummary` |
| `queries/profile.ts` | 20 | `upsertProfile`, `getProfile` |
| `queries/reminders.ts` | 34 | CRUD recordatorios |
| `queries/index.ts` | 4 | Barrel re-export |

**Cómo funciona el barrel:**

```typescript
// queries/index.ts
export { saveMessage, getMessagesBySession } from './chat';
export { saveHabit, getHabitsBySession, getHabitsByDateRange, getHabitsSummary } from './habits';
export { upsertProfile, getProfile } from './profile';
export { getReminders, createReminder, updateReminder, deleteReminder } from './reminders';
```

Luego los imports quedan igual: `from '../database/queries'` — Node.js resuelve automáticamente `queries/` folder → `queries/index.ts`.

#### `openrouter.ts` → 7 archivos

| Archivo | Líneas | Contiene |
|---------|--------|----------|
| `openrouter/client.ts` | 7 | Inicialización OpenAI + MODEL |
| `openrouter/prompts.ts` | 27 | `buildSystemPrompt()` |
| `openrouter/tools-habits.ts` | 36 | Tools: register_habit, get_habit_analysis |
| `openrouter/tools-profile.ts` | 37 | Tools: register_profile, set_reminder |
| `openrouter/tools.ts` | 4 | Combina tools de ambos archivos |
| `openrouter/executors.ts` | 38 | Ejecuta cada tool contra la DB |
| `openrouter/index.ts` | 32 | `processChatMessage()` — loop principal |

**Flujo de llamada:**
```
routes/chat.ts
  → import { processChatMessage } from '../services/openrouter'
    → index.ts importa:
      → client.ts (OpenAI SDK)
      → prompts.ts (system prompt)
      → tools.ts (definiciones de tools)
      → executors.ts (ejecutores de tools)
```

#### `reminders.tsx` → 4 archivos

| Archivo | Líneas | Contiene |
|---------|--------|----------|
| `reminders/ReminderCard.tsx` | 38 | Tarjeta con toggle y delete |
| `reminders/DayPicker.tsx` | 22 | Selector de días |
| `reminders/CreateReminderModal.tsx` | 72 | Modal de creación |
| `reminders.tsx` (original) | **70** | Pantalla principal (FlatList + FAB) |

#### `profile.tsx` → 3 archivos

| Archivo | Líneas | Contiene |
|---------|--------|----------|
| `profile/LevelSelector.tsx` | 27 | Botones: Primaria/Secundaria/Universidad |
| `profile/TagInput.tsx` | 34 | Input + chips para materias/objetivos |
| `profile.tsx` (original) | **61** | Pantalla principal (ScrollView + cards) |

#### Archivos compactados

| Archivo original | Líneas | Archivo final | Líneas |
|-----------------|--------|---------------|--------|
| `index.tsx` | 118 | `index.tsx` | 36 |
| `routers/reminders.ts` | 139 | `routers/reminders.ts` | 46 |

### 5.3 Consejos para mantener archivos pequeños

1. **Un componente = un archivo.** Si un archivo JSX tiene más de 100 líneas, extrae partes en componentes hijos.
2. **Un tema = un archivo de queries.** No pongas `saveMessage` junto a `createReminder` en el mismo archivo.
3. **Barrel pattern.** Usa `index.ts` para re-exportar y mantener los imports cortos.
4. **Compacta sin perder claridad.** Combina declaraciones cortas en una línea:
   ```typescript
   // ❌ Antes (verboso)
   if (!sessionId || typeof sessionId !== 'string') {
     res.status(400).json({ error: 'sessionId requerido' });
     return;
   }

   // ✅ Después (compacto)
   if (!sessionId || typeof sessionId !== 'string') { res.status(400).json({ error: 'sessionId requerido' }); return }
   ```
5. **Extrae lógica repetida.** Si ves el mismo patrón 2+ veces, haz una función helper.

---

## 6. Guía de Despliegue

### 6.1 Subir código a GitHub

#### Prerrequisitos
- Tener [Git](https://git-scm.com) instalado
- Tener cuenta en [GitHub](https://github.com)
- Tener un **Personal Access Token** (Settings → Developer settings → Tokens → Generate new token, scope: `repo`)

#### Comandos

```bash
# 1. Ir al proyecto
cd "D:\2025\Programacion\Proyecto Microtesis\Proyecto Edubrain"

# 2. Inicializar repositorio
git init

# 3. Agregar todos los archivos
git add .

# 4. Crear primer commit
git commit -m "v1.0.0 - EduBrain complete"

# 5. Renombrar rama a main
git branch -M main

# 6. Conectar con GitHub (crear repo primero en github.com/new)
git remote add origin https://github.com/TU_USUARIO/edubrain-backend.git

# 7. Subir código (te pedirá usuario y token)
git push -u origin main
```

Si pide contraseña, usa el **token** (no tu contraseña de GitHub).

### 6.2 Desplegar backend en Render

Render es un servicio cloud gratuito para backend.

#### Paso a paso

1. Ve a [render.com](https://render.com) y crea cuenta con GitHub
2. Haz clic en **New +** → **Web Service**
3. Conecta tu repositorio `edubrain-backend`
4. Configura:

| Campo | Valor |
|-------|-------|
| **Name** | `edubrain-backend` |
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | Free |

5. En **Advanced** → **Environment Variables**, agrega:

| Variable | Valor |
|----------|-------|
| `OPENROUTER_API_KEY` | `sk-or-v1-tu-api-key-aqui` |
| `PORT` | `10000` |

6. Haz clic en **Deploy Web Service**

Render te dará una URL: `https://edubrain-backend.onrender.com`

#### Verificar que funciona

```bash
curl https://edubrain-backend.onrender.com/api/health
# → {"status":"ok","timestamp":"..."}
```

### 6.3 Actualizar URL en el frontend

Editar `src/constants/api.ts`:

```typescript
const DEV_API_URL = 'http://192.168.0.129:3001/api';    // tu IP local
const PROD_API_URL = 'https://edubrain-backend.onrender.com/api';  // URL de Render

export const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ??                        // override opcional
  (process.env.NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL);  // auto switch
```

En producción (APK), usará `PROD_API_URL`. Para desarrollo local, usa `DEV_API_URL`.

---

## 7. Generación de APK

### 7.1 Prerrequisitos

- Cuenta en [expo.dev](https://expo.dev)
- `eas-cli` instalado:
  ```bash
  npm install -g eas-cli
  ```

### 7.2 Configurar EAS Build

Crear `eas.json` en la raíz del proyecto (si no existe):

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### 7.3 Generar APK

```bash
# 1. Iniciar sesión en Expo
eas login

# 2. Construir APK (tarda ~5-10 min)
eas build --platform android --profile preview
```

EAS te dará un link para descargar el APK.

### 7.4 Variables de entorno en EAS Build

Para que `EXPO_PUBLIC_API_URL` funcione en el APK, configúrala en EAS:

```bash
eas secret:create --name EXPO_PUBLIC_API_URL --value https://edubrain-backend.onrender.com/api
```

O en el dashboard de Expo: https://expo.dev → proyecto → Secrets.

---

## 8. Lecciones Aprendidas

### 8.1 Funcional > OOP para este proyecto

| Aspecto | OOP (clases) | Funcional (hooks) |
|---------|--------------|-------------------|
| Boilerplate | Mucho (constructor, métodos, this) | Poco (solo funciones) |
| Testeabilidad | Media (mock de instancias) | Alta (funciones puras) |
| Reactividad | Componentes de clase verbosos | Hooks + functional components |
| Curva de aprendizaje | Alta (herencia, polimorfismo) | Baja (solo funciones) |
| Tamaño de archivos | Tienden a crecer | Fáciles de mantener pequeños |

**Recomendación:** Para apps React Native con backend Express, el estilo funcional con hooks es más productivo que OOP tradicional. Guarda OOP para proyectos con lógica de dominio compleja (ej. motor de reglas de negocio).

### 8.2 Dividir archivos temprano

Es más fácil empezar con archivos pequeños que refactorizar archivos grandes después. Regla práctica:

> Si un archivo tiene > 80 líneas y mezcla responsabilidades distintas → divídelo.

Ejemplo: `queries.ts` mezclaba chat, hábitos, perfil y recordatorios. Dividirlo por entidad fue natural y cada archivo quedó auto-contenido.

### 8.3 Centralizar configuraciones

En lugar de esparcir `API_BASE = 'http://...'` por 3 archivos, lo centralizamos en `src/constants/api.ts`. Beneficios:
- Cambiar la URL de producción es editar 1 archivo
- Switchear entre dev/prod es automático (vía `NODE_ENV`)
- Se puede override con `EXPO_PUBLIC_API_URL`

### 8.4 El barrel pattern

```typescript
// database/queries/index.ts
export { ... } from './chat';
export { ... } from './habits';
// etc.
```

Ventajas:
- Los imports de otros archivos no cambian: `'../database/queries'` sigue funcionando
- Se puede dividir un archivo en 10 sin tocar ningún import
- TypeScript resuelve `queries/` folder → `queries/index.ts` automáticamente

### 8.5 La IA como orquestador (tool calling)

En lugar de lógica hardcodeada para interpretar comandos del usuario, usamos el **tool calling** de OpenAI:

```
Usuario: "Estudié matemáticas 30 minutos"
  → La IA decide llamar a register_habit(habit_type: "study", description: "matemáticas", duration: 30)
    → El backend ejecuta saveHabit() en SQLite
      → La IA recibe confirmación y responde al usuario
```

Esto hace que el sistema sea flexible: podemos agregar tools sin cambiar la interfaz de chat.

---

## 9. Hoja de Referencia Rápida

### Desarrollo local

```bash
# Terminal 1 — Backend
cd "Proyecto Edubrain/backend"
npx tsx src/index.ts

# Terminal 2 — Frontend
cd "Proyecto Edubrain"
npx expo start

# Escanear QR con Expo Go
```

### Despliegue

```bash
# Subir a GitHub
git add .
git commit -m "mensaje"
git push

# Render despliega automáticamente (si está conectado)
```

### Build APK

```bash
eas login
eas build --platform android --profile preview
```

### Verificar backend

```bash
curl http://localhost:3001/api/health
# → {"status":"ok"}
```

### Agregar variable de entorno

```bash
eas secret:create --name NOMBRE --value VALOR
```

---

> **Documento generado el 2 de junio de 2026.** Para preguntas o mejoras, contacta al equipo de desarrollo.
