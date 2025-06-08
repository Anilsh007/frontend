import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute() {
  const location = useLocation();
  let user = null;

  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error('Invalid user in localStorage:', e);
    localStorage.removeItem('user');
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
}