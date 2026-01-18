# Tech Spec

## Assumptions

- **Target Users**: Primary users are recruiters (company representatives) who need to create and manage career pages. Secondary users are job candidates who browse and interact with these pages.

## Architecture

### High-Level Architecture

The application follows a client-server architecture:

- **Frontend (Client)**: Single-page application (SPA) built with React.
- **Backend (Server)**: Supabase provides the database layer, API endpoints, and data persistence.
- **Data Layer**: Switching between Supabase and localStorage.

### Frontend Architecture

- **Framework**: React 18 with hooks for state management (useState, useEffect).
- **TypeScript**: Strict typing for components, services, and data models.
- **Routing**: Declarative routing with React Router (e.g., `/company-slug/edit` for editing, `/company-slug/careers` for viewing).
- **State Management**: Local component state; no global state library (e.g., Redux) is used.
- **Services**: `storageService` handles all data operations, including CRUD for companies, sections, and jobs.
- **UI Components**: Reusable components like forms, buttons, and lists, styled with Tailwind CSS.
- **Build and Deployment**: Vite handles bundling, deployed in Render.

### Backend Architecture

- **Database**: Supabase PostgreSQL.
- **API**: RESTful APIs for data access.
- **Security**: Row-level security (RLS) in Supabase to control data access.

### Data Flow

1. **Landing Page**: Fetches list of companies from Supabase via `storageService.getCompanies()`.
2. **Edit Page**: Loads company data, allows editing of theme and sections, saves via `storageService.saveCompany()`.
3. **Careers Page**: Displays published company data, fetched via `storageService.getCompanyById()`.
4. **Fallback**: If Supabase fails, data falls back to localStorage for development.

## Database Schema

### Tables

#### `companies`

Stores company information and branding.

| Column            | Type         | Description                   | Constraints                 |
| ----------------- | ------------ | ----------------------------- | --------------------------- |
| id                | SERIAL       | Primary key                   | PRIMARY KEY, AUTO_INCREMENT |
| name              | VARCHAR(255) | Company name                  | NOT NULL                    |
| slug              | VARCHAR(255) | URL-friendly identifier       | UNIQUE, NOT NULL            |
| primary_color     | VARCHAR(7)   | Hex color for primary theme   | DEFAULT '#4F46E5'           |
| secondary_color   | VARCHAR(7)   | Hex color for secondary theme | DEFAULT '#111827'           |
| logo_url          | TEXT         | URL to company logo           |                             |
| banner_url        | TEXT         | URL to banner image           |                             |
| culture_video_url | TEXT         | URL to culture video          |                             |
| created_at        | TIMESTAMP    | Creation timestamp            | DEFAULT NOW()               |
| updated_at        | TIMESTAMP    | Last update timestamp         | DEFAULT NOW()               |

#### `page_sections`

Manages content sections for career pages.

| Column      | Type        | Description                                  | Constraints                 |
| ----------- | ----------- | -------------------------------------------- | --------------------------- |
| id          | SERIAL      | Primary key                                  | PRIMARY KEY, AUTO_INCREMENT |
| company_id  | INTEGER     | Foreign key to companies                     | FOREIGN KEY, NOT NULL       |
| type        | VARCHAR(50) | Section type (about, life, benefits, custom) | NOT NULL                    |
| content     | JSONB       | Section content (title, body/items)          | NOT NULL                    |
| order_index | INTEGER     | Display order                                | NOT NULL                    |
| visible     | BOOLEAN     | Whether section is visible                   | DEFAULT TRUE                |
| created_at  | TIMESTAMP   | Creation timestamp                           | DEFAULT NOW()               |
| updated_at  | TIMESTAMP   | Last update timestamp                        | DEFAULT NOW()               |

#### `jobs`

Stores job postings for companies.

| Column          | Type         | Description                       | Constraints                 |
| --------------- | ------------ | --------------------------------- | --------------------------- |
| id              | SERIAL       | Primary key                       | PRIMARY KEY, AUTO_INCREMENT |
| company_id      | INTEGER      | Foreign key to companies          | FOREIGN KEY, NOT NULL       |
| title           | VARCHAR(255) | Job title                         | NOT NULL                    |
| location        | VARCHAR(255) | Job location                      | NOT NULL                    |
| employment_type | VARCHAR(50)  | Type (Full-time, Part-time, etc.) | NOT NULL                    |
| description     | TEXT         | Job description                   |                             |
| created_at      | TIMESTAMP    | Creation timestamp                | DEFAULT NOW()               |
| updated_at      | TIMESTAMP    | Last update timestamp             | DEFAULT NOW()               |

#### `career_pages`

Manages publishing and SEO for career pages.

| Column          | Type         | Description               | Constraints                   |
| --------------- | ------------ | ------------------------- | ----------------------------- |
| id              | SERIAL       | Primary key               | PRIMARY KEY, AUTO_INCREMENT   |
| company_id      | INTEGER      | Foreign key to companies  | FOREIGN KEY, UNIQUE, NOT NULL |
| published       | BOOLEAN      | Whether page is published | DEFAULT FALSE                 |
| seo_title       | VARCHAR(255) | SEO title                 |                               |
| seo_description | TEXT         | SEO description           |                               |
| created_at      | TIMESTAMP    | Creation timestamp        | DEFAULT NOW()                 |
| updated_at      | TIMESTAMP    | Last update timestamp     | DEFAULT NOW()                 |

## Test Plan

- **Tools**: Jest for testing, React Testing Library for component testing.
- **Examples**:
  - Test `storageService.getCompanies()` with mocked Supabase responses.
  - Test component rendering (e.g., LandingPage with different states).
  - Test utility functions (e.g., slugify in `utils/slugify.ts`).

### Test Environment

- **Local**: Run tests with `npm run test` (Jest).
- **CI/CD**: Integrate with GitHub Actions for automated testing on pushes/PRs.
