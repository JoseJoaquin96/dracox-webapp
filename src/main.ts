import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { loadSupabaseConfig } from './app/supabase.client';

loadSupabaseConfig().finally(() => {
  bootstrapApplication(AppComponent, {
    providers: [provideRouter(routes)]
  }).catch((error: unknown) => console.error(error));
});
