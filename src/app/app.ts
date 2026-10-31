import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Arcade } from './arcade';
import { EMAIL, LINKS, LOCATION, MOTTO, NAME } from './content';
import { Icon } from './icon';
import { Logo } from './logo';

const SITE_URL = 'https://dougsnitker.com';

// The frame around every page: header, the page, footer.
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Arcade, Icon, Logo, NgTemplateOutlet, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  protected readonly name = NAME;
  protected readonly motto = MOTTO;
  protected readonly location = LOCATION;
  protected readonly year = new Date().getFullYear();

  protected readonly nav = [
    { link: '/about', label: 'About' },
    { link: '/work', label: 'Work' },
    { link: '/projects', label: 'Projects' },
    { link: '/contact', label: 'Contact' },
  ];

  // Shown in both the header and the footer.
  protected readonly socials = [
    { href: 'mailto:' + EMAIL, label: 'Email', icon: 'mail', external: false },
    { href: LINKS.linkedin, label: 'LinkedIn', icon: 'linkedin', external: true },
    { href: LINKS.github, label: 'GitHub', icon: 'github', external: true },
    { href: LINKS.facebook, label: 'Facebook', icon: 'facebook', external: true },
  ];

  protected readonly menuOpen = signal(false);

  constructor() {
    const router = inject(Router);
    const route = inject(ActivatedRoute);
    const meta = inject(Meta);
    // Each page's description and address, for search results and link previews.
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        this.menuOpen.set(false);
        let page = route.snapshot;
        while (page.firstChild) page = page.firstChild;
        const description: string = page.data['description'] ?? '';
        meta.updateTag({ name: 'description', content: description });
        meta.updateTag({ property: 'og:description', content: description });
        meta.updateTag({ property: 'og:title', content: page.title ?? NAME });
        meta.updateTag({ property: 'og:url', content: SITE_URL + e.urlAfterRedirects.replace(/\/$/, '') + '/' });
      });
  }
}
