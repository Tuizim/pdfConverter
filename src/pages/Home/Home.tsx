import { ToolCard } from '@/components/ToolCard';
import { ROUTES } from '@/constants/routes.constants';

export function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ferramentas de PDF</h1>
        <p className="mt-1 text-gray-600">
          Tudo roda no seu navegador. Nenhum arquivo é enviado para servidor nenhum.
        </p>
      </div>
      <ToolCard
        to={ROUTES.mergePdf}
        title="Juntar PDFs"
        description="Combine vários arquivos PDF em um só, na ordem que você quiser."
      />
      <ToolCard
        to={ROUTES.splitByPages}
        title="Dividir por páginas"
        description="Extraia páginas específicas, divida a cada N páginas ou selecione manualmente."
      />
      <ToolCard
        to={ROUTES.splitBySize}
        title="Dividir por tamanho máximo"
        description="Divida um PDF grande em vários arquivos, cada um abaixo do limite que você definir."
      />
    </div>
  );
}
