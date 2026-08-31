import { lazy, Suspense, type ReactElement } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { ROUTES } from '@/constants/routes.constants';

const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })));
const MergePdf = lazy(() => import('@/pages/MergePdf').then((m) => ({ default: m.MergePdf })));
const SplitByPages = lazy(() =>
  import('@/pages/SplitByPages').then((m) => ({ default: m.SplitByPages })),
);
const SplitBySize = lazy(() =>
  import('@/pages/SplitBySize').then((m) => ({ default: m.SplitBySize })),
);

function withSuspense(element: ReactElement): ReactElement {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Carregando…</div>}>
      {element}
    </Suspense>
  );
}

function routePath(path: string): string {
  return path.replace(/^\//, '');
}

export const appRouter = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: routePath(ROUTES.mergePdf), element: withSuspense(<MergePdf />) },
      { path: routePath(ROUTES.splitByPages), element: withSuspense(<SplitByPages />) },
      { path: routePath(ROUTES.splitBySize), element: withSuspense(<SplitBySize />) },
    ],
  },
]);
