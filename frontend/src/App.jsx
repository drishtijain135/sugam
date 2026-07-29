import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route
        path="/authority"
        element={<AuthorityDashboard />}
      />
    </Routes>
  );
}

export default App;