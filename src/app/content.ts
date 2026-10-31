// All of the site's copy lives here, so updating the site is mostly editing this file.

export const NAME = 'Doug Snitker';
export const FULL_NAME = 'Douglas J. Snitker';
export const EMAIL = 'dougsnitker@gmail.com';
export const LOCATION = 'Abilene, Texas';

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/doug-snitker/',
  facebook: 'https://www.facebook.com/doug.fourbirds',
  github: 'https://github.com/DJSnitker',
};

// Under the name in the header.
export const MOTTO = 'Developer, Builder, Tinkerer.';

export const TAGLINE =
  "Senior software developer. I build dependable systems, and the occasional thing that keeps working after the network goes down.";

export const INTRO = [
  "I'm Doug, a software developer in Abilene, out in West Texas, with more than twenty-five years of writing code for a living. I like the whole stack: services in Java and Spring, front ends in Angular and TypeScript, and the Python glue that holds the odd corner together.",
  'Through Dallionz Media LLC I take on my own projects and the occasional client. Lately that has meant off-grid radio, retro interactive fiction, and finding new ways to tell people what I do.',
];

export const STATS = [
  { value: '25+', label: 'years writing software' },
  { value: '2000', label: 'B.S. Computer Science' },
  { value: 'TX', label: 'West Texas based' },
];

export interface Role {
  title: string;
  org: string;
  period: string;
  summary: string;
}

// Newest first. Add LinkedIn roles here as { title, org, period, summary }.
export const ROLES: Role[] = [
  {
    title: 'Founder & Developer',
    org: 'Dallionz Media LLC',
    period: 'Present',
    summary:
      'My independent studio: software for clients and for myself, from Angular sites and Spring services to radio tooling and interactive fiction.',
  },
  {
    title: 'Senior Software Developer',
    org: 'Industry career',
    period: '2000 – present',
    summary:
      'More than two decades building and maintaining production systems: Java and Spring back ends, web front ends, automated testing, and the deployments that tie them together.',
  },
];

export const EDUCATION = {
  degree: 'Bachelor of Science, Computer Science',
  school: 'Angelo State University',
  year: '2000',
};

export const SKILLS: { group: string; items: string[] }[] = [
  { group: 'Back end', items: ['Java', 'Spring & Spring Boot', 'NestJS', 'Python', 'REST APIs'] },
  { group: 'Front end', items: ['Angular', 'TypeScript', 'SCSS', 'Server-side rendering', 'Accessibility'] },
  { group: 'Practice', items: ['Automated testing', 'Playwright & Vitest', 'Nx monorepos', 'CI/CD', 'Linux services'] },
  { group: 'Radio', items: ['MeshCore', 'LoRa mesh networks', 'Serial devices', 'Off-grid messaging'] },
];

export interface Project {
  name: string;
  kind: string;
  blurb: string;
  tags: string[];
  links: { label: string; url: string }[];
  /** Left off the site for now; drop the flag to show it again. */
  hidden?: boolean;
}

const ALL_PROJECTS: Project[] = [
  {
    name: 'Mesh Contingency',
    kind: 'Open source · Python, Angular',
    blurb:
      'A contingency link over MeshCore. Someone with nothing but a mesh radio can check the weather, check in, leave messages for others, or get an email out. It ships with a web console for running the node and an app for phones and computers.',
    tags: ['Python', 'MeshCore', 'Angular', 'Plugins'],
    links: [
      { label: 'Website', url: 'https://meshcontingency.com' },
      { label: 'Source', url: 'https://github.com/DJSnitker/mesh-contingency' },
    ],
  },
  {
    name: 'The Search for Nerdvana',
    kind: 'In progress · Angular, NestJS',
    blurb:
      'An interactive biography styled after the classic text adventures, played on a glowing CRT complete with typewriter clicks. You start west of my house, and there is a tattered resume nailed to the mailbox.',
    tags: ['Angular', 'NestJS', 'Web Audio', 'Nx'],
    links: [],
  },
  {
    name: 'MUD resume engine',
    kind: 'In progress · Java',
    blurb:
      'A Spring Boot game engine for a multi-user-dungeon take on the resume. It is the back end for the text adventure idea, built so that more than one visitor can explore at a time.',
    tags: ['Java', 'Spring Boot'],
    links: [],
    hidden: true,
  },
  {
    name: 'SpringResume',
    kind: 'Open source · Java',
    blurb:
      'An early experiment in the resume as an API: a Spring MVC service that answers questions about me through a command factory, with a small puzzle to solve along the way.',
    tags: ['Java', 'Spring MVC', 'JUnit'],
    links: [{ label: 'Source', url: 'https://github.com/DJSnitker/SpringResume' }],
    hidden: true,
  },
];

