<div align="center">

# 🎓 EduQuest

<p>
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-2.45-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" />
</p>
<p>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/Version-1.0.0-green.svg" alt="Version" />
</p>

**An interactive educational platform for Egyptian students** — curriculum-aligned games for grades 1–12.

**منصة تعليمية تفاعلية للطلاب المصريين** — ألعاب تعليمية متوافقة مع المنهج الدراسي من الصف الأول إلى الثالث الثانوي.

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Screenshots](#-screenshots)
- [Database Schema](#-database-schema)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **🎮 36+ Educational Games** — Interactive quizzes and puzzles across 6 subjects
- **📚 Aligned with Egyptian Curriculum** — Matches the Ministry of Education standards
- **🎯 12 School Grades** — Complete coverage from Primary through Secondary
- **🌟 Star Rating System** — Students earn 1–3 stars based on performance
- **📊 Progress Tracking** — Score tracking and achievement monitoring
- ** 3 School Stages** — Primary (أبتدائي), Preparatory (إعدادي), Secondary (ثانوي)
- **📝 6 Subjects** — Math, Arabic, Science, English, Geography, History
- ** Authentication** — Secure login and registration with Supabase Auth
- **📱 Fully Responsive** — Works beautifully on mobile, tablet, and desktop
- **🎨 Beautiful UI** — Child-friendly design with smooth animations

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3 + Custom Animations |
| **Routing** | React Router v6 |
| **State Management** | Zustand |
| **Icons** | Lucide React |
| **Backend** | Supabase (Auth + Database) |
| **Fonts** | Righteous (display), Nunito (body), Tajawal (Arabic) |

---

## 📁 Project Structure

```
eduquest/
├──  CLAUDE.md                    # Project documentation for AI assistants
├── 📄 package.json
├── 📄 vite.config.ts               # Vite + path aliases
├── 📄 tsconfig.json
├── 📄 tailwind.config.js           # Custom theme, animations, fonts
├──  .env.example                 # Environment variables template
├──  README.md
│
├── 📁 public/
│   └── vite.svg
│
├── 📁 .github/
│   └── ISSUE_TEMPLATE/             # GitHub issue templates
│
└── 📁 src/
    ├── 📄 main.tsx                 # Application entry point
    ├── 📄 App.tsx                  # Router configuration
    ├── 📄 index.css                # Tailwind + custom styles
    │
    ├── 📁 types/
    │   └── index.ts                # TypeScript interfaces
    │
    ├── 📁 data/
    │   ├── grades.ts               # 12 Egyptian grades (Arabic + English)
    │   └── games.ts                # 36 games across all grades
    │
    ├── 📁 lib/
    │   └── supabase.ts             # Supabase client configuration
    │
    ├── 📁 store/
    │   ├── authStore.ts            # Authentication state (Zustand)
    │   └── gameStore.ts            # Game state + progress tracking
    │
    ├── 📁 hooks/
    │   └── useToast.ts             # Toast notification hook
    │
    ├── 📁 components/
    │   ├── 📁 ui/                  # Reusable UI primitives
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx            # Card + GameCard
    │   │   ├── Input.tsx
    │   │   ├── Toast.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── 📁 layout/              # Layout components
    │   │   ├── Navbar.tsx
    │   │   └── Footer.tsx
    │   └──  games/               # Game-specific components
    │
    └──  pages/
        ├── Landing.tsx             # Landing page
        ├── Login.tsx               # Login form
        ├── Register.tsx            # Registration with grade picker
        ├── Dashboard.tsx           # Student dashboard
        ├── GradePage.tsx           # Grade detail page
        └── GamePage.tsx            # Interactive quiz game
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) >= 9.x
- A [Supabase](https://supabase.com/) project (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/EduQuest.git
   cd EduQuest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Fill in your Supabase credentials**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Run Locally

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 📸 Screenshots

> 🚧 Coming soon — screenshots of the landing page, dashboard, and gameplay will be added here.

| Landing Page | Registration | Dashboard |
|:---:|:---:|:---:|
| *Landing page with hero and stage cards* | *Registration with grade picker* | *Student dashboard with stats* |
| *Screenshot* | *Screenshot* | *Screenshot* |

| Grade Games | Game Play | Results |
|:---:|:---:|:---:|
| *Games by subject* | *Quiz in action* | *Score with stars* |
| *Screenshot* | *Screenshot* | *Screenshot* |

---

## 🗄️ Database Schema

The app uses Supabase with the following tables:

### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Student name |
| email | text | Email (unique) |
| grade_id | int | FK to grades |
| created_at | timestamptz | Account creation date |

### `grades`
| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key (1-12) |
| name_ar | text | Arabic name |
| name_en | text | English name |
| stage | text | primary/preparatory/secondary |
| order | int | Grade order |

### `games`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Game title |
| description | text | Game description |
| subject | text | Subject (math, arabic, etc.) |
| grade_id | int | FK to grades |
| difficulty | text | easy/medium/hard |
| thumbnail_url | text | Thumbnail image URL |

### `user_progress`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to users |
| game_id | uuid | FK to games |
| score | int | Score achieved |
| stars | int | Star rating (0-3) |
| completed_at | timestamptz | Completion timestamp |

---

## 🛣️ Roadmap

- [ ] **Full Supabase Integration** — Real authentication and database sync
- [ ] **Arabic RTL Support Toggle** — Switch between Arabic RTL and English LTR layouts
- [ ] **More Interactive Games** — Drag & drop, matching cards, word puzzles
- [ ] **Leaderboards** — Global and grade-specific rankings
- [ ] **Achievements & Badges** — Gamified reward system
- [ ] **Progress Analytics** — Charts and insights on student progress
- [ ] **Dark Mode** — Toggle between light and dark themes
- [ ] **Offline Support** — PWA for offline game access
- [ ] **Parent Dashboard** — Monitor child's progress
- [ ] **Teacher Mode** — Create and assign custom games

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create a feature branch**
   ```bash
   git checkout -b feat/amazing-feature
   ```
3. **Commit your changes** (use [Conventional Commits](https://www.conventionalcommits.org/))
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push to your branch**
   ```bash
   git push origin feat/amazing-feature
   ```
5. **Open a Pull Request**

### Commit Message Convention

| Type | Description |
|------|------------|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation only changes |
| `style:` | Formatting, missing semi colons, etc. |
| `refactor:` | Code restructuring |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks |

> 💡 **Branch Protection Recommended**: Enable branch protection rules on `main` to require pull request reviews before merging.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it in your own projects. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for Egyptian students everywhere**

If you find this project helpful, please give it a ⭐!

</div>
