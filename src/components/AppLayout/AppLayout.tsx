import { Link, Outlet } from 'react-router-dom';
import { PrivacyBadge } from '@/components/PrivacyBadge';
import { ROUTES } from '@/constants/routes.constants';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to={ROUTES.home} className="text-lg font-semibold text-gray-900">
            Ferramentas de PDF
          </Link>
          <PrivacyBadge />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
