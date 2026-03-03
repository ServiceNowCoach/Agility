import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { DataProvider } from '@/contexts/DataContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import Dashboard from '@/pages/Dashboard'
import NewAssessment from '@/pages/NewAssessment'
import AssessmentDetail from '@/pages/AssessmentDetail'
import ProblemRegister from '@/pages/ProblemRegister'
import Compare from '@/pages/Compare'
import Login from '@/pages/Login'

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-slate-50">
                    <Navbar />
                    <main>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/assessment/new" element={<NewAssessment />} />
                        <Route path="/assessment/:id" element={<AssessmentDetail />} />
                        <Route path="/assessment/:id/problems" element={<ProblemRegister />} />
                        <Route path="/compare" element={<Compare />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}
