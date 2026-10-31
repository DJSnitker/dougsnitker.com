import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CrtLook = 'phosphor' | 'dither' | 'ascii';

// A photo shown on a little green screen. The green versions are made by tools/crt-photos.py.
// Hovering or focusing the screen fades in the original colour photo (turn off with [reveal]="false").
@Component({
  selector: 'app-crt-photo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="crt-screen" [class]="look()" [style.aspect-ratio]="ratio()" [attr.tabindex]="reveal() ? 0 : null">
      <img [src]="src()" [alt]="alt()" [attr.loading]="priority() ? 'eager' : 'lazy'" [attr.fetchpriority]="priority() ? 'high' : null" [style.object-position]="position()" />
      @if (reveal()) {
        <img class="original" [src]="original()" alt="" loading="lazy" [style.object-position]="position()" />
      }
    </div>
    @if (caption()) {
      <figcaption>{{ caption() }}</figcaption>
    }
  `,
  host: { class: 'crt-photo', role: 'figure' },
})
export class CrtPhoto {
  /** The photo's file name in photos/, without the extension. */
  readonly name = input.required<string>();
  readonly alt = input.required<string>();
  readonly caption = input('');
  readonly look = input<CrtLook>('dither');
  readonly ratio = input('4 / 3');
  readonly position = input('center');
  readonly reveal = input(true, { transform: booleanAttribute });
  /** Load straight away, for a photo at the top of the page. */
  readonly priority = input(false, { transform: booleanAttribute });

  protected readonly src = computed(
    () => `/photos/crt/${this.name()}-${this.look()}.${this.look() === 'phosphor' ? 'jpg' : 'png'}`,
  );
  protected readonly original = computed(() => `/photos/${this.name()}.jpg`);
}
