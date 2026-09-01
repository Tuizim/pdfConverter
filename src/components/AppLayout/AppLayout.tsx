import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.constants';
import logo from '@/assets/logo.svg';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to={ROUTES.home} className="flex items-center gap-2.5">
            <img src={logo} alt="Meu Filho Resolve" className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight">
              <span className="text-gray-900">Meu Filho </span>
              <span className="text-brand-600">Resolve</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:py-12">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-gray-500">
          Feito com carinho, para facilitar sua vida.
        </div>
      </footer>
    </div>
  );
}
