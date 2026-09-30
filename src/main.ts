import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { loadSupabaseConfig } from './app/core/supabase';

loadSupabaseConfig().finally(() => {
  bootstrapApplication(AppComponent, appConfig).catch((error: unknown) => console.error(error));
});
