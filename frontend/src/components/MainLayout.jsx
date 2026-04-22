import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import WalkthroughTour from '../components/WalkthroughTour';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      <WalkthroughTour />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
