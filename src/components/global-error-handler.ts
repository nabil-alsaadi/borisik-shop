import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { authorizationAtom } from '@/store/authorization-atom';
import { setNotifyUnauthorizedHandler } from '../framework/rest/client/http-client';

export function GlobalErrorHandler() {
  const setAuthorized = useSetAtom(authorizationAtom);

  useEffect(() => {
    // Define what should happen when an unauthorized state is triggered
    const handleUnauthorized = () => {
      console.log('handleUnauthorized [=================[')
      setAuthorized(false); // Set authorization atom to false

    };

    // Set the global handler to be used in Axios interceptor
    setNotifyUnauthorizedHandler(handleUnauthorized);

    // Cleanup function when the component unmounts
    return () => {
      setNotifyUnauthorizedHandler(() => {});
    };
  }, [setAuthorized]);

  return null; // This component doesn't need to render anything
}
