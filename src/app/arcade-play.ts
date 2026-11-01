import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Controls, Game, TICK } from './arcade-game';

// The playable space shooter, opened from the 1UP button. Arrow keys (or A and D) move, space fires;
// on touch screens there are on-screen buttons instead. The high score stays in this browser.

const WIDTH = 224;
const HEIGHT = 256;
const HI_KEY = 'arcade-hi-score';

const KEYS: Record<string, keyof Controls> = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Space: 'fire',
  ArrowUp: 'fire',
  KeyW: 'fire',
};

@Component({
  selector: 'app-arcade-play',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'arcade-play',
    '(document:keydown)': 'key($event, true)',
    '(document:keyup)': 'key($event, false)',
  },
  template: `
    <div class="cabinet-hud">
      <span>SCORE <b>{{ pad(score()) }}</b></span>
      <span>HI <b>{{ pad(hi()) }}</b></span>
      <span>WAVE <b>{{ wave() }}</b></span>
      <button type="button" class="cabinet-quit" aria-label="Close the game" (click)="quit.emit()">✕</button>
    </div>
    <div class="cabinet-screen">
      <canvas #screen tabindex="0" aria-label="Game screen. Arrow keys move, space fires."></canvas>
      @if (over()) {
        <div class="cabinet-message" role="status">
          <p>GAME OVER</p>
          <p class="small">press fire to play again</p>
        </div>
      }
    </div>
    <div class="cabinet-hud">
      <span [attr.aria-label]="lives() + ' lives left'">LIVES <b>{{ '▲'.repeat(lives()) || '-' }}</b></span>
      <span class="cabinet-keys">← → move · space fire · esc quit</span>
    </div>
    <div class="cabinet-pad">
      <button type="button" aria-label="Move left" (pointerdown)="hold('left', true)" (pointerup)="hold('left', false)"
        (pointerleave)="hold('left', false)" (pointercancel)="hold('left', false)">◀</button>
      <button type="button" aria-label="Move right" (pointerdown)="hold('right', true)" (pointerup)="hold('right', false)"
        (pointerleave)="hold('right', false)" (pointercancel)="hold('right', false)">▶</button>
      <button type="button" class="pad-fire" aria-label="Fire" (pointerdown)="hold('fire', true)" (pointerup)="hold('fire', false)"
        (pointerleave)="hold('fire', false)" (pointercancel)="hold('fire', false)">FIRE</button>
    </div>
  `,
})
export class ArcadePlay {
  readonly quit = output();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('screen');
  private readonly controls: Controls = { left: false, right: false, fire: false };
  protected readonly score = signal(0);
  protected readonly hi = signal(readHi());
  protected readonly wave = signal(1);
  protected readonly lives = signal(0);
  protected readonly over = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const canvas = this.canvas().nativeElement;
      const game = new Game(canvas, {
        size: () => ({ w: WIDTH, h: HEIGHT }),
        ground: () => HEIGHT,
        ceiling: () => 0,
        formationTop: () => 24,
        controls: this.controls,
        report: (status) => {
          this.score.set(status.score);
          this.wave.set(status.wave);
          this.lives.set(status.lives);
          this.over.set(status.over);
          if (status.score > this.hi()) {
            this.hi.set(status.score);
            saveHi(status.score);
          }
        },
      });
      canvas.focus();
      let frame = 0;
      let last = performance.now();
      let carry = 0;
      const loop = (now: number) => {
        carry = Math.min(carry + now - last, 250);
        last = now;
        while (carry >= TICK) {
          game.update();
          carry -= TICK;
        }
        game.draw();
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
      destroyRef.onDestroy(() => cancelAnimationFrame(frame));
    });
  }

  protected key(event: KeyboardEvent, down: boolean) {
    const control = KEYS[event.code];
    if (!control) return;
    event.preventDefault();
    this.controls[control] = down;
  }

  protected hold(control: keyof Controls, down: boolean) {
    this.controls[control] = down;
  }

  protected pad(n: number) {
    return String(n).padStart(5, '0');
  }
}

function readHi(): number {
  try {
    return Number(localStorage.getItem(HI_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveHi(score: number) {
  try {
    localStorage.setItem(HI_KEY, String(score));
  } catch {
    // Private windows can refuse storage; the high score just won't stick.
  }
}
