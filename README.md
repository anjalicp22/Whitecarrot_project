# WhiteCarrot.i.o Project

## Features

## How To Run

- Node.js 18+ and npm
- Supabase account (for backend services)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd whitecarrot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Create 4 tables : career_pages, companies, jobs and page_sections.
3. Update .env file with the project URL and anon key.

### 4. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

## What You Built

1. ### Landing Page:

   o The landing page acts as the main entry point for users. Here, users can choose their role — either Recruiter or Candidate.
   o If you’re a recruiter, you can either select an existing company or create a new one. Only recruiters have the option to create a new company.
   o If you’re a candidate, you’ll be taken straight to the career page created by the recruiter. From there, you can browse open job positions, apply filters, and submit applications easily.

2. ### Company Editor:

   o Once a recruiter selects a company, they can create or edit that company’s career page.
   o There are 3 tabs in this page – Branding, Content, and Jobs.
   o In Branding recruiter can make each company have its own color scheme and branding, allowing their career page to reflect their unique identity.
   o In the content recruiter can add sections that need to be visible in the Career page. Drag and drop allows users to easily rearrange sections in the editor.
   o In jobs recruiter can add job openings either from a list and edit, or can add details from scratch, which helps recruiters post, manage, and organize job listings efficiently.
   o Preview option is available that takes the recruiter directly to the created career page, can navigate back and edit if needed.

3. ### Career Pages:

   o If you’re a candidate, select a company they will be directed to professionally designed and fully responsive company pages that highlight job openings and added sections.

4. ### Real-time Updates:

   o Changes made in the editor are shown instantly with live previews and auto-saving, so recruiters can see updates as they work.

## Technical Architecture

• Frontend: React 18 along with TypeScript.
• Styling: Uses Tailwind CSS, allowing easy and responsive design in various screen sizes.
• Backend: Powered by Supabase, which offers a PostgreSQL database.
• State Management: Uses React Hooks for managing local state efficiently.
• Routing: Implemented with React Router for smooth client-side navigation between pages.
• Build System: Uses Vite, which makes development faster and production builds more optimized.
• Deploy: In render to create a live website.
