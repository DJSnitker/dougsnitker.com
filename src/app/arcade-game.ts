// The space shooter itself, shared by the self-playing page background (Arcade) and the
// playable version (ArcadePlay). Everything is in game pixels, scaled up with crisp edges.

export const TICK = 1000 / 60;
const GREEN = '#39ff6a';

// Sprites, '#' for a lit pixel. Two frames each for the marching animation.
const SPRITES = {
  orb: [
    ['..#####..', '.#.....#.', '#..###..#', '#..#.#..#', '#..###..#', '.#.....#.', '..#####..'],
    ['..#####..', '.#.....#.', '#.......#', '#...#...#', '#.......#', '.#.....#.', '..#####..'],
  ],
  drone: [
    ['...###...', '.#######.', '##.#.#.##', '#########', '.#.###.#.', '#.......#', '.#.....#.'],
    ['...###...', '.#######.', '##.#.#.##', '#########', '.#.###.#.', '.#.....#.', '#.......#'],
  ],
  probe: [
    ['#...#...#', '.#.###.#.', '..#####..', '###.#.###', '..#####..', '.#.....#.', '#.......#'],
    ['..#.#.#..', '#..###..#', '..#####..', '###.#.###', '..#####..', '#.......#', '.#.....#.'],
  ],
  ship: [['....#....', '...###...', '...#.#...', '.#######.', '##.###.##', '#..#.#..#']],
  burst: [['#..#.#..#', '.#.....#.', '..#.#.#..', '##.....##', '..#.#.#..', '.#.....#.', '#..#.#..#']],
};
type SpriteName = keyof typeof SPRITES;

const ROWS: SpriteName[] = ['orb', 'drone', 'drone', 'probe'];
const SPRITE_W = 9;
const SPRITE_H = 7;
const GAP_X = 14;
const GAP_Y = 12;
const POINTS = [30, 20, 20, 10]; // per row, top first
const LIVES = 3;

interface Alien {
  col: number;
  row: number;
  alive: boolean;
}

interface Shot {
  x: number;
  y: number;
  dy: number;
}

// Craters as [x, y, radius] on a unit disc, and the darker "seas" the same way.
const CRATERS = [
  [-0.35, -0.3, 0.16], [0.2, -0.45, 0.1], [0.3, 0.1, 0.2], [-0.1, 0.35, 0.12],
  [-0.55, 0.15, 0.08], [0.05, -0.05, 0.07], [0.5, -0.2, 0.06], [0.15, 0.6, 0.09],
];
const SEAS = [
  [-0.2, -0.1, 0.38], [0.25, 0.3, 0.3], [-0.45, 0.45, 0.22],
];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

interface Burst {
  x: number;
  y: number;
  ttl: number;
}

/** Where and how a game runs. */
export interface Stage {
  /** The screen size, in game pixels. */
  size(): { w: number; h: number };
  /** The y of the ship's ground line, in game pixels. */
  ground(): number;
  /** The y the moon is cut off at, in game pixels. */
  ceiling(): number;
  /** The y the alien formation starts at, for a given screen width. */
  formationTop(w: number): number;
  /** The player's controls. Without them the ship plays itself. */
  controls?: Controls;
  /** Called whenever the score, lives, wave or game-over state changes. */
  report?: (status: Status) => void;
}

export interface Controls {
  left: boolean;
  right: boolean;
  fire: boolean;
}

export interface Status {
  score: number;
  lives: number;
  wave: number;
  over: boolean;
}

