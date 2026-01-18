# WhiteCarrot.i.o Project

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

## Step-by-Step User Guide

### For Recruiters

#### 1. Getting Started

1. **Access the Platform**: Visit the application URL and select "Recruiter" on the landing page
2. **Choose Company**: Select an existing company from the dropdown or create a new one
3. **Navigate to Editor**: Click "Continue" to access the company editor

#### 2. Setting Up Your Company Profile

1. **Basic Information**: Enter your company name (auto-generates URL slug)
2. **Brand Colors**: Choose primary and secondary colors for your theme
3. **Visual Assets**:
   - Upload company logo (recommended: 200x200px, PNG/SVG)
   - Add banner image (recommended: 1200x400px)
   - Include culture video URL (YouTube embed supported)

#### 3. Building Content Sections

1. **Add Sections**: Click "Add Section" to create new content blocks
2. **Example Content Types**:
   - **About**: Company mission, values, and story
   - **Benefits**: Employee perks and advantages
   - **Culture**: Work environment and company life
   - **Custom**: Any additional information
3. **Edit Content**: Click "Edit" on any section to modify title and content
4. **Reorder Sections**: Drag and drop sections to rearrange their order

#### 4. Managing Job Postings

1. **Access Jobs Tab**: Switch to the "Jobs" tab in the editor
2. **Create Jobs**: Click "Add Job" to create new positions or use existing ones
3. **Job Details**:
   - Title, location, employment type
   - Detailed description and requirements
   - Save to make jobs visible on your career page
4. **Manage Existing Jobs**: Edit or delete jobs as needed

#### 5. Preview and Publish

1. **Live Preview**: Click "Preview" to see your career page
2. **Save Changes**: Click "Save" to persist all modifications

### For Candidates

#### 1. Finding Companies

1. **Access Platform**: Visit the application and select "Candidate"
2. **Browse Companies**: Choose from available companies in the dropdown
3. **View Career Page**: Click "Continue" to explore the company's page

#### 2. Exploring Company Information

1. **Company Overview**: Read about the company's mission, values etc

#### 3. Finding Job Opportunities

1. **View Open Positions**: Scroll to the "Open Positions" section or click on "View open jobs"
2. **Use Filters**:
   - Search by keywords in job titles
   - Filter by location
   - Filter by employment type (Full-time, Part-time, etc.)
3. **Job Details**: Click "View job" on any position to see full details

#### 4. Applying for Jobs

1. **Review Requirements**: Read job description and requirements carefully
2. **Apply**: Click "Apply Now" button (opens application form : not implemented yet)
