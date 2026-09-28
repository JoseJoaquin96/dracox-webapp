# Forge · Training OS

Primera versión de una aplicación personal para planificar y registrar entrenamientos de gimnasio.

## Incluye

- Dashboard de hoy con próxima sesión, volumen, tiempo y racha.
- CRUD de rutinas con varios días y persistencia remota en Supabase.
- Caché local por usuario y cola de series pendientes si falla temporalmente la conexión.
- Inicio de entrenamiento, registro de peso/repeticiones/series y temporizador de descanso.
- Historial real de sesiones y panel de progreso.
- Biblioteca de ejercicios con búsqueda, filtros por grupo muscular y ejercicios personalizados.
- Registro de errores y panel protegido para administradores.
- Responsive mobile-first y manifest PWA.

## Arranque

```bash
npm install
npm start
```

Después abre `http://localhost:4200`.

### Supabase local

La configuración real no se guarda en el repositorio. Copia
`src/assets/supabase-config.example.json` como
`src/assets/supabase-config.json` y completa la Project URL y la Publishable
Key desde Supabase > Project Settings > API Keys. El archivo real está
ignorado por Git.

Aplica las migraciones de `supabase/migrations` en orden. La guía completa,
incluido el alta del administrador y las comprobaciones RLS, está en
[`supabase/SETUP.md`](supabase/SETUP.md).

En GitHub Pages, crea los secretos del repositorio `SUPABASE_URL` y
`SUPABASE_PUBLISHABLE_KEY`; el workflow genera el archivo durante el build.
Nunca uses la `service_role` o una secret key en Angular.

## Demo publicada

La versión desplegada está disponible en
[josejoaquin96.github.io/dracox-webapp](https://josejoaquin96.github.io/dracox-webapp/).

## Decisiones técnicas

- Angular 21 con componentes standalone y rutas lazy.
- Signals para el estado de la aplicación.
- Supabase gestiona autenticación y persistencia de rutinas y entrenamientos.
- `WorkoutStore` mantiene una caché local por usuario para tolerar cortes breves de red.
- Las políticas RLS limitan los datos de cada usuario y los logs al panel administrador.

El flujo de autenticación sigue siendo deliberadamente mínimo: el usuario debe
existir previamente en Supabase. El registro y la recuperación de contraseña
quedan para una iteración posterior.
