import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMAIL, LINKS, LOCATION } from '../content';
import { Icon } from '../icon';

@Component({
  selector: 'app-contact-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="page-head">
      <div class="wrap">
        <p class="eyebrow">Contact</p>
        <h1>Let's <span class="accent">talk.</span></h1>
        <p class="lede">
          Questions about a project, work through Dallionz Media, or just saying hello. Email is the
          quickest way to reach me.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="wrap grid two">
        @for (c of channels; track c.label) {
          <a class="card contact" [href]="c.url" [attr.target]="c.external ? '_blank' : null" rel="noopener">
            <span class="card-icon"><app-icon [name]="c.icon" /></span>
            <div>
              <h3>{{ c.label }}</h3>
              <p>{{ c.detail }}</p>
            </div>
            <app-icon class="go" name="arrow" />
          </a>
        }
      </div>
      <p class="wrap muted center"><app-icon name="map" /> Based in {{ location }}</p>
    </section>
  `,
})
export class ContactPage {
  protected readonly location = LOCATION;
  protected readonly channels = [
    { icon: 'mail', label: 'Email', detail: EMAIL, url: 'mailto:' + EMAIL, external: false },
    { icon: 'linkedin', label: 'LinkedIn', detail: 'in/doug-snitker', url: LINKS.linkedin, external: true },
    { icon: 'github', label: 'GitHub', detail: 'DJSnitker', url: LINKS.github, external: true },
    { icon: 'facebook', label: 'Facebook', detail: 'doug.fourbirds', url: LINKS.facebook, external: true },
  ];
}
