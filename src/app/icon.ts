import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// Line icons on a 24×24 grid, drawn with currentColor.
const PATHS: Record<string, string[]> = {
  antenna: ['M12 22 12 9', 'M8 22l4-13 4 13', 'M9 17h6', 'M8.5 5.5a5 5 0 0 1 7 0', 'M6 3a8.5 8.5 0 0 1 12 0', 'M12 7a1 1 0 1 0 0 2 1 1 0 1 0 0-2'],
  arrow: ['M5 12h14', 'm12 5 7 7-7 7'],
  briefcase: [
    'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
    'M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
  ],
  close: ['M18 6 6 18', 'm6 6 12 12'],
  code: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
  external: ['M15 3h6v6', 'M10 14 21 3', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'],
  facebook: ['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'],
  github: [
    'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
    'M9 18c-4.51 2-5-2-7-2',
  ],
  graduation: ['M22 10 12 5 2 10l10 5 10-5z', 'M6 12v5c3 3 9 3 12 0v-5'],
  linkedin: [
    'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z',
    'M2 9h4v12H2z',
    'M4 2a2 2 0 1 0 0 4 2 2 0 1 0 0-4',
  ],
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 6-10 7L2 6'],
  map: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z', 'M12 7a3 3 0 1 0 0 6 3 3 0 1 0 0-6'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  music: ['M9 18V5l12-2v13', 'M6 15a3 3 0 1 0 0 6 3 3 0 1 0 0-6', 'M18 13a3 3 0 1 0 0 6 3 3 0 1 0 0-6'],
  paw: [
    'M12 13c-3 0-6 3.5-6 6 0 1.5 1.2 2 2.5 2 1.4 0 2.3-.8 3.5-.8s2.1.8 3.5.8c1.3 0 2.5-.5 2.5-2 0-2.5-3-6-6-6z',
    'M9 4a2 2 0 1 0 0 4 2 2 0 1 0 0-4',
    'M15 4a2 2 0 1 0 0 4 2 2 0 1 0 0-4',
    'M4.5 9a2 2 0 1 0 0 4 2 2 0 1 0 0-4',
    'M19.5 9a2 2 0 1 0 0 4 2 2 0 1 0 0-4',
  ],
  radio: [
    'M4.9 19.1C1 15.2 1 8.8 4.9 4.9',
    'M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5',
    'M12 10a2 2 0 1 0 0 4 2 2 0 1 0 0-4',
    'M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5',
    'M19.1 4.9C23 8.8 23 15.1 19.1 19',
  ],
  tent: ['M3.5 21 12 4l8.5 17', 'M2 21h20', 'M12 21l-3-6h6z', 'M12 4 10 1', 'M12 4l2-3'],
  terminal: ['m4 17 6-6-6-6', 'M12 19h8'],
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    @for (d of paths(); track $index) {
      <path [attr.d]="d" />
    }
  </svg>`,
  host: { class: 'icon' },
})
export class Icon {
  readonly name = input.required<string>();
  protected readonly paths = computed(() => PATHS[this.name()] ?? []);
}
