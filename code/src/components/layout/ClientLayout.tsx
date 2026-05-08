'use client';

import React from 'react';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { SidebarProvider } from '@/contexts/SidebarContext';

type ClientLayoutProps = {
  children: React.ReactNode;
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <CategoryProvider>
      <SidebarProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </SidebarProvider>
    </CategoryProvider>
  );
};

export default ClientLayout;
