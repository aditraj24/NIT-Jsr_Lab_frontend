'use client';

import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Navbar from '@/components/Navbar/navbar';
import { MobileNavbar } from '@/components/MobileNavbar/mobileNavbar';

export default function LayoutClient({ children }) {
  const { isAdminLoggedIn, isLoading } = useAdminAuth();

  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <>
      {!isAdminLoggedIn && (
        <>
          <MobileNavbar />
          <Navbar />
        </>
      )}
      <main className="min-h-screen">{children}</main>
    </>
  );
}
