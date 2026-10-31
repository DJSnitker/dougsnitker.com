import { RenderMode, ServerRoute } from '@angular/ssr';

// Every page is prerendered to its own HTML file at build time.
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Prerender }];
