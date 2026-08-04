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

## Demo publicada

La versión desplegada está disponible en [josejoaquin96.github.io/dracox-webapp](https://josejoaquin96.github.io/dracox-webapp/).

## Decisiones técnicas

- Angular 21 con componentes standalone y rutas lazy.
- Signals para el estado de la aplicación.
- Persistencia temporal con `localStorage` para esta primera iteración: rutinas, ejercicios, sesión activa e historial.
- La lógica de datos vive en `WorkoutStore`, preparada para extraerse después a una capa `Repository` y conectar Supabase.
- No hay autenticación ni backend todavía.

## Próximo bloque recomendado

El siguiente paso es añadir superseries, calentamientos y distintos tipos de serie, y después migrar la persistencia a IndexedDB antes de conectar Supabase.
