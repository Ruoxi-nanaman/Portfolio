# RUO XI PORTFOLIO — Development Rules

Personal developer portfolio website for Jeru Emmanuel Pabutoy, also branded as "Ruo xi".

This is a long-term project. Maintainable architecture, code quality, security, performance,
and deployment readiness are priorities.

**Understand the project before making changes. Do not rush into implementation or assume
requirements that have not been established.**

---

## 1. TECH STACK

- React.js
- Vite
- JavaScript (ES6+)
- Tailwind CSS
- Motion for React (formerly Framer Motion)
- Lucide React (icons)
- Vercel (deployment)
- Vercel Serverless Functions (backend)
- Resend (contact form email delivery)
- GitHub (version control)

**Do NOT introduce Express.js, MongoDB, or another database without an explicitly approved
requirement.**

The portfolio is primarily a static website. Backend functionality must remain minimal and
only be introduced when necessary.

---

## 2. CORE DEVELOPMENT RULES

### 2.1 Inspect Before Modifying

Before implementing anything:

- Inspect the existing project structure.
- Read `package.json` and existing configuration files.
- Understand the installed dependencies.
- Identify existing components, styles, utilities, and architectural patterns.
- Check whether the project already has working configurations that can be reused.

Never assume the project is empty or that an existing implementation is incorrect without
inspecting it.

### 2.2 Preserve Existing Architecture

- Do not unnecessarily restructure the project.
- Do not replace existing libraries or dependencies without justification.
- Do not introduce duplicate components or utilities.
- Do not create multiple implementations of the same functionality.
- Follow established naming conventions and coding patterns.
- Keep components modular and reusable where appropriate.

### 2.3 Avoid Unrelated Modifications

Only modify files directly related to the requested task. Do not:

- Rewrite unrelated components.
- Change existing functionality without authorization.
- Rename components or classes unnecessarily.
- Remove working features to simplify implementation.
- Change the website's visual identity without approval.
- Install unnecessary dependencies.

If a requested implementation requires changes outside its intended scope, explain why before
proceeding.

### 2.4 Work in Stages

Implement the project incrementally. For every requested stage:

1. Inspect the relevant implementation.
2. Identify the required changes.
3. Explain the planned approach when architectural decisions are involved.
4. Implement only the approved scope.
5. Test the affected functionality.
6. Report the implementation results.

Do not automatically proceed to another stage. Wait for approval before expanding the scope.

### 2.5 No Assumptions

When a requirement is unclear:

- Identify what information is missing.
- Explain the possible approaches.
- Ask for clarification when the decision affects architecture or functionality.

Never fabricate functionality, data, project information, or implementation results.

---

## 3. FRONTEND ARCHITECTURE

Single-page, vertically scrollable portfolio. Main sections: Home, About, Projects, Contact.
Use reusable React components and keep individual sections organized.

### Component responsibilities

- `components/layout/` — Shared website layout components. Navbar and Footer.
- `components/ui/` — Reusable interface elements. Buttons, cards, headings, and other shared
  components.
- `sections/` — Main portfolio sections. Each section has a clearly defined responsibility.
- `data/` — Static project information and technical skills. Avoid hardcoding repeated project
  information throughout components.
- `hooks/` — Reusable React hooks for shared behavior, such as active-section detection.
- `lib/` — Shared utility functions.
- `styles/` — Global styles and shared visual definitions.

**Do not place the entire website inside `App.jsx`.** Keep `App.jsx` responsible for assembling
the main application structure.

---

## 4. BACKEND ARCHITECTURE

Backend uses Vercel Serverless Functions. Initial backend requirement is the contact form.

Planned endpoint: `POST /api/contact`

Responsibilities:

- Validate submitted name, email, and message.
- Reject invalid or incomplete submissions.
- Sanitize or safely handle user-provided content.
- Protect against spam submissions.
- Send email through Resend.
- Return appropriate HTTP status codes and responses.
- Handle delivery failures without exposing internal errors.

Security requirements:

- Never expose the Resend API key in frontend code.
- Store sensitive credentials in environment variables.
- Never commit `.env` files.
- Provide a `.env.example` containing variable names only.
- Do not trust frontend validation alone.
- Do not expose private server configuration in API responses.
- Implement appropriate spam protection and rate limiting before production deployment.

The visitor's email must be configured as the reply-to address so the portfolio owner can
respond directly.

Do not introduce database storage unless a future feature requires persistent data.

---

## 5. UI AND DESIGN RULES

The portfolio has an established Figma design. The implementation must respect the approved
design.

