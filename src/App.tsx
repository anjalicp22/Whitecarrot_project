import { Routes, Route } from "react-router-dom";
import CareersPage from "./pages/CareersPage";
import EditPage from "./pages/EditPage";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/new-company/edit" element={<EditPage />} />
      <Route path="/:companySlug/edit" element={<EditPage />} />
      <Route path="/:companySlug/careers" element={<CareersPage />} />
    </Routes>
  );
}

export default App;
