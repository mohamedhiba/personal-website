export const PORTFOLIO_STORAGE_KEY = 'mohamed-hiba-portfolio-content-v1'

export type NavLink = {
  label: string
  href: string
}

export type LinkItem = {
  label: string
  href: string
}

export type FactItem = {
  label: string
  value: string
}

export type SignalItem = {
  value: string
  label: string
  detail: string
}

export type ProjectMetric = {
  label: string
  value: string
}

export type ProjectEntry = {
  id: string
  year: string
  kind: string
  name: string
  summary: string
  outcome: string
  why: string
  stackLine: string
  metrics: ProjectMetric[]
  links: LinkItem[]
}

export type TextColumn = {
  id: string
  heading: string
  body: string
}

export type ExperienceEntry = {
  id: string
  period: string
  role: string
  org: string
  location: string
  summary: string
  bullets: string[]
}

export type CustomSection = {
  id: string
  title: string
  intro: string
  paragraphs: string[]
  links: LinkItem[]
}

export type PortfolioContent = {
  siteName: string
  siteRole: string
  heroEyebrow: string
  heroHeadline: string
  heroParagraphs: string[]
  heroFacts: FactItem[]
  utilityLinks: LinkItem[]
  signalLines: SignalItem[]
  projectsIntro: string
  projectEntries: ProjectEntry[]
  practiceIntro: string
  practiceNotes: string[]
  toolColumns: TextColumn[]
  customSections: CustomSection[]
  experienceIntro: string
  experienceEntries: ExperienceEntry[]
  contactHeadline: string
  contactNote: string
  contactDetails: string[]
  extraLinks: LinkItem[]
}

