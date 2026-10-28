import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Planned from './pages/Planned';
import PlannedVsActual from './pages/PlannedVsActual';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/planned/:projectIdParam" element={<Planned />} />
            <Route path="/actual/:projectIdParam" element={<PlannedVsActual />} />
            <Route path="/planned-vs-actual/:projectIdParam" element={<PlannedVsActual />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
