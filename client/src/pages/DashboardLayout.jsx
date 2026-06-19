import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div>
      <p>Dashboard</p>
      <Outlet />
    </div>
  );
}
