import { useState, useCallback, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Home,
  Palette,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  User,
  LogIn,
  UserPlus,
  FileText,
  CalendarClock,
  Briefcase,
  ShieldCheck,
  Activity,
  LayoutGrid,
  Headphones,
  Receipt,
} from 'lucide-react';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  clearCredentials,
  useLogoutMutation,
} from '@/features/auth';
import { useListNotificationsQuery, useMarkAllNotificationsReadMutation } from '@/features/notifications';
import { apiSlice } from '@/api/apiSlice';
import { Logo } from '@/components';
import styles from './AppShell.module.css';

/**
 * AppShell — Main application layout with sidebar, topbar, and content area.
 *
 * Supports authenticated and unauthenticated states.
 * Sidebar adapts navigation based on auth status and role.
 */
function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [logout] = useLogoutMutation();
  const { data: notifications = [] } = useListNotificationsQuery(undefined, { skip: !isAuthenticated });
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        closeSidebar();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, closeSidebar]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Logout is client-side regardless of API response
    }
    dispatch(clearCredentials());
    dispatch(apiSlice.util.resetApiState());
    navigate('/login', { replace: true });
  };

  // Build nav items based on auth state
  const navItems = [];
  if (isAuthenticated) {
    navItems.push({ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
    
    // Role specific nav
    if (user?.role === 'CUSTOMER') {
      navItems.push({ label: 'Service Requests', path: '/service-requests', icon: FileText });
      navItems.push({ label: 'Bookings', path: '/bookings', icon: CalendarClock });
    } else if (user?.role === 'SERVICE_PROVIDER') {
      navItems.push({ label: 'Matched Jobs', path: '/provider/matches', icon: Briefcase });
      navItems.push({ label: 'My Bookings', path: '/provider/bookings', icon: CalendarClock });
      navItems.push({ label: 'My Schedule', path: '/provider/availability', icon: CalendarClock }); // Reusing icon for now
      navItems.push({ label: 'Profile', path: '/provider/profile', icon: User });
    } else if (user?.role === 'OPERATIONS_MANAGER') {
      navItems.push({ label: 'Verifications', path: '/operations/verifications', icon: ShieldCheck });
      navItems.push({ label: 'Global Requests', path: '/operations/requests', icon: Activity });
    } else if (user?.role === 'ADMIN') {
      navItems.push({ label: 'Verifications', path: '/operations/verifications', icon: ShieldCheck });
      navItems.push({ label: 'Global Requests', path: '/operations/requests', icon: Activity });
      navItems.push({ label: 'Categories', path: '/admin/categories', icon: LayoutGrid });
    } else if (user?.role === 'SUPPORT_AGENT') {
      navItems.push({ label: 'Disputes', path: '/support/disputes', icon: Headphones });
    }
    
    // Shared links for all roles
    navItems.push({ label: 'Invoices', path: '/invoices', icon: Receipt });
    // Notifications will be handled via Topbar bell usually, but we can add it here too or leave it to topbar. 
    // I'll add it here for mobile menu convenience.
    navItems.push({ label: 'Notifications', path: '/notifications', icon: Bell });
  } else {
    navItems.push({ label: 'Home', path: '/', icon: Home });
  }
  // Design System is for development/internal use only - not for customers
  if (user?.role === 'ADMIN' || user?.role === 'OPERATIONS_MANAGER') {
    navItems.push({ label: 'Design System', path: '/design-system', icon: Palette });
  }

  // Build breadcrumbs from pathname
  const breadcrumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path: '/' + arr.slice(0, index + 1).join('/'),
      isLast: index === arr.length - 1,
    }));

  // Page title from current nav item or breadcrumb
  const currentNav = navItems.find((item) => item.path === location.pathname);
  const pageTitle = currentNav?.label || breadcrumbs[breadcrumbs.length - 1]?.label || 'CareConnect';

  // User initials
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CC';

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles['sidebar--open'] : ''}`}
        aria-label="Main navigation"
      >
        <div className={styles.sidebar__header}>
          <Link to="/" className={styles.sidebar__brand} aria-label="CareConnect home">
            <Logo size="sm" animated={true} />
          </Link>
          <button
            className={styles.sidebar__close}
            onClick={closeSidebar}
            aria-label="Close navigation"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sidebar__nav}>
          <span className={styles['sidebar__nav-label']}>Navigation</span>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles['sidebar__nav-item']} ${isActive ? styles['sidebar__nav-item--active'] : ''}`
              }
              end={item.path === '/' || item.path === '/dashboard'}
            >
              <item.icon size={18} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer with User / Logout / Auth CTAs */}
        <div className={styles.sidebar__footer}>
          {isAuthenticated && user ? (
            <div className={styles['sidebar__user-section']}>
              <div className={styles['sidebar__user-info']}>
                <div className={styles['sidebar__user-avatar']}>
                  {initials}
                </div>
                <div className={styles['sidebar__user-details']}>
                  <span className={styles['sidebar__user-name']}>{user.name}</span>
                  <span className={styles['sidebar__user-role']}>
                    {user.role?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <button
                className={styles['sidebar__logout-btn']}
                onClick={handleLogout}
                aria-label="Sign out"
                type="button"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className={styles['sidebar__auth-actions']}>
              <Link to="/login" className={styles['sidebar__auth-link']}>
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className={styles['sidebar__auth-register']}>
                <UserPlus size={16} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles['overlay--visible'] : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Main area */}
      <div className={styles['main-area']}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbar__left}>
            <button
              className={styles['topbar__menu-btn']}
              onClick={openSidebar}
              aria-label="Open navigation menu"
              type="button"
            >
              <Menu size={22} />
            </button>
            <div className={styles['topbar__title-area']}>
              {breadcrumbs.length > 1 && (
                <nav className={styles.topbar__breadcrumbs} aria-label="Breadcrumb">
                  {breadcrumbs.map((crumb, i) => (
                    <span key={crumb.path} className={styles['topbar__breadcrumb-item']}>
                      {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
                      {crumb.isLast ? (
                        <span className={styles['topbar__breadcrumb-current']}>{crumb.label}</span>
                      ) : (
                        <NavLink to={crumb.path} className={styles['topbar__breadcrumb-link']}>
                          {crumb.label}
                        </NavLink>
                      )}
                    </span>
                  ))}
                </nav>
              )}
              <h1 className={styles.topbar__title}>{pageTitle}</h1>
            </div>
          </div>
          <div className={styles.topbar__right}>
            <button
              className={styles['topbar__icon-btn']}
              aria-label="Search"
              type="button"
            >
              <Search size={20} />
            </button>
            {isAuthenticated && (
              <Link to="/notifications" className={styles['topbar__icon-btn']} style={{ position: 'relative', textDecoration: 'none' }} aria-label="Notifications">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    backgroundColor: 'var(--color-error)',
                    color: 'white',
                    fontSize: '10px',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated && user ? (
              <div
                className={styles.topbar__avatar}
                role="button"
                tabIndex={0}
                aria-label={`User profile for ${user.name}`}
              >
                {initials}
              </div>
            ) : (
              <Link to="/login" className={styles['topbar__login-btn']}>
                <User size={16} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
