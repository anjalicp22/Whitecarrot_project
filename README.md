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
   - Once a recruiter selects a company, they can create or edit that company’s career page.

   - There are 3 tabs in this page – Branding, Content, and Jobs.

   - In Branding recruiter can make each company have its own color scheme and branding, allowing their career page to reflect their unique identity.

   - In the content recruiter can add sections that need to be visible in the Career page. Drag and drop allows users to easily rearrange sections in the editor.

   - In jobs recruiter can add job openings either from a list and edit, or can add details from scratch, which helps recruiters post, manage, and organize job listings efficiently.

   - Preview option is available that takes the recruiter directly to the created career page, can navigate back and edit if needed.

3. ### Career Pages:
   - If you’re a candidate, select a company they will be directed to professionally designed and fully responsive company pages that highlight job openings and added sections.

4. ### Real-time Updates:
   - Changes made in the editor are shown instantly with live previews and auto-saving, so recruiters can see updates as they work.

## Technical Architecture

- Frontend: React 18 along with TypeScript.

- Styling: Uses Tailwind CSS, allowing easy and responsive design in various screen sizes.

- Backend: Powered by Supabase, which offers a PostgreSQL database.

- State Management: Uses React Hooks for managing local state efficiently.

- Routing: Implemented with React Router for smooth client-side navigation between pages.

- Build System: Uses Vite, which makes development faster and production builds more optimized.

- Deploy: In render to create a live website.

## Improvement Plan

**Authentication System**: Implement a proper user authentication system using Supabase Auth to make sure users can log in and sign up securely.

**Sign-Up Page (Recruiter or Candidate Selection)**:

- Create a sign-up page where users can choose whether they are a recruiter or a candidate.
- If a recruiter signs up, they will be allowed to create a career page with more advanced options such as drag-and-drop features and a live preview panel to make the process easier.
- If a candidate signs up, they will see a page with options to search for companies, apply filters, and go directly to the selected company’s career page.

**Recruiter Company Validation**: During sign-up, recruiters should be able to select their company and validate it. Once they log in, they will only be able to edit and manage only their own company’s information.

**Separate Logins for Recruiter and Candidate**: Implement different login systems for recruiters and candidates to keep their workflows separate and organized.

**User Dashboard**: Build seperate dashboards for both recruiters and candidates to help them easily manage their activities on the platform.

**Email Notifications**: Set up automated email notifications to alert recruiters about new applications or important updates.

**Advanced Editor**: Improve the career page editor by adding more customization options to make each company’s page more unique and engaging.

**Job Application Page**: Create a complete job application page where candidates can apply using a traditional application form. Include a feature to validate their LinkedIn profile for authenticity.

**Automated AI Email for Recruiters**: When a candidate applies, send an automated email to the company. This email will include an AI-generated summary highlighting how well the candidate fits the job role, making it easier for recruiters to evaluate applicants quickly.

**Improve the app’s performance**: using lazy loading, and caching techniques to make pages load faster and run smoother.

**Multi-language Support**: Add support for multiple languages to make the platform accessible to users from different regions.

**Testing**: Implement proper unit test and integration tests to maintain code reliability and stability.

**Error Handling**: Improve error handling with detailed error boundaries and proper logging to make debugging easier and improve user experience.