export class Game {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly sprites = new Map<string, HTMLCanvasElement>();
  private w = 0;
  private h = 0;
  private cols = 0;
  private aliens: Alien[] = [];
  private fx = 0; // formation position
  private fy = 0;
  private dir = 1;
  private stepClock = 0;
  private animFrame = 0;
  private shipX = 0;
  private shipY = 0;
  private shipDead = 0; // ticks until the ship respawns
  private targetX = 0;
  private shot: Shot | null = null;
  private bombs: Shot[] = [];
  private bursts: Burst[] = [];
  private stars: { x: number; y: number; phase: number }[] = [];
  private moon = { image: null as HTMLCanvasElement | null, x: 0, y: 0, top: 0 };
  private ticks = 0;
  private waveDelay = 0;
  private score = 0;
  private lives = LIVES;
  private wave = 1;
  private over = 0; // ticks since the game ended, 0 while playing
  private fireWasDown = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly stage: Stage,
  ) {
    this.ctx = canvas.getContext('2d')!;
    for (const [name, frames] of Object.entries(SPRITES)) {
      frames.forEach((rows, i) => this.sprites.set(`${name}${i}`, bitmap(rows)));
    }
    this.resize();
    this.report();
  }

  private get playing() {
    return this.stage.controls !== undefined;
  }

  private report() {
    this.stage.report?.({ score: this.score, lives: this.lives, wave: this.wave, over: this.over > 0 });
  }

  restart() {
    this.score = 0;
    this.lives = LIVES;
    this.wave = 1;
    this.over = 0;
    this.shipDead = 0;
    this.shipX = this.w / 2;
    this.waveDelay = 0;
    this.newWave();
    this.report();
  }

  private loseLife() {
    this.bursts.push({ x: this.shipX - SPRITE_W / 2, y: this.shipY, ttl: 30 });
    this.shipDead = 120;
    if (this.playing) {
      this.lives--;
      if (this.lives === 0) this.over = 1;
      this.report();
    }
  }

  resize() {
    const { w, h } = this.stage.size();
    const sameWidth = w === this.w;
    this.w = w;
    this.h = h;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    // Phones change only the height as the address bar slides away while scrolling; keep playing.
    if (sameWidth) return;
    this.cols = Math.max(4, Math.min(10, Math.floor((this.w - 40) / GAP_X)));
    // A big moon in the top right, its faded top cut off at the ceiling.
    const r = Math.round(Math.min(this.h * 0.22, this.w * 0.35));
    const top = this.stage.ceiling();
    this.moon = { image: moonBitmap(r), x: Math.round(this.w - r * 1.3), y: top - Math.round(r * 0.45), top };
    const mx = this.moon.x + r;
    const my = this.moon.y + r;
    this.stars = Array.from({ length: Math.round((this.w * this.h) / 900) }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      phase: Math.random() * Math.PI * 2,
    })).filter((star) => Math.hypot(star.x - mx, star.y - my) > r + 1);
    this.shipX = this.w / 2;
    this.newWave();
  }

  // Rests the ship on its ground, but never higher than halfway up so the aliens keep their room.
  private placeShip() {
    const ground = Math.max(this.h * 0.5, this.stage.ground() - 2);
    this.shipY = Math.min(this.h - 2, ground) - 7;
  }

  private newWave() {
    this.aliens = [];
    for (let row = 0; row < ROWS.length; row++) {
      for (let col = 0; col < this.cols; col++) this.aliens.push({ col, row, alive: true });
    }
    this.fx = (this.w - (this.cols - 1) * GAP_X - SPRITE_W) / 2;
    // When playing, each wave starts a little lower.
    this.fy = this.stage.formationTop(this.w) + (this.playing ? Math.min(16, (this.wave - 1) * 4) : 0);
    this.dir = 1;
    this.shot = null;
    this.bombs = [];
  }

  private alienPos(a: Alien) {
    return { x: this.fx + a.col * GAP_X, y: this.fy + a.row * GAP_Y };
  }

  update() {
    this.ticks++;
    this.placeShip();
    this.bursts = this.bursts.filter((b) => --b.ttl > 0);

    if (this.waveDelay > 0) {
      if (--this.waveDelay === 0) this.newWave();
      return;
    }

    const alive = this.aliens.filter((a) => a.alive);
    if (alive.length === 0) {
      this.waveDelay = 90;
      if (this.playing && !this.over) {
        this.wave++;
        this.report();
      }
      return;
    }

    // After a game over, fire starts a new game (once the player has had a moment to see it).
    const fire = this.stage.controls?.fire ?? false;
    const pressed = fire && !this.fireWasDown;
    this.fireWasDown = fire;
    if (this.over) {
      this.over++;
      if (pressed && this.over > 60) return this.restart();
    }

    // The formation steps faster as it thins out.
    if (++this.stepClock >= 4 + Math.round((alive.length / this.aliens.length) * 22)) {
      this.stepClock = 0;
      this.animFrame ^= 1;
      const xs = alive.map((a) => this.alienPos(a).x);
      const edge = this.dir > 0 ? Math.max(...xs) + SPRITE_W + 2 >= this.w - 4 : Math.min(...xs) - 2 <= 4;
      if (edge) {
        this.dir = -this.dir;
        this.fy += 4;
      } else {
        this.fx += 2 * this.dir;
      }
      const lowest = Math.max(...alive.map((a) => this.alienPos(a).y)) + SPRITE_H;
      if (lowest >= this.shipY - 6) {
        // Landed: in the demo that just starts a new wave, but in a real game it is game over.
        if (this.playing && !this.over) {
          this.bursts.push({ x: this.shipX - SPRITE_W / 2, y: this.shipY, ttl: 30 });
          this.lives = 0;
          this.over = 1;
          this.report();
        }
        this.waveDelay = 60;
        return;
      }
    }

    const controls = this.stage.controls;
    if (this.shipDead > 0 || this.over) {
      if (!this.over) this.shipDead--;
    } else if (controls) {
      const move = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
      this.shipX = Math.max(5, Math.min(this.w - 5, this.shipX + move * 1.5));
      if (!this.shot && controls.fire) this.shot = { x: Math.round(this.shipX), y: this.shipY - 2, dy: -3 };
    } else {
      // The demo ship lines up under an alien, fires, then picks a new target.
      if (this.ticks % 50 === 0 || Math.abs(this.shipX - this.targetX) < 1) {
        const pick = alive[Math.floor(Math.random() * alive.length)];
        this.targetX = this.alienPos(pick).x + SPRITE_W / 2;
      }
      this.shipX += Math.sign(this.targetX - this.shipX) * Math.min(0.9, Math.abs(this.targetX - this.shipX));
      const lined = alive.some((a) => Math.abs(this.alienPos(a).x + SPRITE_W / 2 - this.shipX) < 3);
      if (!this.shot && lined) this.shot = { x: Math.round(this.shipX), y: this.shipY - 2, dy: -3 };
    }

    if (this.shot) {
      this.shot.y += this.shot.dy;
      const hit = alive.find((a) => {
        const p = this.alienPos(a);
        return this.shot!.x >= p.x && this.shot!.x < p.x + SPRITE_W && this.shot!.y >= p.y && this.shot!.y < p.y + SPRITE_H;
      });
      if (hit) {
        hit.alive = false;
        if (this.playing && !this.over) {
          this.score += POINTS[hit.row];
          this.report();
        }
        const p = this.alienPos(hit);
        this.bursts.push({ x: p.x, y: p.y, ttl: 14 });
        this.shot = null;
      } else if (this.shot.y < 0) {
        this.shot = null;
      }
    }

    // Now and then the lowest alien in a column drops a bomb, more often in later waves.
    const every = this.playing ? Math.max(18, 45 - (this.wave - 1) * 5) : 45;
    const most = this.playing ? Math.min(6, 2 + this.wave) : 3;
    if (this.ticks % every === 0 && this.bombs.length < most) {
      const col = alive[Math.floor(Math.random() * alive.length)].col;
      const bottom = alive.filter((a) => a.col === col).sort((a, b) => b.row - a.row)[0];
      const p = this.alienPos(bottom);
      this.bombs.push({ x: p.x + SPRITE_W / 2, y: p.y + SPRITE_H, dy: 1.2 });
    }
    for (const b of this.bombs) b.y += b.dy;
    const hitShip =
      this.shipDead === 0 &&
      !this.over &&
      this.bombs.find((b) => Math.abs(b.x - this.shipX) < 5 && b.y >= this.shipY && b.y < this.shipY + 6);
    if (hitShip) {
      this.loseLife();
      if (!this.playing) this.shipX = this.w / 2;
    }
    this.bombs = this.bombs.filter((b) => b !== hitShip && b.y < this.shipY + 7);
  }

  draw() {
    const { ctx, w, h } = this;
    this.placeShip();
    ctx.clearRect(0, 0, w, h);

    for (const s of this.stars) {
      ctx.globalAlpha = 0.25 + 0.35 * Math.sin(s.phase + this.ticks / 40);
      ctx.fillStyle = GREEN;
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1);
    }
    if (this.moon.image) {
      // Fainter in the real game, where it isn't already dimmed with the page background.
      ctx.globalAlpha = this.playing ? 0.18 : 0.55;
      const { image, x, y, top } = this.moon;
      ctx.drawImage(image, 0, top - y, image.width, image.height - (top - y), x, top, image.width, image.height - (top - y));
    }
    ctx.globalAlpha = 1;

    if (this.waveDelay === 0 || this.aliens.some((a) => a.alive)) {
      for (const a of this.aliens) {
        if (!a.alive) continue;
        const p = this.alienPos(a);
        ctx.drawImage(this.sprites.get(`${ROWS[a.row]}${this.animFrame}`)!, Math.round(p.x), Math.round(p.y));
      }
    }
    for (const b of this.bursts) ctx.drawImage(this.sprites.get('burst0')!, Math.round(b.x), Math.round(b.y));
    // A respawning player ship blinks for its last second.
    const blinking = this.playing && this.shipDead > 0 && this.shipDead < 60 && (this.ticks >> 3) % 2 === 0;
    if ((this.shipDead === 0 || blinking) && !this.over) ctx.drawImage(this.sprites.get('ship0')!, Math.round(this.shipX - SPRITE_W / 2), this.shipY);

    ctx.fillStyle = GREEN;
    if (this.shot) ctx.fillRect(this.shot.x, Math.round(this.shot.y), 1, 3);
    for (const b of this.bombs) ctx.fillRect(Math.round(b.x), Math.round(b.y), 1, 2 + (this.ticks >> 3) % 2);

    // The ground line under the ship.
    for (let x = 0; x < w; x += 3) ctx.fillRect(x, this.shipY + 7, 2, 1);
  }
}

