'use client';

import React from 'react';
import { CategoryProvider } from '@/contexts/CategoryContext';

type ClientLayoutProps = {
  children: React.ReactNode;
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <CategoryProvider>
      {children}
    </CategoryProvider>
  );
};

export default ClientLayout;
