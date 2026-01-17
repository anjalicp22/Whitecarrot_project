import { Company, Job } from "../types/types";
import { supabase } from "../lib/supabaseClient";

const STORAGE_KEY = 'careers_builder_companies';

export const storageService = {
  getCompanies: async (): Promise<Company[]> => {
    try {
      console.log('Attempting to fetch companies from Supabase...');

      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase environment variables not found, using fallback data');
        return [];
      }

      // Fetch companies from Supabase
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*');

      if (companiesError) {
        console.error('Error fetching companies:', companiesError);
        return [];
      }

      if (!companiesData || companiesData.length === 0) {
        console.log('No companies found in database');
        return [];
      }

      console.log('Successfully fetched companies:', companiesData);

      // Fetch sections for all companies
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*')
        .in('company_id', companiesData.map(c => c.id));

      if (sectionsError) {
        console.error('Error fetching sections:', sectionsError);
      }

      // Fetch jobs for all companies
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .in('company_id', companiesData.map(c => c.id));

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
      }

      // Fetch career pages for all companies
      const { data: careerPagesData, error: careerPagesError } = await supabase
        .from('career_pages')
        .select('*')
        .in('company_id', companiesData.map(c => c.id));

      if (careerPagesError) {
        console.error('Error fetching career pages:', careerPagesError);
      }

      const companies: Company[] = companiesData.map(company => {
        const companySections = sectionsData?.filter(s => s.company_id === company.id) || [];
        const companyJobs = jobsData?.filter(j => j.company_id === company.id) || [];
        const companyCareerPage = careerPagesData?.find(cp => cp.company_id === company.id);

        return {
          id: company.slug,
          name: company.name,
          theme: {
            primaryColor: company.primary_color || "#4F46E5",
            secondaryColor: company.secondary_color || "#111827",
            logoUrl: company.logo_url || "https://placehold.co/1200x400",
            bannerUrl: company.banner_url || "https://placehold.co/1200x400",
            cultureVideoUrl: company.culture_video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ"
          },
          careerPage: companyCareerPage ? {
            published: companyCareerPage.published,
            seoTitle: companyCareerPage.seo_title,
            seoDescription: companyCareerPage.seo_description
          } : undefined,
          sections: companySections.map(section => {
            let content;
            if (typeof section.content === 'string') {
              try {
                content = JSON.parse(section.content);
              } catch {
                console.warn('Failed to parse section content string:', section.content);
                content = {};
              }
            } else if (typeof section.content === 'object' && section.content !== null) {
              content = section.content;
            } else {
              content = {};
            }
            return {
              id: section.id.toString(),
              type: section.type as "about" | "life" | "benefits" | "custom",
              title: content.title || section.type,
              content: section.type === 'benefits' ? content.items?.join('\n') || content.body || '' : content.body || '',
              order: section.order_index
            };
          }),
          jobs: companyJobs.map(job => ({
            id: job.id.toString(),
            title: job.title,
            location: job.location,
            type: job.employment_type as "Full-time" | "Part-time" | "Contract" | "Internship",
            description: job.description || '',
            requirements: [] // Could be expanded if job has requirements field
          }))
        };
      });

      return companies;
    } catch (error) {
      console.error('Error reading companies from Supabase:', error);
      return [];
    }
  },

  saveCompany: async (company: Company): Promise<void> => {
    try {
      // Find the company in Supabase by slug
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', company.id)
        .single();

      if (existingCompany) {
        // Update existing company
        console.log('Saving company theme data:', company.theme);
        await supabase
          .from('companies')
          .update({
            name: company.name,
            primary_color: company.theme.primaryColor,
            secondary_color: company.theme.secondaryColor,
            logo_url: company.theme.logoUrl,
            banner_url: company.theme.bannerUrl,
            culture_video_url: company.theme.cultureVideoUrl
          })
          .eq('id', existingCompany.id);

        // Handle sections - update existing and create new ones
        for (const section of company.sections) {
          const sectionId = parseInt(section.id);
          if (!isNaN(sectionId)) {
            // Update existing section
            await supabase
              .from('page_sections')
              .update({
                content: JSON.stringify({
                  title: section.title,
                  body: section.content
                }),
                order_index: section.order
              })
              .eq('id', sectionId);
          } else {
            // Create new section
            await supabase
              .from('page_sections')
              .insert({
                company_id: existingCompany.id,
                type: section.type,
                content: JSON.stringify({
                  title: section.title,
                  body: section.content
                }),
                order_index: section.order,
                visible: true
              });
          }
        }
      } else {
        // Create new company
        const { data: newCompany } = await supabase
          .from('companies')
          .insert({
            name: company.name,
            slug: company.id,
            primary_color: company.theme.primaryColor,
            secondary_color: company.theme.secondaryColor,
            logo_url: company.theme.logoUrl,
            banner_url: company.theme.bannerUrl,
            culture_video_url: company.theme.cultureVideoUrl
          })
          .select()
          .single();

        if (newCompany) {
          // Create sections
          for (const section of company.sections) {
            await supabase
              .from('page_sections')
              .insert({
                company_id: newCompany.id,
                type: section.type,
                content: JSON.stringify({
                  title: section.title,
                  body: section.content
                }),
                order_index: section.order,
                visible: true
              });
          }
        }
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      // Fallback to localStorage
      try {
        const companies = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const existingIndex = companies.findIndex((c: Company) => c.id === company.id);

        if (existingIndex >= 0) {
          companies[existingIndex] = company;
        } else {
          companies.push(company);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
      }
    }
  },

  getCompanyById: async (id: string): Promise<Company | null> => {
    try {
      // First try to get from Supabase directly
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('slug', id)
          .single();

        if (companyError && companyError.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Error fetching company from Supabase:', companyError);
        } else if (companyData) {
          // Fetch sections and jobs for this company
          const { data: sectionsData } = await supabase
            .from('page_sections')
            .select('*')
            .eq('company_id', companyData.id);

          const { data: jobsData } = await supabase
            .from('jobs')
            .select('*')
            .eq('company_id', companyData.id);

          const { data: careerPagesData } = await supabase
            .from('career_pages')
            .select('*')
            .eq('company_id', companyData.id);

          return {
            id: companyData.slug,
            name: companyData.name,
            theme: {
              primaryColor: companyData.primary_color || "#4F46E5",
              secondaryColor: companyData.secondary_color || "#111827",
              logoUrl: companyData.logo_url || "",
              bannerUrl: companyData.banner_url || "",
              cultureVideoUrl: companyData.culture_video_url || ""
            },
            careerPage: careerPagesData?.[0] ? {
              published: careerPagesData[0].published,
              seoTitle: careerPagesData[0].seo_title,
              seoDescription: careerPagesData[0].seo_description
            } : undefined,
            sections: sectionsData?.map(section => {
              let content;
              if (typeof section.content === 'string') {
                try {
                  content = JSON.parse(section.content);
                } catch {
                  content = { title: section.type, body: section.content };
                }
              } else if (typeof section.content === 'object' && section.content !== null) {
                content = section.content;
              } else {
                content = {};
              }
              return {
                id: section.id.toString(),
                type: section.type as "about" | "life" | "benefits" | "custom",
                title: content.title || section.type,
                content: section.type === 'benefits' ? content.items?.join('\n') || content.body || '' : content.body || '',
                order: section.order_index
              };
            }) || [],
            jobs: jobsData?.map(job => ({
              id: job.id.toString(),
              title: job.title,
              location: job.location,
              type: job.employment_type as "Full-time" | "Part-time" | "Contract" | "Internship",
              description: job.description || '',
              requirements: []
            })) || []
          };
        }
      }

      // Fallback to getting all companies and filtering
      const companies = await storageService.getCompanies();
      return companies.find((c) => c.id === id) || null;
    } catch (error) {
      console.error('Error getting company by ID:', error);
      return null;
    }
  },

  deleteCompany: async (id: string): Promise<void> => {
    try {
      // Find company by slug and delete
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', id)
        .single();

      if (company) {
        await supabase
          .from('companies')
          .delete()
          .eq('id', company.id);
      }
    } catch (error) {
      console.error('Error deleting from Supabase:', error);
      // Fallback to localStorage
      try {
        const companies = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const filteredCompanies = companies.filter((c: Company) => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCompanies));
      } catch (localError) {
        console.error('Error deleting from localStorage:', localError);
      }
    }
  },

  getAllJobs: async (): Promise<Job[]> => {
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*');

      if (jobsError) {
        console.error('Error fetching all jobs:', jobsError);
        return [];
      }

      return jobsData?.map(job => ({
        id: job.id.toString(),
        title: job.title,
        location: job.location,
        type: job.employment_type as "Full-time" | "Part-time" | "Contract" | "Internship",
        description: job.description || '',
        requirements: []
      })) || [];
    } catch (error) {
      console.error('Error getting all jobs:', error);
      return [];
    }
  },

  saveJob: async (job: Job, companyId: string): Promise<void> => {
    try {
      // Get company database ID
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', companyId)
        .single();

      if (!company) {
        console.error('Company not found for job save');
        return;
      }

      // Check if job already exists for this company
      const { data: existingJob } = await supabase
        .from('jobs')
        .select('id')
        .eq('company_id', company.id)
        .eq('title', job.title)
        .eq('location', job.location)
        .single();

      if (existingJob) {
        // Update existing job
        await supabase
          .from('jobs')
          .update({
            description: job.description,
            employment_type: job.type
          })
          .eq('id', existingJob.id);
      } else {
        // Create new job
        await supabase
          .from('jobs')
          .insert({
            company_id: company.id,
            title: job.title,
            location: job.location,
            employment_type: job.type,
            description: job.description
          });
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  },

  saveJobsForCompany: async (jobs: Job[], companyId: string): Promise<void> => {
    try {
      // Get company database ID
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', companyId)
        .single();

      if (!company) {
        console.error('Company not found for jobs save');
        return;
      }

      // Delete existing jobs for this company
      await supabase
        .from('jobs')
        .delete()
        .eq('company_id', company.id);

      // Insert new jobs
      if (jobs.length > 0) {
        const jobsToInsert = jobs.map(job => ({
          company_id: company.id,
          title: job.title,
          location: job.location,
          employment_type: job.type,
          description: job.description
        }));

        await supabase
          .from('jobs')
          .insert(jobsToInsert);
      }
    } catch (error) {
      console.error('Error saving jobs for company:', error);
    }
  },
};
