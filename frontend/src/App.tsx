import { type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import DealPipeline from './pages/DealPipeline';
import DealDetail from './pages/DealDetail';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, roles }: { children: ReactNode, roles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <div>Unauthorized</div>;

  return <>{children}</>;
};

// Placeholder pages
const Layout = ({ children }: { children: ReactNode }) => {
  const { logout, user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">DealFlow</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{user?.email} ({user?.role})</span>
          <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <DealPipeline />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/deals/:id" element={
              <ProtectedRoute>
                <Layout>
                  <DealDetail />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
