'use client';
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="max-w-[2520px] mx-auto  md:px-9 sm:px-2 px-4 border-b-[1px]">
      {children}
    </div>
  );
};

export default Container;
