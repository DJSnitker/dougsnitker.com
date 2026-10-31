import { ChangeDetectionStrategy, Component } from '@angular/core';

// The DS logo: pixel letters, a ball and a paddle on a green monochrome screen.
// Drawn in public/logo.svg, which is also the favicon.
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<img src="logo.svg" alt="DS" width="64" height="64" />`,
  host: { class: 'logo' },
})
export class Logo {}
