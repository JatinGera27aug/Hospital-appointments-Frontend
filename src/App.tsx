import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/Navbar';
import LandingPage from '@/pages/LandingPage';
import PatientDashboard from '@/pages/PatientDashboard';
import DoctorDashboard from '@/pages/DoctorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import BookAppointment from '@/pages/BookAppointment';
import RescheduleAppointment from '@/pages/ReschedulingAppointment';
import Register from '@/pages/Register';
import Login from '@/pages/Login';

// Demo credentials for testing
const demoCredentials = {
  patient: { email: "patient@demo.com", password: "123456" },
  doctor: { email: "doctor@demo.com", password: "123456" },
  admin: { email: "admin@demo.com", password: "123456" }
};

// Log demo credentials to console
console.log("Demo Credentials:", demoCredentials);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/book-appointment" element={<BookAppointment />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/patient/reschedule-appointment/:appointmentId" element={<RescheduleAppointment />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;