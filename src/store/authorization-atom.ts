import { AUTH_TOKEN_KEY } from '@/lib/constants';
import { atom } from 'jotai';
import Cookies from 'js-cookie';

export function checkIsLoggedIn() {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  if (!token) return false;
  return true;
}
export const authorizationAtom = atom(checkIsLoggedIn());

// export const authorizationAtom = atom(
//   (get) => {
//     const token = Cookies.get(AUTH_TOKEN_KEY);
//     return !!token; // Returns true if token exists
//   },
  

//   (get, set) => {
//     const token = Cookies.get(AUTH_TOKEN_KEY);
//     return set(authorizationAtom, !!token); // Update the state based on token's existence
//   }
// );