function bitmap(rows: string[]): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = rows[0].length;
  c.height = rows.length;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = GREEN;
  rows.forEach((row, y) => [...row].forEach((ch, x) => ch === '#' && ctx.fillRect(x, y, 1, 1)));
  return c;
}

// A moon lit from the lower left, shaded with an ordered dither like the photos.
function moonBitmap(r: number): HTMLCanvasElement {
  const size = r * 2 + 1;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = GREEN;
  const light = [-0.7, -0.4, 0.6];
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const x = (px - r) / r;
      const y = (r - py) / r; // flipped, so the lit edge is at the bottom and the top fades out
      const d2 = x * x + y * y;
      if (d2 > 1) continue;
      const z = Math.sqrt(1 - d2);
      let b = Math.max(0, x * light[0] + y * light[1] + z * light[2]);
      for (const [sx, sy, sr] of SEAS) if (Math.hypot(x - sx, y - sy) < sr) b *= 0.7;
      for (const [cx, cy, cr] of CRATERS) {
        const d = Math.hypot(x - cx, y - cy);
        // A shadowed floor, with a bright rim on the side facing the light.
        if (d < cr) b *= 0.55;
        else if (d < cr * 1.25 && (x - cx) * light[0] + (y - cy) * light[1] > 0) b = Math.min(1, b * 1.4);
      }
      const edge = d2 > 0.93 && b > 0.05; // a thin lit limb
      if (edge || b > (BAYER[(py % 4) * 4 + (px % 4)] + 0.5) / 16) ctx.fillRect(px, py, 1, 1);
    }
  }
  return c;
}
