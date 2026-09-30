/** Error whose message is written for the user and can be shown as is. */
export class AppError extends Error {}

/** Error returned by Supabase (PostgREST / RPC). */
export class RemoteError extends Error {
  constructor(message: string, readonly code = '') {
    super(message);
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function isOffline(error: unknown): boolean {
  return !navigator.onLine || /failed to fetch|network|load failed/i.test(errorMessage(error));
}

export function toUserMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (isOffline(error)) return 'Sin conexión. Se muestran los últimos datos guardados.';
  if (error instanceof RemoteError && error.code === '42501') return 'No tienes permiso para realizar esta acción.';
  if (error instanceof RemoteError && error.code === '22023') return 'Los datos introducidos no son válidos.';
  return 'Ha ocurrido un error. Inténtalo de nuevo.';
}
