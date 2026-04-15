import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';

const MainLayout = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
