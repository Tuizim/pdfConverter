import { MergeIcon, SplitPagesIcon, SplitSizeIcon } from '@/components/icons';
import { ToolCard } from '@/components/ToolCard';
import { ROUTES } from '@/constants/routes.constants';

export function Home() {
  return (
    <div className="flex flex-col gap-10">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Meu Filho Resolve
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-gray-600 sm:mx-0">
          Ferramentas simples para mexer em PDF. Escolha o que você precisa e pronto.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ToolCard
          to={ROUTES.mergePdf}
          title="Juntar PDFs"
          description="Combine vários arquivos PDF em um só, na ordem que você quiser."
          icon={<MergeIcon className="h-full w-full" />}
        />
        <ToolCard
          to={ROUTES.splitByPages}
          title="Dividir por páginas"
          description="Extraia páginas específicas, divida a cada N páginas ou selecione manualmente."
          icon={<SplitPagesIcon className="h-full w-full" />}
        />
        <ToolCard
          to={ROUTES.splitBySize}
          title="Dividir por tamanho máximo"
          description="Divida um PDF grande em vários arquivos, cada um abaixo do limite que você definir."
          icon={<SplitSizeIcon className="h-full w-full" />}
        />
      </div>
    </div>
  );
}
