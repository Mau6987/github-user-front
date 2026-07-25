import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Perfil de GitHub',
  description: 'Datos de perfil de GitHub obtenidos desde un backend NestJS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
