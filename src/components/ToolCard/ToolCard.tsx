import { Link } from 'react-router-dom';
import type { ToolCardProps } from './ToolCard.model';

export function ToolCard({ to, title, description }: ToolCardProps) {
  return (
    <Link
      to={to}
      className="rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </Link>
  );
}
