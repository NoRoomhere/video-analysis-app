// Type declarations for modules that don't have @types packages
declare module 'framer-motion' {
  import { ComponentProps, ComponentType, ReactNode } from 'react';
  
  export interface MotionProps {
    children?: ReactNode;
    [key: string]: any;
  }
  
  export const motion: {
    div: ComponentType<MotionProps>;
    span: ComponentType<MotionProps>;
    button: ComponentType<MotionProps>;
    a: ComponentType<MotionProps>;
    img: ComponentType<MotionProps>;
    [key: string]: ComponentType<MotionProps>;
  };
  
  export const AnimatePresence: ComponentType<{ 
    children: ReactNode;
    mode?: 'sync' | 'wait' | 'popLayout';
  }>;
}

declare module 'recharts' {
  import { ComponentProps, ComponentType, ReactNode } from 'react';
  
  export const LineChart: ComponentType<any>;
  export const Line: ComponentType<any>;
  export const XAxis: ComponentType<any>;
  export const YAxis: ComponentType<any>;
  export const CartesianGrid: ComponentType<any>;
  export const Tooltip: ComponentType<any>;
  export const ResponsiveContainer: ComponentType<any>;
  export const PieChart: ComponentType<any>;
  export const Pie: ComponentType<any>;
  export const Cell: ComponentType<any>;
}

declare module 'clsx' {
  const clsx: (...args: any[]) => string;
  export default clsx;
  export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];
}

declare module 'tailwind-merge' {
  const twMerge: (...args: any[]) => string;
  export { twMerge };
}

declare module '@stripe/stripe-js' {
  export function loadStripe(publishableKey: string): Promise<any>;
}

declare module 'file-saver' {
  export function saveAs(data: Blob | string, filename?: string, options?: any): void;
}

// Global type declarations
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}
