import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { loadSupabaseConfig } from './app/core/supabase';

loadSupabaseConfig().finally(() => {
  bootstrapApplication(AppComponent, appConfig).catch((error: unknown) => console.error(error));
});

// Skipped on localhost so development always serves fresh files.
if ('serviceWorker' in navigator && !['localhost', '127.0.0.1'].includes(location.hostname)) {
  void navigator.serviceWorker.register(new URL('sw.js', document.baseURI));
}
