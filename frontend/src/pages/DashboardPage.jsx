import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth';
import CustomerDashboard from '@/pages/customer/CustomerDashboard';
import ProviderDashboard from '@/pages/provider/ProviderDashboard';
import OpsDashboard from '@/pages/operations/OpsDashboard';
import SupportDashboard from '@/pages/support/SupportDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';

function DashboardPage() {
  const user = useSelector(selectCurrentUser);

  switch (user?.role) {
    case 'SERVICE_PROVIDER':
      return <ProviderDashboard />;
    case 'OPERATIONS_MANAGER':
      return <OpsDashboard />;
    case 'SUPPORT_AGENT':
      return <SupportDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'CUSTOMER':
    default:
      return <CustomerDashboard />;
  }
}

export default DashboardPage;
