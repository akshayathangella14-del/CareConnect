import { Outlet, useLocation } from 'react-router-dom';
import TopNavigation from '@/components/Navigation/TopNavigation';
import styles from './AppShell.module.css';

function AppShell() {
  const { pathname } = useLocation();
  const isMarketing = pathname === '/';

  return (
    <div className={`${styles.shell} ${isMarketing ? styles.marketing : styles.app}`}>
      <TopNavigation />
      <main className={isMarketing ? styles.contentMarketing : styles.contentApp}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
