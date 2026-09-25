import { Logo } from '@/components/logo';
import { DemoBanner } from '@/components/demo-banner';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <DemoBanner />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[640px] -translate-x-1/2 rounded-full bg-brand/10 blur-[110px]" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mb-8">
          <Logo size="lg" />
        </div>
        <div className="card w-full max-w-md p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
