import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("SESSION:", data.session);
      console.log("ERROR:", error);

      if (error) {
        console.error("Auth callback error:", error);
        navigate("/login");
        return;
      }

      if (data.session) {
        console.log("User authenticated:", data.session.user);
        // Redirect to a default company edit page or dashboard
        navigate("/example-company/edit"); // Change to a real slug or dashboard
      } else {
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

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
            Signing You In
          </h1>
          <p className="text-lg text-gray-600">
            Please wait while we complete your authentication...
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
