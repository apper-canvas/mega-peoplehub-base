import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Leave from "@/components/pages/Leave";
import Profile from "@/components/pages/Profile";
import Documents from "@/components/pages/Documents";
import Attendance from "@/components/pages/Attendance";
import Directory from "@/components/pages/Directory";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/directory" element={<Directory />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;