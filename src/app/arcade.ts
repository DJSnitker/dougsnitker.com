import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Game, TICK } from './arcade-game';
import { ArcadePlay } from './arcade-play';

// The page background: a dim, self-playing space shooter, like an arcade cabinet in attract mode.
// Visitors who prefer reduced motion get a single still frame. The blinking 1UP button opens a
// playable version in a dialog, and the background pauses while it is open.

const PIXEL = 3; // CSS pixels per game pixel

@Component({
  selector: 'app-arcade',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArcadePlay],
  template: `
    <canvas #screen class="arcade-screen" aria-hidden="true"></canvas>
    <button type="button" class="one-up" aria-label="Play the space shooter game" (click)="play()">1UP</button>
    <dialog #cabinet class="cabinet" aria-label="Space shooter game" (close)="playing.set(false)">
      @if (playing()) {
        <app-arcade-play (quit)="cabinet.close()" />
      }
    </dialog>
  `,
})
export class Arcade {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('screen');
  private readonly cabinet = viewChild.required<ElementRef<HTMLDialogElement>>('cabinet');
  protected readonly playing = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      // The ship's ground is the top of the footer, or the bottom of the screen until the footer scrolls into view.
      const footer = document.querySelector('.site-footer');
      const header = document.querySelector('.site-header');
      const game = new Game(this.canvas().nativeElement, {
        size: () => ({ w: Math.ceil(innerWidth / PIXEL), h: Math.ceil(innerHeight / PIXEL) }),
        ground: () => Math.floor(Math.min(innerHeight, footer?.getBoundingClientRect().top ?? innerHeight) / PIXEL),
        // The moon tucks under the bottom of the site header.
        ceiling: () => Math.ceil((header?.getBoundingClientRect().bottom ?? 0) / PIXEL),
        // Clear of the site header, and on phones below the page title too.
        formationTop: (w) => (w * PIXEL < 600 ? 80 : 30),
      });
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let frame = 0;
      let last = performance.now();
      let carry = 0;
      const loop = (now: number) => {
        carry = Math.min(carry + now - last, 250);
        last = now;
        if (!this.playing()) {
          while (carry >= TICK) {
            game.update();
            carry -= TICK;
          }
          game.draw();
        }
        frame = requestAnimationFrame(loop);
      };
      const resize = () => {
        game.resize();
        if (still) game.draw();
      };
      const scroll = () => still && game.draw();
      window.addEventListener('resize', resize);
      window.addEventListener('scroll', scroll, { passive: true });
      if (still) game.draw();
      else frame = requestAnimationFrame(loop);
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
        window.removeEventListener('scroll', scroll);
      });
    });
  }

  protected play() {
    this.cabinet().nativeElement.showModal();
    this.playing.set(true);
  }
}
