import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/app/store';
import {
  clearCredentials,
  selectCurrentToken,
  updateUser,
  useGetMeQuery,
} from '@/features/auth';

function SessionBootstrap({ children }) {
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const { data, error, isError } = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (data?.user) {
      dispatch(updateUser(data.user));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isError && (error?.status === 401 || error?.status === 403)) {
      dispatch(clearCredentials());
    }
  }, [dispatch, error, isError]);

  return children;
}

/**
 * AppProviders — Wraps the application with all required providers.
 *
 * - Redux Provider for state management
 * - Session restore via GET /auth/me
 * - BrowserRouter for client-side routing
 */
function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <SessionBootstrap>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          {children}
        </BrowserRouter>
      </SessionBootstrap>
    </Provider>
  );
}

export default AppProviders;
