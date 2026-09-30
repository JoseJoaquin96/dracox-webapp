import { ErrorHandler } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { AppErrorHandler } from './app/app-error-handler';
import { routes } from './app/app.routes';
import { loadSupabaseConfig } from './app/supabase.client';

loadSupabaseConfig().finally(() => {
  bootstrapApplication(AppComponent, {
    providers: [provideRouter(routes), { provide: ErrorHandler, useClass: AppErrorHandler }]
  }).catch((error: unknown) => console.error(error));
});
