import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { ADVENTURE } from './content';

interface Line {
  command: string;
  reply: string;
}

// A tiny text adventure: type a command, get a reply from content.ts.
@Component({
  selector: 'app-adventure',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="adventure" (click)="focus()">
      <div class="adventure-bar">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        <span class="adventure-title">nerdvana.z5</span>
      </div>
      <div class="adventure-screen" #screen>
        <p class="muted">THE SEARCH FOR NERDVANA: an interactive biography. Type <b>help</b>.</p>
        @for (line of lines(); track $index) {
          <p><span class="prompt">&gt;</span> {{ line.command }}</p>
          <p class="reply">{{ line.reply }}</p>
        }
        <form (submit)="run($event, input.value); input.value = ''">
          <label class="prompt" for="adventure-input">&gt;</label>
          <input #input id="adventure-input" autocomplete="off" spellcheck="false" aria-label="Command" placeholder="look" />
        </form>
      </div>
    </div>
  `,
})
export class Adventure {
  protected readonly lines = signal<Line[]>([]);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly screen = viewChild.required<ElementRef<HTMLElement>>('screen');

  protected run(event: Event, raw: string) {
    event.preventDefault();
    const command = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!command) return;
    const reply = ADVENTURE[command] ?? "I don't know how to do that. Try 'help'.";
    this.lines.update((lines) => [...lines.slice(-5), { command, reply }]);
    queueMicrotask(() => {
      const el = this.screen().nativeElement;
      el.scrollTop = el.scrollHeight;
    });
  }

  protected focus() {
    this.input().nativeElement.focus({ preventScroll: true });
  }
}
