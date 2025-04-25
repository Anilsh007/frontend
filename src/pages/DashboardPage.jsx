import { Navigate } from 'react-router-dom';

export default function DashboardPage() {
  // You can add authentication checks here (e.g., check if the user is logged in)
  return <Navigate to="/dashboard/home" />;
}
