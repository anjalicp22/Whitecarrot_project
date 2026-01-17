import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-10 text-center">
          {/* Header Section */}
          <div className="mb-10">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-indigo-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Verifying Access
            </h1>
            <p className="text-lg text-gray-600">
              Please wait while we verify your authentication...
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

  return <>{children}</>;
}
