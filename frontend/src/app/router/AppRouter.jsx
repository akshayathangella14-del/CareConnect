import { Routes, Route } from 'react-router-dom';
import AppShell from '@/layouts/AppShell/AppShell';
import { ProtectedRoute, GuestRoute, RoleRoute } from '@/routes';

/* Pages */
import HomePage from '@/pages/HomePage';
import DesignSystemPage from '@/pages/DesignSystemPage';
import DashboardPage from '@/pages/DashboardPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

/* Customer Pages */
import CreateServiceRequestPage from '@/pages/customer/CreateServiceRequestPage';
import ServiceRequestsPage from '@/pages/customer/ServiceRequestsPage';
import ServiceRequestDetailPage from '@/pages/customer/ServiceRequestDetailPage';
import ScopeMatchPage from '@/pages/customer/ScopeMatchPage';
import BookingsPage from '@/pages/customer/BookingsPage';
import BookingDetailPage from '@/pages/customer/BookingDetailPage';
import CreateReviewPage from '@/pages/customer/CreateReviewPage';
import CreateDisputePage from '@/pages/customer/CreateDisputePage';

/* Provider Pages */
import MatchedRequestsPage from '@/pages/provider/MatchedRequestsPage';
import QuoteFormPage from '@/pages/provider/QuoteFormPage';
import ProviderBookingsPage from '@/pages/provider/ProviderBookingsPage';
import ProviderBookingDetailPage from '@/pages/provider/ProviderBookingDetailPage';
import AvailabilityPage from '@/pages/provider/AvailabilityPage';
import ProviderProfilePage from '@/pages/provider/ProviderProfilePage';

/* Operations & Admin Pages */
import ProviderVerificationPage from '@/pages/operations/ProviderVerificationPage';
import OpsServiceRequestsPage from '@/pages/operations/OpsServiceRequestsPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';
import AdminAuditPage from '@/pages/admin/AdminAuditPage';

/* Support & Shared Pages */
import SupportDisputesPage from '@/pages/support/SupportDisputesPage';
import SupportDisputeDetailPage from '@/pages/support/SupportDisputeDetailPage';
import InvoicesPage from '@/pages/shared/InvoicesPage';
import NotificationsPage from '@/pages/shared/NotificationsPage';
import NotFoundPage from '@/pages/NotFoundPage';

/**
 * AppRouter — Central route definitions for CareConnect.
 *
 * Public routes:
 *   /               — Landing / Home
 *   /login          — Login (guest only)
 *   /register       — Registration (guest only)
 *   /design-system  — Design system showcase (dev)
 *
 * Protected routes:
 *   /dashboard      — Role-aware dashboard placeholder
 *   /unauthorized   — Access denied page
 */
function AppRouter() {
  return (
    <Routes>
      {/* Auth pages — no shell, guest only */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      {/* Shell-wrapped routes */}
      <Route element={<AppShell />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Customer Routes */}
        <Route path="/service-requests/new" element={<RoleRoute roles={['CUSTOMER']}><CreateServiceRequestPage /></RoleRoute>} />
        <Route path="/service-requests" element={<RoleRoute roles={['CUSTOMER']}><ServiceRequestsPage /></RoleRoute>} />
        <Route path="/service-requests/:id" element={<RoleRoute roles={['CUSTOMER']}><ServiceRequestDetailPage /></RoleRoute>} />
        <Route path="/service-requests/:id/matches" element={<RoleRoute roles={['CUSTOMER']}><ScopeMatchPage /></RoleRoute>} />
        <Route path="/bookings" element={<RoleRoute roles={['CUSTOMER']}><BookingsPage /></RoleRoute>} />
        <Route path="/bookings/:id" element={<RoleRoute roles={['CUSTOMER']}><BookingDetailPage /></RoleRoute>} />
        <Route path="/reviews/new" element={<RoleRoute roles={['CUSTOMER']}><CreateReviewPage /></RoleRoute>} />
        <Route path="/reviews/new/:bookingId" element={<RoleRoute roles={['CUSTOMER']}><CreateReviewPage /></RoleRoute>} />
        <Route path="/disputes/new" element={<RoleRoute roles={['CUSTOMER']}><CreateDisputePage /></RoleRoute>} />

        {/* Provider Routes */}
        <Route path="/provider/matches" element={<RoleRoute roles={['SERVICE_PROVIDER']}><MatchedRequestsPage /></RoleRoute>} />
        <Route path="/provider/quotes/new" element={<RoleRoute roles={['SERVICE_PROVIDER']}><QuoteFormPage /></RoleRoute>} />
        <Route path="/provider/bookings" element={<RoleRoute roles={['SERVICE_PROVIDER']}><ProviderBookingsPage /></RoleRoute>} />
        <Route path="/provider/bookings/:id" element={<RoleRoute roles={['SERVICE_PROVIDER']}><ProviderBookingDetailPage /></RoleRoute>} />
        <Route path="/provider/availability" element={<RoleRoute roles={['SERVICE_PROVIDER']}><AvailabilityPage /></RoleRoute>} />
        <Route path="/provider/profile" element={<RoleRoute roles={['SERVICE_PROVIDER']}><ProviderProfilePage /></RoleRoute>} />

        {/* Operations Routes */}
        <Route path="/operations/verifications" element={<RoleRoute roles={['OPERATIONS_MANAGER', 'ADMIN']}><ProviderVerificationPage /></RoleRoute>} />
        <Route path="/operations/requests" element={<RoleRoute roles={['OPERATIONS_MANAGER', 'ADMIN']}><OpsServiceRequestsPage /></RoleRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/categories" element={<RoleRoute roles={['ADMIN']}><AdminCategoriesPage /></RoleRoute>} />
        <Route path="/admin/audit" element={<RoleRoute roles={['ADMIN']}><AdminAuditPage /></RoleRoute>} />

        {/* Support Routes */}
        <Route path="/support/disputes" element={<RoleRoute roles={['SUPPORT_AGENT', 'ADMIN']}><SupportDisputesPage /></RoleRoute>} />
        <Route path="/support/disputes/:id" element={<RoleRoute roles={['SUPPORT_AGENT', 'ADMIN']}><SupportDisputeDetailPage /></RoleRoute>} />
        <Route path="/support/invoices" element={<RoleRoute roles={['SUPPORT_AGENT', 'ADMIN']}><InvoicesPage /></RoleRoute>} />

        {/* Shared Authenticated Routes */}
        <Route path="/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