Visual identity:

- Dark charcoal and blue-black background.
- Soft blue ambient lighting.
- Minimal sparkling stars.
- Ethereal and celestial atmosphere.
- Elegant typography.
- Restrained use of glowing accents.
- Clean and spacious layouts.

The loading screen will feature a Columbina silhouette walking in place alongside a rotating
moon.

Important:

- Do not replace the intended visual design with a generic portfolio template.
- Do not add unnecessary visual elements.
- Do not make animations excessively distracting.
- Keep the website readable and professional.
- Use reusable styling patterns.
- Maintain consistency between all sections.

Any significant visual redesign must be explicitly requested.

---

## 6. PERFORMANCE AND ACCESSIBILITY

The website must remain lightweight and responsive.

- Optimize image assets.
- Avoid unnecessary re-renders.
- Lazy-load non-critical images where appropriate.
- Avoid excessive animation libraries or dependencies.
- Use efficient animation techniques.
- Respect `prefers-reduced-motion`.
- Use semantic HTML.
- Provide accessible labels for form inputs.
- Ensure keyboard accessibility.
- Maintain sufficient color contrast.
- Prevent layout shifts when loading images or animations.
- The loading screen must not unnecessarily delay access to the portfolio.

---

## 7. RESPONSIVE DESIGN

Support desktop, laptop, tablet, and mobile. Do not simply shrink the desktop layout. Adjust
navigation, typography, spacing, project cards, and section layouts appropriately for smaller
screens. Ensure animations and decorative elements do not negatively affect mobile performance.

---

## 8. CODE QUALITY

- Use descriptive variable and function names.
- Keep components focused.
- Avoid unnecessary code duplication.
- Avoid excessively large components.
- Handle loading, success, and error states.
- Use appropriate error handling.
- Avoid unnecessary dependencies.
- Do not leave unused code or imports.
- Do not use arbitrary timeouts to hide implementation problems.
- Do not fabricate successful API responses.

Do not sacrifice maintainability for shorter code.

---

## 9. TESTING AND VERIFICATION

Whenever implementation is requested:

- Run relevant tests.
- Check for lint errors if linting is configured.
- Verify the production build.
- Test affected functionality.
- Check responsive behavior when UI changes are involved.
- Verify API behavior when backend changes are involved.

Do not claim something has been tested if it has not actually been tested. Report any tests that
could not be executed and explain why.

---

## 10. DEPLOYMENT RULES

The project is intended for production deployment through Vercel. Keep the project compatible
with Vercel's deployment environment.

- Ensure the Vite production build works.
- Keep serverless functions in the appropriate root-level `api` directory.
- Use environment variables for production credentials.
- Never hardcode development or production secrets.
- Ensure frontend API requests work in the deployed environment.
- Do not assume localhost configurations will work in production.
- Document required environment variables.
- Avoid unnecessary server infrastructure.

---

## 11. REQUIRED IMPLEMENTATION REPORT

After every implementation stage, provide:

1. **Implementation Summary** — What was implemented.
2. **Files Created** — List newly created files and their purposes.
3. **Files Modified** — List modified files and explain each change.
4. **Architecture Decisions** — Explain important technical decisions.
5. **Testing and Verification** — Commands executed and their actual results.
6. **Known Issues** — Remaining problems, limitations, or incomplete work.
7. **Scope Confirmation** — Confirm whether unrelated files or functionality were modified.

Do not provide vague completion reports.

---

## 12. PROJECT STRUCTURE

The Git repository root (`c:\Systems\Portfolio`, remote
`https://github.com/Ruoxi-nanaman/Portfolio.git`, branch `main`) **is** the project root.
There is no nested `ruoxi-portfolio/` directory.

Proposed structure (to be materialized during project initialization):

```
Portfolio/                       # repo root = project root
├── api/
│   └── contact.js               # Vercel Serverless Function: POST /api/contact
├── public/
│   ├── images/
│   ├── animations/
│   │   └── columbina/           # loading-screen silhouette assets
│   ├── fonts/
│   └── favicon/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── ProjectCard.jsx
│   │       └── SectionHeading.jsx
│   ├── sections/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   └── Contact.jsx
│   ├── data/
│   │   ├── projects.js
│   │   └── skills.js
│   ├── hooks/
│   │   └── useActiveSection.js
│   ├── lib/
│   │   └── utils.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── tests/
├── .env.example
├── .gitignore
├── AGENTS.md
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

Folders are created only when they hold real files. No placeholder/empty files are committed.
