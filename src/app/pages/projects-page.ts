import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LINKS, PROJECTS } from '../content';
import { Icon } from '../icon';

@Component({
  selector: 'app-projects-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <section class="page-head">
      <div class="wrap">
        <p class="eyebrow">Projects</p>
        <h1>Things I've <span class="accent">built.</span></h1>
        <p class="lede">
          Open-source tools, experiments and works in progress. More on
          <a [href]="links.github" target="_blank" rel="noopener">GitHub</a>.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="wrap grid two">
        @for (project of projects; track project.name) {
          <article class="card project">
            <p class="kind">{{ project.kind }}</p>
            <h2>{{ project.name }}</h2>
            <p>{{ project.blurb }}</p>
            <ul class="chips">
              @for (tag of project.tags; track tag) {
                <li>{{ tag }}</li>
              }
            </ul>
            @if (project.links.length) {
              <div class="links">
                @for (link of project.links; track link.url) {
                  <a [href]="link.url" target="_blank" rel="noopener">{{ link.label }} <app-icon name="external" /></a>
                }
              </div>
            }
          </article>
        }
      </div>
    </section>
  `,
})
export class ProjectsPage {
  protected readonly projects = PROJECTS;
  protected readonly links = LINKS;
}