export const PROJECTS = ALL_PROJECTS.filter((project) => !project.hidden);

export const INTERESTS = [
  {
    icon: 'radio',
    title: 'Mesh radio',
    text: 'Small LoRa radios that pass messages to each other with no towers or internet. I build tools that make them useful when everything else is down.',
  },
  {
    icon: 'antenna',
    title: 'Amateur radio · KE5OWL',
    text: 'My go-box is an Icom IC-7000 in a hard case, with mounts I designed and 3D-printed, a switchable battery and a Digirig for digital modes. I bring handhelds and Winlink to local ARES and RACES exercises, and on camping trips.',
  },
  {
    icon: 'paw',
    title: 'German Shepherds',
    text: 'Loki has been with us since 2021, Vader came home as a puppy in 2024, and Jedi, the youngest, was already 55 pounds at eight months. Jessie, family since 2014, rounds out the pack. Vader even carries his own pack on the trail.',
  },
  {
    icon: 'music',
    title: 'Ukulele',
    text: 'Licensed Ukulele Operator. A friend hand-built me an electric concert-scale uke, and Iggy, my micro uke, wears a strap I braided and finished in leather myself.',
  },
  {
    icon: 'tent',
    title: 'Camping',
    text: 'We camp as a family in a travel trailer, and a radio usually comes along. I also teach camping and outdoor-skills classes that end the year with a campout.',
  },
  {
    icon: 'terminal',
    title: 'Interactive fiction',
    text: 'I grew up on Infocom-style text adventures, and I still think a blinking cursor and a good room description are hard to beat.',
  },
  {
    icon: 'map',
    title: 'West Texas life',
    text: 'Abilene is home: big skies, wide-open country, and a pace that leaves room for side projects.',
  },
  {
    icon: 'code',
    title: 'Clean, tested code',
    text: 'I like writing code other people can trust: clean tests, clear names, small pieces that each do one thing.',
  },
];

export interface Photo {
  /** File name in public/photos, without the extension (see tools/crt-photos.py). */
  name: string;
  alt: string;
  caption: string;
  /** CSS object-position, to keep the subject in frame when the photo is cropped. */
  position?: string;
}

// The kids appear in photos but are never named on the site.
export const PROFILE_PHOTO: Photo = {
  name: 'doug-puppy-vader',
  alt: 'Doug holding Vader as a puppy',
  caption: 'doug + vader',
  position: 'center 30%',
};

export const FAMILY_INTRO =
  "Melanie and I have a son and a daughter. Most of these are from our camping trip over Mother's Day weekend, 2026.";

export const FAMILY_PHOTOS: Photo[] = [
  { name: 'doug-melanie', alt: 'Doug and Melanie sharing a kiss', caption: 'doug + melanie', position: 'center 25%' },
  { name: 'family-camp-selfie', alt: 'The four of us together at camp', caption: 'the whole crew' },
  { name: 'son-splashpad', alt: 'Our son grinning at the splash pad', caption: 'splash pad', position: 'center 30%' },
  { name: 'daughter-chair', alt: 'Our daughter relaxing in a lawn chair', caption: 'taking it easy' },
  { name: 'doug-son-bench', alt: 'Doug and our son laughing on a bench', caption: 'dad + son' },
  { name: 'doug-daughter-selfie', alt: 'Doug and our daughter making peace signs', caption: 'dad + daughter' },
];

export const PACK_PHOTOS: Photo[] = [
  { name: 'vader-jedi', alt: 'Vader and Jedi lying side by side, heads tilted', caption: 'vader + jedi' },
  { name: 'loki-lab-costume', alt: 'Loki in a harness of potion bottles for Halloween', caption: 'loki, lab assistant', position: 'center 65%' },
  { name: 'jessie', alt: 'Jessie sitting and smiling at the camera', caption: 'jessie', position: 'center 40%' },
  { name: 'jedi-vet', alt: 'Jedi sitting at the vet with his tongue out', caption: 'jedi', position: 'center 35%' },
];

// The little text adventure on the home page: each command and its reply.
export const ADVENTURE: Record<string, string> = {
  look: "West of Doug's House. A red mailbox stands by the path. Obvious exits: east.",
  'open mailbox': 'Opening the mailbox reveals a tattered resume.',
  'read resume': '25+ years of software. Java, Spring, Angular, TypeScript, Python. B.S. Computer Science, Angelo State.',
  inventory: 'You are carrying: a MeshCore radio, a mechanical keyboard, an unreasonable number of side projects.',
  east: 'The door is locked, but a note says: "Try the Contact page."',
  help: 'Try: look, open mailbox, read resume, inventory, east.',
};
