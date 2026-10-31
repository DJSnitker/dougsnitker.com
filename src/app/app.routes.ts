import { Routes } from '@angular/router';
import { AboutPage } from './pages/about-page';
import { ContactPage } from './pages/contact-page';
import { HomePage } from './pages/home-page';
import { ProjectsPage } from './pages/projects-page';
import { WorkPage } from './pages/work-page';

// Each page's description is used for the meta and link-preview tags.
export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Doug Snitker · Software developer in Abilene, Texas',
    data: {
      description:
        'Doug Snitker is a senior software developer in Abilene, Texas, building with Java, Spring, Angular and Python, and tinkering with mesh radio and interactive fiction.',
    },
  },
  {
    path: 'about',
    component: AboutPage,
    title: 'About · Doug Snitker',
    data: { description: 'Doug Snitker away from the keyboard: family, German Shepherds, ham radio, ukulele and camping in West Texas.' },
  },
  {
    path: 'work',
    component: WorkPage,
    title: 'Work · Doug Snitker',
    data: { description: "Doug Snitker's experience, skills and education as a software developer." },
  },
  {
    path: 'projects',
    component: ProjectsPage,
    title: 'Projects · Doug Snitker',
    data: { description: 'Mesh Contingency, The Search for Nerdvana and other projects by Doug Snitker.' },
  },
  {
    path: 'contact',
    component: ContactPage,
    title: 'Contact · Doug Snitker',
    data: { description: 'Get in touch with Doug Snitker by email, LinkedIn or GitHub.' },
  },
  { path: '**', redirectTo: '' },
];
