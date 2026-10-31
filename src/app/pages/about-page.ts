import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EDUCATION,
  FAMILY_INTRO,
  FAMILY_PHOTOS,
  FULL_NAME,
  INTERESTS,
  INTRO,
  LOCATION,
  PACK_PHOTOS,
} from '../content';
import { CrtPhoto } from '../crt-photo';
import { Icon } from '../icon';

@Component({
  selector: 'app-about-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CrtPhoto, Icon, RouterLink],
  template: `
    <section class="page-head">
      <div class="wrap">
        <p class="eyebrow">About</p>
        <h1>The person behind the <span class="accent">keyboard.</span></h1>
      </div>
    </section>

    <section class="section">
      <div class="wrap two-col">
        <aside class="facts">
          <dl>
            <dt>Name</dt>
            <dd>{{ fullName }}</dd>
            <dt>Home</dt>
            <dd>{{ location }}</dd>
            <dt>Studied</dt>
            <dd>{{ education.degree }}, {{ education.school }}</dd>
            <dt>Company</dt>
            <dd>Dallionz Media LLC</dd>
          </dl>
        </aside>
        <div class="prose">
          @for (p of intro; track $index) {
            <p>{{ p }}</p>
          }
          <p>
            When I'm not at work I'm usually building something for the fun of it. Most of those
            side projects end up on my
            <a routerLink="/projects">projects page</a>.
          </p>
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="wrap">
        <p class="eyebrow">Family</p>
        <h2>The crew</h2>
        <p class="muted">{{ familyIntro }} Hover over or tap a photo to see it in colour.</p>
        <div class="grid three">
          @for (photo of familyPhotos; track photo.name) {
            <app-crt-photo [name]="photo.name" [alt]="photo.alt" [caption]="photo.caption" [position]="photo.position ?? 'center'" />
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <p class="eyebrow">The pack</p>
        <h2>Jessie, Loki, Vader and Jedi</h2>
        <div class="grid four">
          @for (photo of packPhotos; track photo.name) {
            <app-crt-photo
              [name]="photo.name"
              [alt]="photo.alt"
              [caption]="photo.caption"
              [position]="photo.position ?? 'center'"
              ratio="3 / 4"
            />
          }
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="wrap">
        <p class="eyebrow">Interests</p>
        <h2>What keeps me busy</h2>
        <div class="grid two">
          @for (item of interests; track item.title) {
            <div class="card row">
              <span class="card-icon"><app-icon [name]="item.icon" /></span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.text }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class AboutPage {
  protected readonly fullName = FULL_NAME;
  protected readonly location = LOCATION;
  protected readonly education = EDUCATION;
  protected readonly intro = INTRO;
  protected readonly interests = INTERESTS;
  protected readonly familyIntro = FAMILY_INTRO;
  protected readonly familyPhotos = FAMILY_PHOTOS;
  protected readonly packPhotos = PACK_PHOTOS;
}
