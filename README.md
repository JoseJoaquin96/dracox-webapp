# Dracox · Training OS

Primera versión de una aplicación personal para planificar y registrar entrenamientos de gimnasio.

## Incluye

- Dashboard de hoy con próxima sesión, volumen, tiempo y racha.
- CRUD de rutinas con varios días y persistencia remota en Supabase.
- Entrenamiento sin conexión: las series, las series nuevas y el final del entrenamiento se sincronizan al volver la red.
- Registro por tipo de ejercicio (peso, lastre, segundos o metros) y temporizador de descanso.
- Historial paginado y progreso con récords, 1RM estimado, volumen semanal y evolución por ejercicio.
- Biblioteca de ejercicios con búsqueda, filtros y ejercicios personalizados editables.
- Perfil con nombre editable.
- Registro de errores y panel protegido para administradores.
- Registro, login y recuperación de contraseña mediante email en Supabase.
- Responsive mobile-first e instalable como PWA (funciona sin conexión).

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

- Angular 21 con componentes standalone, rutas lazy y signals.
- Supabase gestiona autenticación y persistencia de rutinas y entrenamientos.
- La caché local por usuario permite abrir la app y registrar series sin conexión.
- Las políticas RLS limitan los datos de cada usuario y los logs al panel administrador.

### Estructura de `src/app`

| Carpeta | Contenido |
| --- | --- |
| `core/` | Supabase, autenticación y guards, errores, estado de sincronización y caché local. |
| `domain/` | Modelos y cálculos puros (volumen, rachas, récords…). |
| `data/` | Acceso a Supabase por dominio; traduce filas a modelos. |
| `state/` | Stores con signals (ejercicios, rutinas, historial, entrenamiento) y `DataSync`, que los carga al iniciar sesión. |
| `layout/` | Shell con navegación para las páginas autenticadas. |
| `features/` | Una carpeta por página, con su componente y su plantilla HTML. |
| `shared/` | Componentes y utilidades de formato reutilizables. |

El flujo de autenticación usa email y contraseña con confirmación por correo y
recuperación mediante enlace de un solo uso. Configura las URL de redirección
permitidas en Supabase antes de probarlo.
