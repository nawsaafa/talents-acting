import { Container } from '@/components/layout';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Container className="max-w-md w-full">{children}</Container>
    </div>
  );
}
