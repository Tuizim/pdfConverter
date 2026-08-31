import { RouterProvider } from 'react-router-dom';
import { appRouter } from '@/routes/app.routes';

export function App() {
  return <RouterProvider router={appRouter} />;
}
