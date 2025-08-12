import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Bootcamps from './pages/Bootcamps';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AnimatedCircles from './components/AnimatedCircles';
import { AuthProvider } from './contexts/AuthContext';
import Courses from './pages/Courses';
import BootcampCourses from './pages/BootcampCourses';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/bootcamps" element={
          <ProtectedRoute>
            <Bootcamps />
          </ProtectedRoute>
        } />
        <Route path="/courses" element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        } />
        <Route path="/bootcamps/:bootcampId/courses" element={
          <ProtectedRoute>
            <BootcampCourses />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Layout>
  );
}

function Home() {
  return (
    <div className="flex w-screen h-screen">
      {/* Left: Animation */}
      <div className="w-1/2 h-full">
        <AnimatedCircles text="Welcome" />
      </div>

      {/* Right: Content */}
      <div className="w-1/2 h-full flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-4xl font-bold text-blue-700 mb-6">Welcome to the MERN App</h1>
          <p className="text-lg text-gray-600 mb-4">
            Your gateway to learning and exploring bootcamps. Discover amazing opportunities and connect with the best programs.
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Explore bootcamps</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Connect with instructors</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Track your progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
