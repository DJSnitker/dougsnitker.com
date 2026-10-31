import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EDUCATION, LINKS, ROLES, SKILLS } from '../content';
import { Icon } from '../icon';

@Component({
  selector: 'app-work-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="page-head">
      <div class="wrap">
        <p class="eyebrow">Work</p>
        <h1>Twenty-five years of <span class="accent">shipping software.</span></h1>
        <p class="lede">
          The short version is below. The full history is on
          <a [href]="links.linkedin" target="_blank" rel="noopener">LinkedIn</a>.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="wrap two-col">
        <div>
          <p class="eyebrow"><app-icon name="briefcase" /> Experience</p>
        </div>
        <ol class="timeline">
          @for (role of roles; track role.title) {
            <li>
              <span class="period">{{ role.period }}</span>
              <h3>{{ role.title }}</h3>
              <p class="org">{{ role.org }}</p>
              <p>{{ role.summary }}</p>
            </li>
          }
        </ol>
      </div>
    </section>

    <section class="section alt">
      <div class="wrap">
        <p class="eyebrow"><app-icon name="code" /> Skills</p>
        <h2>Tools I reach for</h2>
        <div class="grid four">
          @for (group of skills; track group.group) {
            <div class="card">
              <h3>{{ group.group }}</h3>
              <ul class="chips">
                @for (item of group.items; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap two-col">
        <div>
          <p class="eyebrow"><app-icon name="graduation" /> Education</p>
        </div>
        <div class="card row">
          <span class="card-icon"><app-icon name="graduation" /></span>
          <div>
            <h3>{{ education.degree }}</h3>
            <p>{{ education.school }} · {{ education.year }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class WorkPage {
  protected readonly roles = ROLES;
  protected readonly skills = SKILLS;
  protected readonly education = EDUCATION;
  protected readonly links = LINKS;
}
