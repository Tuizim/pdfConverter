import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@/components/icons';
import type { ToolCardProps } from './ToolCard.model';

export function ToolCard({ to, title, description, icon }: ToolCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
        <span className="h-6 w-6">{icon}</span>
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{description}</p>
      </div>
      <span className="flex items-center gap-1 text-sm font-medium text-brand-600">
        Usar ferramenta
        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