export const defaultPortfolioContent: PortfolioContent = {
  siteName: 'Mohamed Hiba',
  siteRole: 'ML / AI / Deep Learning Engineer',
  heroEyebrow: 'New York City / CCNY 4+1 / Computer Engineering',
  heroHeadline: 'Machine learning systems that make it out of the notebook.',
  heroParagraphs: [
    'I build machine learning systems that can be trained, evaluated, deployed, and used. The part I enjoy most is closing the gap between a promising model and something stable enough for real input, public demos, or product use.',
    'Recent work spans real-time computer vision, language modeling, deployment infrastructure, and productivity software. The common thread is practical AI with visible outcomes, not just interesting experiments.',
  ],
  heroFacts: [
    { label: 'Track', value: 'CCNY accelerated 4+1 in Computer Engineering' },
    { label: 'GPA', value: '3.81' },
    { label: 'Base', value: 'New York City' },
    {
      label: 'Open to',
      value: 'ML, AI, and research-heavy engineering roles',
    },
  ],
  utilityLinks: [
    { label: 'Resume PDF', href: '/mohamed-hiba-resume.pdf' },
    { label: 'GitHub', href: 'https://github.com/mohamedhiba' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohamedhiba/' },
    { label: 'Email', href: 'mailto:mohamedehiba@gmail.com' },
  ],
  signalLines: [
    {
      value: '0.918',
      label: 'focusedAI macro-F1',
      detail:
        'MobileNetV3-Small attention classifier with calibration and live webcam deployment.',
    },
    {
      value: '250.66',
      label: 'LSTM test perplexity',
      detail:
        'Word-level next-word prediction model built from scratch on WikiText-2.',
    },
    {
      value: '90+',
      label: 'Lighthouse on core pages',
      detail:
        'Reached during internship work alongside a 35% reduction in First Contentful Paint.',
    },
    {
      value: '100+',
      label: 'student support sessions',
      detail:
        'Python and C++ teaching support through one-on-ones, mini-labs, and reviews.',
    },
  ],
  projectsIntro:
    'These are the projects that best show how I like to work: model first, yes, but also evaluation, deployment, and a clear path from code to use.',
  projectEntries: [
    {
      id: 'focusedai',
      year: '2025',
      kind: 'Real-time computer vision',
      name: 'focusedAI',
      summary:
        'A real-time attention-state classifier that predicts focused, neutral, or distracted states from webcam input.',
      outcome:
        'Reached 0.918 macro-F1 on validation and runs around 4 to 5 ms p95 per frame on an Apple M3 Pro.',
      why:
        'The interesting part is not only the model, but the deployment behavior: calibration, logit biasing, hysteresis, and a public Gradio demo on Hugging Face Spaces.',
      stackLine:
        'PyTorch / scikit-learn / OpenCV / Gradio / Hugging Face Spaces',
      metrics: [
        { label: 'Validation macro-F1', value: '0.918' },
        { label: 'Latency', value: '4 to 5 ms p95' },
        { label: 'Deployment', value: 'Public webcam demo' },
      ],
      links: [
        {
          label: 'Repository',
          href: 'https://github.com/mohamedhiba/focusedAI',
        },
        {
          label: 'Live demo',
          href: 'https://huggingface.co/spaces/Mohamedhiba/focusedAI-demo',
        },
        {
          label: 'Model',
          href: 'https://huggingface.co/Mohamedhiba/focusedAI-engage-v2',
        },
      ],
    },
    {
      id: 'lstm-keyboard-v2',
      year: '2025',
      kind: 'NLP and serving',
      name: 'LSTM Keyboard v2',
      summary:
        'A from-scratch word-level LSTM next-word prediction system trained on WikiText-2 and exposed through a FastAPI service.',
      outcome:
        'Achieved 250.66 test perplexity with 20.24% Top-1 and 39.37% Top-5 accuracy, then shipped as a Cloud Run service.',
      why:
        'This is useful evidence that Mohamed can own the whole stack: vocabulary, batching, model code, evaluation, export, API design, Docker, and hosted deployment.',
      stackLine: 'PyTorch / FastAPI / Docker / Cloud Run / Python',
      metrics: [
        { label: 'Test perplexity', value: '250.66' },
        { label: 'Top-1 / Top-5', value: '20.24% / 39.37%' },
        { label: 'Serving', value: 'Predict and generate endpoints' },
      ],
      links: [
        {
          label: 'Repository',
          href: 'https://github.com/mohamedhiba/lstm-keyboard-v2',
        },
        {
          label: 'Live API',
          href: 'https://lstm-keyboard-demo-743198811832.us-central1.run.app/',
        },
        {
          label: 'API docs',
          href: 'https://lstm-keyboard-demo-743198811832.us-central1.run.app/docs',
        },
      ],
    },
    {
      id: 'proof-provisional',
      year: '2026',
      kind: 'Product systems',
      name: 'Proof / provisional',
      summary:
        'A web-based execution accountability system around daily planning, focus sessions, persistence, and AI-assisted briefings.',
      outcome:
        'Built on a Next.js and Supabase foundation with onboarding, timezone-aware metrics, persistence routes, and hosted-AI fallback logic.',
      why:
        'It shows product instinct alongside model work: stateful systems, UX, long-lived workflows, and the discipline to keep shaping an idea into a usable product.',
      stackLine: 'Next.js / TypeScript / Supabase / provider fallbacks',
      metrics: [
        { label: 'Mode', value: 'MVP feature build' },
        { label: 'Architecture', value: 'Hosted AI plus local fallback' },
        { label: 'Live app', value: 'provisional-beta.vercel.app' },
      ],
      links: [
        {
          label: 'Repository',
          href: 'https://github.com/mohamedhiba/provisional',
        },
        { label: 'Live app', href: 'https://provisional-beta.vercel.app' },
      ],
    },
  ],
  practiceIntro:
    'The through-line in my work is simple: I want the model quality and the product quality to reinforce each other.',
  practiceNotes: [
    'I like ML work that survives real inputs. That means calibration, evaluation detail, latency awareness, usable interfaces, and deployment choices that make sense for the model rather than look impressive in isolation.',
    'A repeating theme in my work is focus, attention, and decision support. That is visible in focusedAI, the Toaido product demo from my resume, and the newer Proof project. I am interested in AI that helps people think and execute better.',
    'I am at my best in roles where I can move between research detail and engineering detail: understanding the model, checking the metrics, shaping the interface, and making the system reliable enough for other people to use.',
  ],
  toolColumns: [
    {
      id: 'core-stack',
      heading: 'Core stack',
      body:
        'Python, PyTorch, scikit-learn, FastAPI, Docker, TypeScript, SQL, Bash, and the day-to-day engineering habits needed to turn projects into maintainable systems.',
    },
    {
      id: 'ml-and-data',
      heading: 'ML and data',
      body:
        'Transformers, TensorFlow, Keras, OpenCV, NumPy, Pandas, TorchScript, and the evaluation workflows that sit around actual model work.',
    },
    {
      id: 'infra-and-product',
      heading: 'Infra and product',
      body:
        'GitHub Actions, Firebase, Cloud Run, Linux, basic AWS and GCP, plus enough frontend and product wiring to make the model visible to real users.',
    },
  ],
  customSections: [],
  experienceIntro:
    'The through-line is consistent: build things, explain them clearly, and keep tightening the system until it works better for the person using it.',
  experienceEntries: [
    {
      id: 'globetrotting',
      period: '2024 to 2025',
      role: 'Computer Science Intern',
      org: 'Globetrotting Dominicana LLC',
      location: 'Remote from New York, NY',
      summary:
        'Built responsive admin dashboard features with auth, REST integrations, Dockerized builds, and CI/CD automation.',
      bullets: [
        'Raised core pages to 90+ Lighthouse scores.',
        'Reduced First Contentful Paint by 35%.',
        'Worked with GitHub Actions and AWS/GCP-hosted workflows.',
      ],
    },
    {
      id: 'hunter-ta',
      period: '2024',
      role: 'Undergraduate Teaching Assistant',
      org: 'Hunter College, CSCI 127 / 135',
      location: 'New York, NY',
      summary:
        'Supported students in Python and C++ through office hours, mini-labs, debugging help, and review sessions.',
      bullets: [
        'Led more than 100 one-on-one support sessions.',
        'Created targeted practice to improve debugging and data-structure fluency.',
        'Resume estimate: +15 percentage-point A-rate improvement for supported cohorts.',
      ],
    },
    {
      id: 'ccny',
      period: 'Expected Summer 2027',
      role: 'B.E. Computer Engineering',
      org: 'The City College of New York',
      location: 'Accelerated 4+1 M.S. track',
      summary:
        'Recent coursework spans machine learning, deep learning, NLP, computer vision, advanced algorithms, probability, and architecture-heavy systems classes.',
      bullets: [
        'Current GPA: 3.81',
        'Interested in vision, NLP, deployment, and attention-aware systems.',
        'Looking for work where theory and product quality both matter.',
      ],
    },
  ],
  contactHeadline:
    'I’m looking for work where the model quality and the product quality both matter.',
  contactNote:
    'If you need someone who can train the model, evaluate it honestly, and keep going until the system is usable, I would love to talk.',
  contactDetails: [
    'Resume note: the Toaido iOS focus-tracking demo reached 98% signup completion, 99.7% crash-free sessions, and a 17% lift in average focus time.',
    'The easiest ways to reach me are email, GitHub, and LinkedIn.',
  ],
  extraLinks: [
    { label: 'fastcard', href: 'https://github.com/mohamedhiba/fastcard' },
    {
      label: 'discord-pomodoro-bot',
      href: 'https://github.com/mohamedhiba/discord-pomodoro-bot',
    },
    {
      label: 'csc211-final',
      href: 'https://github.com/mohamedhiba/csc211-final',
    },
    { label: 'hwpostudy', href: 'https://github.com/mohamedhiba/hwpostudy' },
  ],
}

export function cloneDefaultPortfolioContent() {
  return JSON.parse(JSON.stringify(defaultPortfolioContent)) as PortfolioContent
}

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function getNavLinks(content: PortfolioContent): NavLink[] {
  return [
    { label: 'Work', href: '#projects' },
    { label: 'Practice', href: '#practice' },
    ...content.customSections.map((section) => ({
      label: section.title,
      href: `#section-${section.id}`,
    })),
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ]
}
