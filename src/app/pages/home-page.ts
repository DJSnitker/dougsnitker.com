import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LOCATION, PROFILE_PHOTO, STATS, TAGLINE } from '../content';
import { CrtPhoto } from '../crt-photo';
import { Icon } from '../icon';
import { Logo } from '../logo';

@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CrtPhoto, Icon, Logo, RouterLink],
  template: `
    <section class="hero">
      <div class="wrap hero-inner">
        <div class="hero-copy">
          <p class="eyebrow"><app-icon name="map" /> {{ location }}</p>
          <h1>Hi, I'm <span class="accent">Doug Snitker.</span></h1>
          <p class="lede">{{ tagline }}</p>
          <div class="actions">
            <a class="button" routerLink="/work">See my work <app-icon name="arrow" /></a>
            <a class="button ghost" routerLink="/about">See my bio</a>
            <a class="button ghost" routerLink="/contact">Get in touch</a>
          </div>
        </div>
        <div class="hero-art">
          <app-logo />
          <app-crt-photo
            [name]="profile.name"
            [alt]="profile.alt"
            [caption]="profile.caption"
            [position]="profile.position ?? 'center'"
            ratio="1 / 1"
            priority
          />
        </div>
      </div>
    </section>

    <section class="band">
      <div class="wrap stats">
        @for (stat of stats; track stat.label) {
          <div class="stat">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        }
      </div>
    </section>
  `,
})
export class HomePage {
  protected readonly location = LOCATION;
  protected readonly tagline = TAGLINE;
  protected readonly profile = PROFILE_PHOTO;
  protected readonly stats = STATS;
}
