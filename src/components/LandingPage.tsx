import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storageService } from "../services/storage";
import type { Company } from "../types/types";

export default function LandingPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [userType, setUserType] = useState<"recruiter" | "candidate">("candidate");

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        console.log('LandingPage: Loading companies from database...');
        const loadedCompanies = await storageService.getCompanies();
        console.log('LandingPage: Companies loaded:', loadedCompanies);
        setCompanies(loadedCompanies);
      } catch (error) {
        console.error('LandingPage: Error loading companies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const handleContinue = () => {
    if (!selectedCompany) return;

    console.log(`LandingPage: Navigating ${userType} to ${selectedCompany}`);

    if (userType === "recruiter") {
      navigate(`/${selectedCompany}/edit`);
    } else {
      navigate(`/${selectedCompany}/careers`);
    }
  };

  const handleAddNewCompany = async () => {
    if (userType !== "recruiter") return;

    try {
      // Create a new company entry in Supabase with default name
      const newCompany: Company = {
        id: 'new-company-' + Date.now(), // Generate unique ID
        name: 'New Company',
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

      // Save to Supabase
      await storageService.saveCompany(newCompany);

      // Navigate to the edit page for this new company
      navigate(`/${newCompany.id}/edit`);
    } catch (error) {
      console.error('Error creating new company:', error);
      // Could add error handling UI here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md sm:max-w-lg w-full bg-white rounded-xl shadow-xl p-6 sm:p-8 lg:p-10">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Careers Builder
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Build stunning career pages and connect with top talent
          </p>
        </div>

        {/* Company Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select a Company
          </label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Choose a company...</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            I am a
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUserType("candidate")}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                userType === "candidate"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Candidate</h3>
                <p className="text-sm opacity-75">Browse opportunities</p>
              </div>
            </button>
            <button
              onClick={() => setUserType("recruiter")}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                userType === "recruiter"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Recruiter</h3>
                <p className="text-sm opacity-75">Build & manage pages</p>
              </div>
            </button>
          </div>
        </div>

        {/* Add New Company */}
        {userType === "recruiter" && (
          <div className="mb-6">
            <button
              onClick={handleAddNewCompany}
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              + Add New Company
            </button>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedCompany}
          className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
