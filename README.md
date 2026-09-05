# Forge · Training OS

Primera versión de una aplicación personal para planificar y registrar entrenamientos de gimnasio.

## Incluye

- Dashboard de hoy con próxima sesión, volumen, tiempo y racha.
- CRUD básico de rutinas con persistencia local.
- Editor de rutinas con añadir, quitar, configurar y reordenar ejercicios.
- Constructor de rutinas en dos pasos: primero datos generales y después ejercicios, sin pesos.
- Inicio de entrenamiento desde una rutina.
- Registro de peso, repeticiones y series completadas.
- Temporizador visual de descanso.
- Historial real de sesiones y panel de progreso calculado desde los datos locales.
- Biblioteca de ejercicios y creación de ejercicios personalizados.
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
Key desde Supabase > Project Settings > API Keys. El archivo real está ignorado
por Git.

En GitHub Pages, crea los secretos del repositorio `SUPABASE_URL` y
`SUPABASE_PUBLISHABLE_KEY`; el workflow genera el archivo durante el build.
Nunca uses la `service_role` o una secret key en Angular.

## Demo publicada

La versión desplegada está disponible en [josejoaquin96.github.io/dracox-webapp](https://josejoaquin96.github.io/dracox-webapp/).

## Decisiones técnicas

- Angular 21 con componentes standalone y rutas lazy.
- Signals para el estado de la aplicación.
- Supabase gestiona la autenticación y la persistencia de rutinas y entrenamientos.
- `WorkoutStore` mantiene la integración remota y un fallback local para desarrollo.
- Las políticas RLS limitan los datos de cada usuario y las claves privadas nunca llegan al cliente.

## Próximo bloque recomendado

El siguiente paso es ampliar el registro de entrenamientos y añadir validaciones y funcionalidades avanzadas de rutina.
