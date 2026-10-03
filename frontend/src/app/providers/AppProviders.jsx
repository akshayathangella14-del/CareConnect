import { useEffect, useRef } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/app/store';
import {
  clearCredentials,
  selectCurrentToken,
  updateUser,
  useGetMeQuery,
} from '@/features/auth';
import { apiSlice } from '@/api/apiSlice';
import { createRealtimeClient } from '@/realtime/realtimeClient';
import {
  setRealtimeStatus,
  markRealtimeEvent,
  pushToast,
} from '@/realtime/realtimeSlice';

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

function RealtimeBootstrap({ children }) {
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const clientRef = useRef(null);
  const hasToken = !!token;

  useEffect(() => {
    if (!hasToken) {
      if (clientRef.current) {
        clientRef.current.stop();
        clientRef.current = null;
      }
      return;
    }

    if (!clientRef.current) {
      clientRef.current = createRealtimeClient({
        getToken: () => store.getState().auth.token,
        onEvent: (event, data) => {
          dispatch(markRealtimeEvent());
          if (event === 'invalidate') {
            if (data?.tags && Array.isArray(data.tags)) {
              dispatch(apiSlice.util.invalidateTags(data.tags));
            }
          } else if (event === 'notification') {
            dispatch(pushToast({ id: Date.now().toString(), ...data }));
            dispatch(apiSlice.util.invalidateTags(['Notification']));
          }
        },
        onStatus: (status) => {
          dispatch(setRealtimeStatus(status));
        },
        onUnauthorized: () => {
          dispatch(clearCredentials());
        }
      });
      clientRef.current.start();
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.stop();
        clientRef.current = null;
      }
    };
  }, [hasToken, dispatch]);

  return children;
}

/**
 * AppProviders — Wraps the application with all required providers.
 *
 * - Redux Provider for state management
 * - Session restore via GET /auth/me
 * - Realtime client bootstrapping
 * - BrowserRouter for client-side routing
 */
function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <SessionBootstrap>
        <RealtimeBootstrap>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {children}
          </BrowserRouter>
        </RealtimeBootstrap>
      </SessionBootstrap>
    </Provider>
  );
}

export default AppProviders;
