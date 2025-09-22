'use client';

import React from 'react';
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
      </SidebarProvider>
    </CategoryProvider>
  );
};

export default ClientLayout;
