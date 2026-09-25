import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bell,
  LogOut,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { Logo, Button } from '@/components';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  clearCredentials,
  useLogoutMutation,
} from '@/features/auth';
import { useListNotificationsQuery } from '@/features/notifications';
import { apiSlice } from '@/api/apiSlice';
import SearchBar from '@/components/Search/SearchBar';
import LoginModal from '@/components/auth/LoginModal';
import styles from './TopNavigation.module.css';

const MARKETING_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Professionals', href: '/#professionals' },
  { label: 'Stories', href: '/#stories' },
];

function getAppLinks(user) {
  if (!user) return [];
  const links = [{ label: 'Dashboard', path: '/dashboard' }];
  if (user.role === 'CUSTOMER') {
    links.push(
      { label: 'Requests', path: '/service-requests' },
      { label: 'Bookings', path: '/bookings' }
    );
  } else if (user.role === 'SERVICE_PROVIDER') {
    links.push(
      { label: 'Jobs', path: '/provider/matches' },
      { label: 'Bookings', path: '/provider/bookings' },
      { label: 'Schedule', path: '/provider/availability' }
    );
  } else if (user.role === 'OPERATIONS_MANAGER' || user.role === 'ADMIN') {
    links.push(
      { label: 'Verifications', path: '/operations/verifications' },
      { label: 'Requests', path: '/operations/requests' }
    );
    if (user.role === 'ADMIN') links.push({ label: 'Categories', path: '/admin/categories' });
  } else if (user.role === 'SUPPORT_AGENT') {
    links.push({ label: 'Disputes', path: '/support/disputes' });
  }
  links.push({ label: 'Invoices', path: '/invoices' });
  return links;
}

export default function TopNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [logout] = useLogoutMutation();
  const { data: notifications = [] } = useListNotificationsQuery(undefined, { skip: !isAuthenticated });
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const isMarketing = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const open = () => setLoginOpen(true);
    window.addEventListener('careconnect:open-login', open);
    return () => window.removeEventListener('careconnect:open-login', open);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // still clear locally
    }
    dispatch(clearCredentials());
    dispatch(apiSlice.util.resetApiState());
    navigate('/login', { replace: true });
  };

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const appLinks = getAppLinks(user);
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CC';

  return (
    <>
      <header className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${isMarketing ? styles.marketing : styles.app}`}>
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className={styles.brand} aria-label="CareConnect home">
            <Logo size="sm" animated />
          </Link>

          <nav className={styles.links} aria-label="Primary">
            {isMarketing
              ? MARKETING_LINKS.map((link) => (
                  <a key={link.href} href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                ))
              : appLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                  >
                    {link.label}
                  </NavLink>
                ))}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Search services"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/notifications" className={styles.iconBtn} aria-label="Notifications">
                  <Bell size={20} />
                  {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </Link>
                <div className={styles.user}>
                  <span className={styles.avatar}>{initials}</span>
                  <button type="button" className={styles.iconBtn} onClick={handleLogout} aria-label="Sign out">
                    <LogOut size={18} />
                  </button>
                </div>
                {user?.role === 'CUSTOMER' && (
                  <Link to="/service-requests/new" className={styles.ctaLink}>
                    <Button variant="primary" size="sm">Book a service</Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <button type="button" className={styles.ghost} onClick={openLogin}>
                  Sign in
                </button>
                <Link to="/register" className={styles.ctaLink}>
                  <Button variant="primary" size="sm">Book a service</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`} aria-hidden={!drawerOpen}>
        <div className={styles.drawerPanel}>
          <div className={styles.drawerHead}>
            <Logo size="sm" animated />
            <button type="button" className={styles.iconBtn} onClick={() => setDrawerOpen(false)} aria-label="Close navigation">
              <X size={22} />
            </button>
          </div>
          <nav className={styles.drawerNav}>
            {isMarketing
              ? MARKETING_LINKS.map((link) => (
                  <a key={link.href} href={link.href} className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
                    {link.label}
                  </a>
                ))
              : appLinks.map((link) => (
                  <NavLink key={link.path} to={link.path} className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
                    {link.label}
                  </NavLink>
                ))}
            {!isAuthenticated && (
              <>
                <button
                  type="button"
                  className={styles.drawerLink}
                  onClick={() => {
                    setDrawerOpen(false);
                    openLogin();
                  }}
                >
                  Sign in
                </button>
                <Link to="/register" className={styles.drawerCta} onClick={() => setDrawerOpen(false)}>
                  Book a service
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
      {drawerOpen && <button type="button" className={styles.backdrop} aria-label="Close menu" onClick={() => setDrawerOpen(false)} />}

      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
