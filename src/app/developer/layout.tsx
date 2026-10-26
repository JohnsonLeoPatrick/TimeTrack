import { DesktopGuard } from '@/components/layout/desktop-guard';

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopGuard theme="purple">
      <div className="app-light min-h-screen bg-slate-50 text-slate-900">
        {children}
      </div>
    </DesktopGuard>
  );
}
