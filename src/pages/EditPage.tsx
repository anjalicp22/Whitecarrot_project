// EditPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Company, ContentSection, Job } from "../types/types";
import { storageService } from "../services/storage";


interface EditedSection {
  id: string;
  type: string;
  title: string;
  content: string | string[];
  order: number;
}

type TabType = 'branding' | 'content' | 'jobs';

export default function EditPage() {
  const { companySlug } = useParams<{ companySlug: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [editedSections, setEditedSections] = useState<EditedSection[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('branding');
  const [editingSection, setEditingSection] = useState<EditedSection | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    location: '',
    type: 'Full-time',
    description: ''
  });

  useEffect(() => {
    if (!companySlug) return;

    const loadCompany = async () => {
      try {
        // First try to load existing company from database
        const loadedCompany = await storageService.getCompanyById(companySlug);

        if (loadedCompany) {
          // Company exists in database - load it
          setCompany(loadedCompany);
          setJobs(loadedCompany.jobs || []);
          // Parse sections for editing
          const parsedSections: EditedSection[] = loadedCompany.sections.map(section => {
            let title = section.title;
            let content: string | string[] = section.content;
            try {
              const contentObj = JSON.parse(section.content);
              title = contentObj.title || title;
              if (section.type === 'benefits') {
                content = contentObj.items || [];
              } else {
                content = contentObj.body || content;
              }
            } catch {
              if (section.type === 'benefits') {
                content = (section.content as string).split('\n').filter(item => item.trim()) || [];
              } else {
                content = section.content;
              }
            }
            return {
              id: section.id,
              type: section.type,
              title,
              content,
              order: section.order
            };
          });
          setEditedSections(parsedSections);
        } else if (companySlug.startsWith('new-company')) {
          // Company doesn't exist but is a new company slug - create it
          const newCompany: Company = {
            id: companySlug,
            name: '',
            theme: {
              primaryColor: "#4F46E5",
              secondaryColor: "#111827",
              logoUrl: "",
              bannerUrl: "",
              cultureVideoUrl: ""
            },
            sections: [],
            jobs: []
          };
          setCompany(newCompany);
          setEditedSections([]);
          setJobs([]);
        }
        // If company doesn't exist and slug doesn't start with 'new-company',
        // it will remain null and show loading/error state
      } catch (error) {
        console.error('Error loading company:', error);
      }
    };

    loadCompany();
  }, [companySlug]);

  const saveCompany = () => {
    if (!company) return;

    storageService.saveCompany(company);
    // Navigate to careers page to refresh the data
    navigate(`/${companySlug}/careers`);
  };

  const handleCompanyNameChange = (newName: string) => {
    if (!company) return;

    // Just update the local state for immediate UI feedback
    setCompany({ ...company, name: newName });
  };

  const handleCompanyNameBlur = async () => {
    if (!company || !companySlug?.startsWith('new-company') || !company.name.trim()) return;

    // Generate a slug from the company name when user finishes editing
    const slug = company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const finalSlug = slug || 'new-company-' + Date.now();

    const updatedCompany = {
      ...company,
      id: finalSlug
    };

    // Save the updated company to Supabase
    await storageService.saveCompany(updatedCompany);

    // Navigate to the new company edit page
    navigate(`/${finalSlug}/edit`);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...editedSections];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated[index - 1].order = index - 1;
    updated[index].order = index;
    setEditedSections(updated);
  };

  const moveDown = (index: number) => {
    if (index === editedSections.length - 1) return;
    const updated = [...editedSections];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated[index].order = index;
    updated[index + 1].order = index + 1;
    setEditedSections(updated);
  };

  const saveSections = async () => {
    if (!company) return;

    try {
      const updatedSections: ContentSection[] = editedSections.map(section => {
        let contentObj;
        if (section.type === 'benefits') {
          contentObj = {
            title: section.title,
            items: section.content as string[]
          };
        } else {
          contentObj = {
            title: section.title,
            body: section.content as string
          };
        }
        return {
          id: section.id,
          type: section.type as ContentSection['type'],
          title: section.title,
          content: JSON.stringify(contentObj),
          order: section.order
        };
      });

      const updatedCompany = { ...company, sections: updatedSections };
      await storageService.saveCompany(updatedCompany);

      // Navigate to careers page to refresh the data
      navigate(`/${companySlug}/careers`);
    } catch (error) {
      console.error('Error saving sections:', error);
    }
  };

  const handlePreview = () => {
    navigate(`/${companySlug}/careers`);
  };

  const handleDragStart = (_e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const updated = [...editedSections];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    
    // Update order values
    updated.forEach((section, i) => {
      section.order = i;
    });
    
    setEditedSections(updated);
    setDraggedIndex(null);
  };

  const handleEditSection = (section: EditedSection) => {
    setEditingSection(section);
  };

  const handleDeleteSection = (id: string) => {
    setEditedSections(editedSections.filter(section => section.id !== id));
  };

  const handleSaveEditedSection = () => {
    if (editingSection) {
      const index = editedSections.findIndex(s => s.id === editingSection.id);
      if (index !== -1) {
        const updated = [...editedSections];
        updated[index] = editingSection;
        setEditedSections(updated);
      }
    }
    setEditingSection(null);
  };

  // const handleShareLink = () => {
  //   const url = `${window.location.origin}/${companySlug}/careers`;
  //   navigator.clipboard.writeText(url);
  //   // Could add a toast notification here
  // };

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-10 text-center">
          {/* Header Section */}
          <div className="mb-10">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-indigo-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Loading Company Data
            </h1>
            <p className="text-lg text-gray-600">
              Please wait while we load your company information...
            </p>
          </div>

          {/* Loading Indicator */}
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animation-delay-200"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animation-delay-400"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Company</h1>
                <p className="text-sm text-gray-600">{company.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
              Preview
              </button>
              {/* <button
                onClick={handleShareLink}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
              Share Link
              </button> */}
              <button
                onClick={saveCompany}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
              >
              Save
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Segmented Control Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex">
            {[
              { id: 'branding' as TabType, label: 'Branding' },
              { id: 'content' as TabType, label: 'Content' },
              { id: 'jobs' as TabType, label: 'Jobs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'branding' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Brand Theme</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company.name}
                  onChange={(e) => handleCompanyNameChange(e.target.value)}
                  onBlur={handleCompanyNameBlur}
                  disabled={!companySlug || !companySlug.startsWith('new-company')}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    companySlug && companySlug.startsWith('new-company')
                      ? 'bg-white'
                      : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                  }`}
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={company.theme.primaryColor ?? "#4F46E5"}
                    onChange={(e) =>
                      setCompany({ ...company, theme: { ...company.theme, primaryColor: e.target.value } })
                    }
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={company.theme.primaryColor ?? "#4F46E5"}
                    onChange={(e) =>
                      setCompany({ ...company, theme: { ...company.theme, primaryColor: e.target.value } })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={company.theme.secondaryColor ?? "#111827"}
                    onChange={(e) =>
                      setCompany({ ...company, theme: { ...company.theme, secondaryColor: e.target.value } })
                    }
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={company.theme.secondaryColor ?? "#111827"}
                    onChange={(e) =>
                      setCompany({ ...company, theme: { ...company.theme, secondaryColor: e.target.value } })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  value={company.theme.bannerUrl ?? ""}
                  onChange={(e) =>
                    setCompany({ ...company, theme: { ...company.theme, bannerUrl: e.target.value } })
                  }
                  placeholder="https://example.com/banner.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={company.theme.logoUrl ?? ""}
                  onChange={(e) =>
                    setCompany({ ...company, theme: { ...company.theme, logoUrl: e.target.value } })
                  }
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Culture Video URL
                </label>
                <input
                  type="text"
                  value={company.theme.cultureVideoUrl ?? ""}
                  onChange={(e) =>
                    setCompany({ ...company, theme: { ...company.theme, cultureVideoUrl: e.target.value } })
                  }
                  placeholder="https://youtube.com/embed/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Content Sections</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const newSection: EditedSection = {
                      id: `section-${Date.now()}`,
                      type: 'about',
                      title: '',
                      content: '',
                      order: editedSections.length
                    };
                    setEditedSections([...editedSections, newSection]);
                    setEditingSection(newSection);
                  }}
                  disabled={!company?.name?.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  title={!company?.name?.trim() ? 'Please set a company name first' : ''}
                >
                  + Add Section
                </button>
                <button
                  onClick={saveSections}
                  disabled={!company?.name?.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  title={!company?.name?.trim() ? 'Please set a company name first' : ''}
                >
                Save Changes
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {editedSections.map((section, index) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1 cursor-move text-gray-400 hover:text-gray-600">
                        ⋮⋮
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {section.type === 'benefits'
                            ? (section.content as string[]).slice(0, 2).join(', ') + (section.content.length > 2 ? '...' : '')
                            : (section.content as string).substring(0, 100) + ((section.content as string).length > 100 ? '...' : '')
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === editedSections.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => handleEditSection(section)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Section Modal */}
            {editingSection && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Section</h2>
                    <button
                      onClick={() => setEditingSection(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={editingSection.title}
                        onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                        placeholder="Enter section title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      {editingSection.type === 'benefits' ? (
                        <textarea
                          value={(editingSection.content as string[]).join('\n')}
                          onChange={(e) => setEditingSection({
                            ...editingSection,
                            content: e.target.value.split('\n').filter(item => item.trim())
                          })}
                          placeholder="Enter each benefit on a new line..."
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <textarea
                          value={editingSection.content as string}
                          onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                          placeholder="Enter section content..."
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      )}
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setEditingSection(null)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEditedSection}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
              <button
                onClick={async () => {
                  // Load all existing jobs when opening modal
                  const jobs = await storageService.getAllJobs();
                  setAllJobs(jobs);
                  setShowJobModal(true);
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                + Add Job
              </button>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-4">📍 {job.location}</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {jobs.length === 0 && (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                  <div className="text-4xl mb-4">💼</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No job postings yet</h3>
                  <p className="text-gray-600">Add your first job posting to get started</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Job Selection Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Add Jobs to Company</h2>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* New Job Form */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Job</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={newJob.title || ''}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={newJob.location || ''}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Type
                      </label>
                      <select
                        value={newJob.type || 'Full-time'}
                        onChange={(e) => setNewJob({ ...newJob, type: e.target.value as Job['type'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newJob.description || ''}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Brief job description"
                      />
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!newJob.title || !newJob.location || !companySlug) return;

                      const jobToAdd: Job = {
                        id: `job-${Date.now()}`,
                        title: newJob.title,
                        location: newJob.location,
                        type: newJob.type as Job['type'] || 'Full-time',
                        description: newJob.description || '',
                        requirements: []
                      };

                      await storageService.saveJob(jobToAdd, companySlug);
                      setJobs([...jobs, jobToAdd]);
                      setNewJob({ title: '', location: '', type: 'Full-time', description: '' });
                    }}
                    disabled={!newJob.title || !newJob.location}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Add New Job
                  </button>
                </div>

                {/* Existing Jobs Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select from Existing Jobs</h3>
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    {allJobs.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        No existing jobs available
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {allJobs.map((job) => (
                          <div key={job.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={selectedJobIds.has(job.id)}
                                onChange={(e) => {
                                  const newSelected = new Set(selectedJobIds);
                                  if (e.target.checked) {
                                    newSelected.add(job.id);
                                  } else {
                                    newSelected.delete(job.id);
                                  }
                                  setSelectedJobIds(newSelected);
                                }}
                                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{job.title}</h4>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <span className="mr-4">📍 {job.location}</span>
                                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                                    {job.type}
                                  </span>
                                </div>
                                {job.description && (
                                  <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowJobModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!companySlug) return;

                      const selectedJobs = allJobs.filter(job => selectedJobIds.has(job.id));
                      if (selectedJobs.length === 0) return;

                      // Add selected jobs to company
                      for (const job of selectedJobs) {
                        await storageService.saveJob(job, companySlug);
                      }

                      setJobs([...jobs, ...selectedJobs]);
                      setSelectedJobIds(new Set());
                      setShowJobModal(false);
                    }}
                    disabled={selectedJobIds.size === 0}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Selected Jobs ({selectedJobIds.size})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
