# ChronoPro - Professional Architecture

Aplicación full-stack de cronoterapia para optimización de suplementación en hipertrofia muscular.

## 🏗️ Arquitectura

- **Frontend:** Next.js 14 (App Router) + React + Tailwind CSS
- **Backend:** Next.js API Routes (Serverless Functions)
- **Database:** Supabase (PostgreSQL)
- **Engine:** Modelo Multiparamétrico **Secreto** (Solo servidor)

## 🚀 Características

- **Formulario Inteligente:** 7 pasos para perfilado profundo.
- **Motor de Recomendación:**
  - Matriz de timing por cronotipo (Mañana/Tarde/Noche)
  - Ajustes por dieta (Omnívoro, Vegano, Keto, etc.)
  - Ciencia cronobiológica (mTORC1, GH, Cortisol)
- **Resultados:** 10 secciones de análisis personalizado.
- **Admin Panel:** Dashboard con métricas y lista de respuestas.

## 🛠️ Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/juanenla/ChronoProt.git
   cd ChronoProt
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Copiar `.env.local.example` a `.env.local` y rellenar credenciales de Supabase.

4. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🔒 Modelo Secreto

El lógica de negocio sensible reside en `/src/lib/chrono-engine`. Este código:
1. **NUNCA** se envía al navegador del cliente.
2. Solo se ejecuta en el servidor via `/api/generate-plan`.

## 📦 Despliegue en Vercel

1. Importar proyecto desde GitHub.
2. Configurar variables de entorno en Vercel (`SUPABASE_URL`, etc.).
3. Deploy automático.

---

© 2026 ChronoPro Team
