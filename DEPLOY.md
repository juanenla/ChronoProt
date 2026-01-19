# Guía de Despliegue (ChronoPro)

## 1. Supabase (Base de Datos)

1. Crear proyecto en [supabase.com](https://supabase.com).
2. Ir a **SQL Editor** y ejecutar el contenido de `supabase/migrations/001_initial_schema.sql`.
3. (Opcional) Ejecutar `supabase/seed.sql` para crear usuario admin inicial.
4. Ir a **Project Settings > API** y copiar:
   - Project URL
   - `anon` public key
   - `service_role` secret key (¡Cuidado! Esta llave da acceso total)

## 2. Vercel (Despliegue Web)

1. Ir a [vercel.com](https://vercel.com) e importar repositorio de GitHub `ChronoProt`.
2. En **Environment Variables**, agregar:
   - `NEXT_PUBLIC_SUPABASE_URL`: (Tu Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Tu llave anon)
   - `SUPABASE_SERVICE_ROLE_KEY`: (Tu llave service_role)
3. Click "Deploy".

## 3. Verificación

- Visita la URL del proyecto en Vercel.
- Completa el formulario y verifica que genera resultados.
- Ve a `/admin/login` e intenta ingresar (necesitarás configurar SMTP en Supabase para emails reales, o ver el log de autenticación en Supabase Auth).
