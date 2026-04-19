import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Scheduler from './pages/Scheduler';
import Report from './pages/Report';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/report"    element={<Report />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
