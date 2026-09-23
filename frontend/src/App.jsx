import AppProviders from './app/providers/AppProviders';
import AppRouter from './app/router/AppRouter';

/**
 * App — Root application component.
 * Wraps the router with all necessary providers.
 */
function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
