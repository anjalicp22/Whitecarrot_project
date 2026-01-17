// types.ts
export interface Company {
  id: string;
  name: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    bannerUrl: string;
    logoUrl: string;
    cultureVideoUrl: string;
  };
  sections: ContentSection[];
  jobs: Job[];
  careerPage?: {
    published: boolean;
    seoTitle: string;
    seoDescription: string;
  };
}

export interface ContentSection {
  id: string;
  type: 'about' | 'life' | 'benefits' | 'custom';
  title: string;
  content: string;
  order: number;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  description: string;
  requirements: string[];
}

export type UserRole = 'Recruiter' | 'Candidate';
