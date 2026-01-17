# Careers Builder

A modern, responsive web application for building stunning career pages and connecting companies with top talent. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### For Recruiters

- **Easy Company Setup**: Create and customize company career pages in minutes
- **Branding Control**: Customize colors, logos, banners, and culture videos
- **Content Management**: Add sections like About Us, Benefits, Culture, etc.
- **Job Posting**: Create and manage job openings with detailed descriptions
- **Responsive Design**: Career pages look great on all devices

### For Candidates

- **Company Discovery**: Browse through beautifully designed career pages
- **Job Search**: Filter jobs by location, type, and keywords
- **Detailed Job Info**: View comprehensive job descriptions and requirements
- **Direct Application**: Apply to positions directly from the platform

## 🏗️ What You Built

**Careers Builder** is a comprehensive SaaS platform that revolutionizes how companies attract talent and how candidates discover opportunities. The application consists of:

### Core Components

1. **Landing Page**: Role-based entry point where users select their type (Recruiter/Candidate) and choose a company
2. **Company Editor**: Full-featured CMS for recruiters to build and customize career pages
3. **Career Pages**: Beautiful, responsive company pages showcasing jobs and culture
4. **Job Management**: Complete job posting and management system

### Technical Architecture

- **Frontend**: React 18 with TypeScript for type safety and better DX
- **Styling**: Tailwind CSS with responsive design patterns
- **Backend**: Supabase providing PostgreSQL database and authentication
- **State Management**: React hooks with local state management
- **Routing**: React Router for client-side navigation
- **Build System**: Vite for fast development and optimized production builds

### Key Features Implemented

- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities
- **Real-time Updates**: Live preview and instant saving of changes
- **Drag & Drop**: Intuitive content reordering in the editor
- **Dynamic Theming**: Company-specific color schemes and branding
- **Search & Filtering**: Advanced job search with multiple filter criteria
- **Modal Interfaces**: Clean, accessible modal dialogs for detailed views

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router
- **Icons**: Heroicons
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (for backend services)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd whitecarrot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL migrations in `supabase/migrations/` (if any)
3. Update your environment variables with the project URL and anon key

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LandingPage.tsx  # Main landing page
│   └── RequireAuth.tsx  # Authentication wrapper
├── pages/              # Page components
│   ├── AuthCallback.tsx # OAuth callback handler
│   ├── CareersPage.tsx  # Company career pages
│   ├── EditPage.tsx     # Company editor
│   └── Login.tsx        # Authentication page
├── lib/                # Utilities and services
│   ├── auth.ts          # Authentication logic
│   ├── supabaseClient.ts # Supabase client
│   └── storage.ts       # Data storage services
├── types/              # TypeScript type definitions
│   └── types.ts         # Application types
└── utils/              # Helper functions
    └── slugify.ts       # URL slug generation
```

## 🎨 Customization

### Theme Configuration

The application uses Tailwind CSS for styling. Key design tokens:

- **Primary Color**: Indigo (#4F46E5)
- **Secondary Color**: Gray (#111827)
- **Typography**: Inter font family
- **Spacing**: 4px grid system

### Company Branding

Each company can customize:

- Primary and secondary colors
- Logo and banner images
- Culture videos
- Content sections and layout

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables in Netlify dashboard

### Manual Deployment

```bash
npm run build
# Upload the 'dist' folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@careersbuilder.com or join our Discord community.

## 🔄 Improvement Plan

### Phase 1: Core Enhancements (Next 2-4 weeks)

- [ ] **Authentication System**: Implement proper user authentication with Supabase Auth
- [ ] **User Dashboard**: Create personalized dashboards for recruiters and candidates
- [ ] **Advanced Editor**: Add rich text editing with image uploads and formatting
- [ ] **Email Notifications**: Set up email alerts for new applications and updates

### Phase 2: Advanced Features (1-2 months)

- [ ] **Analytics Dashboard**: Track page views, application rates, and user engagement
- [ ] **Application Management**: Full application tracking and management system
- [ ] **Advanced Search**: AI-powered job matching and recommendations
- [ ] **API Integration**: RESTful API for third-party integrations

### Phase 3: Scale & Polish (2-3 months)

- [ ] **Performance Optimization**: Code splitting, lazy loading, and caching
- [ ] **SEO Optimization**: Meta tags, structured data, and search engine friendly URLs
- [ ] **Accessibility**: WCAG 2.1 AA compliance and screen reader support
- [ ] **Multi-language Support**: i18n implementation for global expansion

### Technical Debt & Maintenance

- [ ] **Testing Suite**: Unit tests, integration tests, and E2E testing
- [ ] **Error Handling**: Comprehensive error boundaries and logging
- [ ] **Documentation**: API documentation and developer guides
- [ ] **Security Audit**: Code review and security best practices implementation

## 📖 Step-by-Step User Guide

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
2. **Content Types**:
   - **About**: Company mission, values, and story
   - **Benefits**: Employee perks and advantages
   - **Culture**: Work environment and company life
   - **Custom**: Any additional information
3. **Edit Content**: Click "Edit" on any section to modify title and content
4. **Reorder Sections**: Drag and drop sections to rearrange their order

#### 4. Managing Job Postings

1. **Access Jobs Tab**: Switch to the "Jobs" tab in the editor
2. **Create Jobs**: Click "Add Job" to create new positions
3. **Job Details**:
   - Title, location, employment type
   - Detailed description and requirements
   - Save to make jobs visible on your career page
4. **Manage Existing Jobs**: Edit or delete jobs as needed

#### 5. Preview and Publish

1. **Live Preview**: Click "Preview" to see your career page
2. **Save Changes**: Click "Save" to persist all modifications
3. **Share Link**: Copy the career page URL to share with candidates

### For Candidates

#### 1. Finding Companies

1. **Access Platform**: Visit the application and select "Candidate"
2. **Browse Companies**: Choose from available companies in the dropdown
3. **View Career Page**: Click "Continue" to explore the company's page

#### 2. Exploring Company Information

1. **Company Overview**: Read about the company's mission and values
2. **Culture Insights**: Watch culture videos and learn about work environment
3. **Benefits Review**: Check employee perks and advantages
4. **Team Information**: Learn about the company culture and values

#### 3. Finding Job Opportunities

1. **View Open Positions**: Scroll to the "Open Positions" section
2. **Use Filters**:
   - Search by keywords in job titles
   - Filter by location
   - Filter by employment type (Full-time, Part-time, etc.)
3. **Job Details**: Click "View job" on any position to see full details

#### 4. Applying for Jobs

1. **Review Requirements**: Read job description and requirements carefully
2. **Apply**: Click "Apply Now" button (opens application form)
3. **Submit Application**: Fill out and submit your application

### Advanced Features

#### Custom Branding

- **Color Schemes**: Each company has unique primary/secondary colors
- **Logo Integration**: Company logos appear in headers and branding
- **Banner Images**: Hero sections with company-specific imagery
- **Video Content**: Culture videos embedded directly in career pages

#### Content Management

- **Drag & Drop**: Reorder content sections intuitively
- **Rich Text**: Support for formatted text and lists
- **Dynamic Updates**: Changes reflect immediately in live preview

#### Job Search & Filtering

- **Multi-criteria Search**: Combine location, type, and keyword filters
- **Real-time Results**: Instant filtering as you type or select options
- **Detailed Views**: Modal dialogs for comprehensive job information

## 📊 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with ATS systems
- [ ] Multi-language support
- [ ] Advanced job matching algorithms

---

Built with ❤️ using React and TypeScript
