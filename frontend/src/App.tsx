import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { Login } from './features/auth/pages/LoginPage';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./features/analytics/pages/DashboardPage').then(module => ({ default: module.Dashboard })));
const Bookings = lazy(() => import('./features/bookings/pages/BookingsPage').then(module => ({ default: module.Bookings })));

const CalendarView = lazy(() => import('./features/bookings/pages/CalendarPage').then(module => ({ default: module.CalendarView })));
const BookingDetails = lazy(() => import('./features/bookings/pages/BookingDetailsPage').then(module => ({ default: module.BookingDetails })));

const BookingTravelers = lazy(() => import('./features/bookings/pages/BookingTravelersPage').then(module => ({ default: module.BookingTravelers })));
const BookedEDT = lazy(() => import('./features/bookings/pages/BookedEDTPage').then(module => ({ default: module.BookedEDT })));
const Reports = lazy(() => import('./features/analytics/pages/ReportsPage').then(module => ({ default: module.Reports })));
const Users = lazy(() => import('./features/users/pages/UsersPage').then(module => ({ default: module.Users })));
const Settings = lazy(() => import('./features/settings/pages/SettingsPage').then(module => ({ default: module.Settings })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,      // 60 seconds
      gcTime: 1000 * 60 * 10,    // 10 minutes
    },
  },
});

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/mybooking" element={<Bookings />} />
                  <Route path="/unassignedbooking" element={<Bookings />} />
                  <Route path="/calendar" element={<CalendarView />} />
                  <Route path="/bookings/:id" element={<BookingDetails />} />

                  <Route path="/bookings/:id/travelers" element={<BookingTravelers />} />
                  <Route path="/booked" element={<BookedEDT />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
