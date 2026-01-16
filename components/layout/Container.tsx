import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'main' | 'article';
}

export function Container({ children, className = '', as: Component = 'div' }: ContainerProps) {
  return <Component className={`container ${className}`.trim()}>{children}</Component>;
}
