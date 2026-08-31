# Padrão de Código — Projeto React

**Stack:** React + TypeScript + Tailwind CSS + Zustand
**Última atualização:** Agosto/2026

## Sumário

- [Padrão de Código — Projeto React](#padrão-de-código--projeto-react)
  - [Sumário](#sumário)
  - [1. Objetivo](#1-objetivo)
  - [2. Princípios SOLID](#2-princípios-solid)
    - [S — Single Responsibility Principle (Responsabilidade Única)](#s--single-responsibility-principle-responsabilidade-única)
    - [O — Open/Closed Principle (Aberto/Fechado)](#o--openclosed-principle-abertofechado)
    - [L — Liskov Substitution Principle (Substituição)](#l--liskov-substitution-principle-substituição)
    - [I — Interface Segregation Principle (Segregação de Interface)](#i--interface-segregation-principle-segregação-de-interface)
    - [D — Dependency Inversion Principle (Inversão de Dependência)](#d--dependency-inversion-principle-inversão-de-dependência)
  - [3. Estrutura de Pastas](#3-estrutura-de-pastas)
  - [4. Nomenclaturas](#4-nomenclaturas)
  - [5. Separação de Arquivos por Responsabilidade](#5-separação-de-arquivos-por-responsabilidade)
    - [Exemplo prático — feature de usuário](#exemplo-prático--feature-de-usuário)
  - [6. Padrões de Componentes](#6-padrões-de-componentes)
  - [7. TypeScript](#7-typescript)
  - [8. Gerenciamento de Estado (Zustand)](#8-gerenciamento-de-estado-zustand)
  - [9. Estilização (Tailwind)](#9-estilização-tailwind)
  - [10. Hooks Personalizados](#10-hooks-personalizados)
  - [11. Importações](#11-importações)
  - [12. Tratamento de Erros](#12-tratamento-de-erros)
  - [13. Performance](#13-performance)
  - [14. ESLint + Prettier](#14-eslint--prettier)
  - [15. Testes](#15-testes)
  - [16. Checklist de Code Review](#16-checklist-de-code-review)

---

## 1. Objetivo

Este documento define os padrões de codificação, nomenclatura e organização do projeto. O objetivo é garantir consistência entre desenvolvedores, facilitar code review e reduzir a curva de entrada de novos membros no time.

Princípios que guiam todas as decisões deste documento:

- **Componentes, hooks e funções pequenos.** Se não cabe confortavelmente numa tela sem rolar, provavelmente está fazendo mais de uma coisa.
- **SOLID, sem exceções.** Não é "quando der", é a régua usada em todo code review.
- **Um arquivo, um tipo de conteúdo.** Tipo/interface, lógica de negócio, store e componente nunca vivem juntos no mesmo arquivo.

Regra geral: **consistência > preferência pessoal**. Se este documento diz algo diferente do que você faria naturalmente, siga o documento (e proponha mudança via PR neste arquivo, se fizer sentido).

---

## 2. Princípios SOLID

SOLID nasceu em POO, mas se aplica muito bem a componentes, hooks e stores em React/TS. Todo PR é avaliado contra esses 5 princípios — isso não é opcional.

> Os exemplos abaixo às vezes juntam tipo e função no mesmo bloco de código só para facilitar a leitura didática. **Na prática, siga a separação de arquivos da seção 5** — cada snippet abaixo, no projeto real, é dividido em `.model.ts` + `.service.ts`/`.tsx` conforme o caso.

### S — Single Responsibility Principle (Responsabilidade Única)

Cada componente, hook, função ou store tem **um único motivo para mudar**.

```tsx
// ❌ Componente faz busca de dados, regra de negócio E renderização
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = { ...data, age: calculateAge(data.birthDate) };
        setUser(formatted);
      });
  }, [userId]);

  return <div>{user?.name} — {user?.age} anos</div>;
}

// ✅ Cada peça com uma responsabilidade
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userService.getById(userId).then(setUser);
  }, [userId]);

  return user;
}

function UserProfile({ userId }: { userId: string }) {
  const user = useUser(userId);
  if (!user) return null;

  return <div>{user.name} — {calculateAge(user.birthDate)} anos</div>;
}
```

Sinal de violação: você descreve o componente/hook usando "e" ("busca o usuário **e** formata a data **e** trata erro **e** renderiza a lista") — se precisa de "e", quebre em partes.

### O — Open/Closed Principle (Aberto/Fechado)

Um componente deve ser **extensível via composição/props**, sem precisar editar seu código interno a cada novo caso de uso.

```tsx
// ❌ Toda vez que surge uma variação, adiciona um novo if/flag
function Card({ title, hasHeader, hasFooter, footerType, isHighlighted }: CardProps) {
  return (
    <div className={isHighlighted ? 'border-blue-500' : 'border-gray-200'}>
      {hasHeader && <div>{title}</div>}
      <div>...</div>
      {hasFooter && footerType === 'actions' && <div>...ações...</div>}
      {hasFooter && footerType === 'info' && <div>...info...</div>}
    </div>
  );
}

// ✅ Extensível via composição (slots), fechado para modificação
function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-lg border', className)}>{children}</div>;
}
Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  return <div className="border-b p-4 font-semibold">{children}</div>;
};
Card.Footer = function CardFooter({ children }: { children: ReactNode }) {
  return <div className="border-t p-4">{children}</div>;
};

// Uso — novo caso de uso não exige tocar em Card.tsx
<Card className="border-blue-500">
  <Card.Header>Título</Card.Header>
  <Card.Footer><ActionButtons /></Card.Footer>
</Card>
```

Se você se pega adicionando mais um prop booleano a um componente que já tem 4+ props booleanos, é sinal de que falta composição.

### L — Liskov Substitution Principle (Substituição)

Variantes de um mesmo componente (ex: `IconButton` em relação a `Button`) devem poder substituir a base sem quebrar o contrato esperado por quem consome.

```tsx
// Contrato base
interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// ✅ CurrencyInput respeita o mesmo contrato — pode ser usado em qualquer
// lugar que espera InputFieldProps, sem surpresas de comportamento
function CurrencyInput({ value, onChange, disabled }: InputFieldProps) {
  return (
    <input
      value={formatCurrency(value)}
      onChange={(e) => onChange(parseCurrency(e.target.value))}
      disabled={disabled}
    />
  );
}
```

Se uma variante exige que o consumidor saiba "por dentro" que é diferente (ex: `onChange` às vezes recebe `string`, às vezes recebe `Event`, dependendo da variante), o contrato foi quebrado.

### I — Interface Segregation Principle (Segregação de Interface)

Não force um componente a receber props que ele não usa. Prefira várias interfaces pequenas a uma interface "canivete suíço".

```tsx
// ❌ Uma interface gigante — a maioria dos consumidores só usa 3 dos 10 campos
interface UserCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}

// ✅ Interfaces pequenas e específicas, compostas quando necessário
interface UserInfoProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface UserActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

function UserCard({ info, actions }: { info: UserInfoProps; actions?: UserActionsProps }) {
  return (
    <div>
      <UserInfo {...info} />
      {actions && <UserActions {...actions} />}
    </div>
  );
}
```

### D — Dependency Inversion Principle (Inversão de Dependência)

Componentes e hooks devem depender de **abstrações** (interfaces, funções injetadas), não de implementações concretas (um cliente HTTP específico, uma lib específica hardcoded lá dentro). Isso facilita troca de implementação e principalmente testes.

```tsx
// ❌ Hook depende diretamente do axios/fetch e da URL — impossível testar sem mockar rede
function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    axios.get('https://api.exemplo.com/users').then((res) => setUsers(res.data));
  }, []);
  return users;
}

// ✅ Hook depende de uma abstração (o serviço), não da implementação HTTP
// services/usuario.service.ts define o contrato — pode trocar axios por fetch,
// ou injetar um mock nos testes, sem tocar no hook
function useUsers(service: UsuarioService = usuarioService) {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    service.getAll().then(setUsers);
  }, [service]);
  return users;
}
```

Na prática, no dia a dia: chamadas de API sempre passam por `services/`, nunca `fetch`/`axios` direto dentro de componente ou hook de UI.

---

## 3. Estrutura de Pastas

Organização **por tipo** (components, hooks, pages...):

```
src/
├── assets/              # imagens, fontes, ícones estáticos
├── components/          # componentes reutilizáveis de UI
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.model.ts     # interface ButtonProps
│   │   └── index.ts
│   └── Modal/
├── hooks/               # hooks customizados reutilizáveis
│   └── useDebounce.hook.ts
├── pages/               # componentes de página/rota
│   ├── Home/
│   │   ├── Home.tsx
│   │   └── index.ts
│   └── Login/
├── stores/              # stores Zustand (lógica/estado)
│   ├── auth.store.ts           # exporta useAuthStore
│   └── cart.store.ts           # exporta useCartStore
├── services/            # chamadas à API / integrações externas
│   └── usuario.service.ts
├── models/              # tipos, interfaces e enums de domínio
│   └── usuario.model.ts
├── utils/               # funções utilitárias puras
│   └── formatCurrency.util.ts
├── constants/           # constantes globais
│   └── routes.constants.ts
├── routes/              # configuração de rotas
│   └── app.routes.ts
├── App.tsx
└── main.tsx
```

**Regras:**

- Cada componente com lógica não-trivial ou estilos próprios ganha sua própria pasta.
- Componentes muito simples (ex: um `Divider.tsx`) podem ficar como arquivo único direto em `components/`.
- Todo diretório de componente exporta via `index.ts` (barrel file), permitindo `import { Button } from '@/components/Button'` em vez de `.../Button/Button`.
- Não criar pastas "genéricas" tipo `common/`, `shared/`, `misc/` — se algo é compartilhado, ele já está em `components/`, `hooks/`, `utils/` etc. por definição.
- Se uma pasta de componente cresce (múltiplos subcomponentes internos), criar subpastas dentro dela em vez de um `ComponentGrande.tsx` monolítico — reflexo direto do SRP.
- **Tipos de domínio** (entidades usadas em várias partes do app, ex: `Usuario`, `Produto`) ficam em `models/`. **Tipos específicos de um componente** (ex: `ButtonProps`) ficam ao lado do componente, na própria pasta dele — nunca dentro do `.tsx`. Detalhes completos na seção 5.

---

## 4. Nomenclaturas

| Elemento | Convenção | Exemplo |
|---|---|---|
| Componentes (função) | `PascalCase` | `function UserCard()` |
| Hooks (função exportada) | `camelCase` com prefixo `use` | `useAuth`, `useFetchUsers` |
| Stores Zustand (hook exportado) | `camelCase` com prefixo `use` e sufixo `Store` | `useAuthStore` |
| Funções e variáveis | `camelCase` | `getUserData`, `isLoading` |
| Constantes globais | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Tipos e Interfaces | `PascalCase` | `type UserStatus`, `interface ApiResponse` |
| Enums | `PascalCase` (nome) + `PascalCase` (membros) | `enum OrderStatus { Pending, Paid }` |
| Pastas | `PascalCase` para componentes, `camelCase` para o resto | `Button/`, `hooks/` |
| Booleanos | prefixo `is`, `has`, `should`, `can` | `isVisible`, `hasError`, `shouldRender` |
| Handlers de evento | prefixo `handle` | `handleClick`, `handleSubmit` |
| Props de callback | prefixo `on` | `onClick`, `onSubmit` |
| CSS/classes customizadas (raro, com Tailwind) | `kebab-case` | `card-shadow` |

> Nomes de **arquivo** (com sufixos como `.model.ts`, `.service.ts`, `.store.ts`, `.hook.ts`) seguem uma convenção própria, detalhada na seção 5 — essa tabela cobre apenas nomes de função/variável/tipo dentro do código.

**Interfaces vs Types:** usar `interface` para formatos de objeto que podem ser estendidos (ex: props de componentes, entidades de domínio); usar `type` para unions, intersections ou aliases simples.

```ts
// Props de componente → interface
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// Union / alias → type
type Status = 'idle' | 'loading' | 'success' | 'error';
```

---

## 5. Separação de Arquivos por Responsabilidade

Regra dura: **um arquivo nunca mistura tipo/interface com função, hook, store ou componente.** Cada arquivo carrega um único tipo de conteúdo, identificado pelo sufixo no nome.

| Conteúdo do arquivo | Sufixo | Pasta típica | Exemplo |
|---|---|---|---|
| Tipos, interfaces, enums | `.model.ts` | `models/` (domínio) ou junto do componente | `usuario.model.ts`, `Button.model.ts` |
| Regra de negócio / acesso a dados | `.service.ts` | `services/` | `usuario.service.ts` |
| Store Zustand | `.store.ts` | `stores/` | `cart.store.ts` |
| Hook customizado | `.hook.ts` | `hooks/` ou junto da feature | `useDebounce.hook.ts` |
| Função utilitária pura | `.util.ts` | `utils/` | `formatCurrency.util.ts` |
| Constantes | `.constants.ts` | `constants/` | `routes.constants.ts` |
| Configuração de rotas | `.routes.ts` | `routes/` | `app.routes.ts` |
| Componente React | sem sufixo — `PascalCase.tsx` | `components/`, `pages/` | `Button.tsx` |

Por quê: só de olhar o **nome** do arquivo, sem abrir o conteúdo, você já sabe o que vai encontrar lá dentro — e revisão de PR fica muito mais rápida. Isso também força a separação de responsabilidades (reforça o SRP da seção 2): se um arquivo "quer" ter dois sufixos ao mesmo tempo (ex: parece um `.service.ts` mas também define tipos que deveriam estar em `.model.ts`), é sinal de que precisa virar dois arquivos.

### Exemplo prático — feature de usuário

```
src/
├── models/
│   └── usuario.model.ts       # interface Usuario, type UsuarioStatus
├── services/
│   └── usuario.service.ts     # getById(), update() — usa usuario.model.ts
├── stores/
│   └── usuario.store.ts       # useUsuarioStore — usa usuario.model.ts
├── hooks/
│   └── useUsuario.hook.ts     # hook que orquestra service + store
└── components/
    └── UserCard/
        ├── UserCard.tsx        # só JSX + lógica de apresentação
        ├── UserCard.model.ts   # interface UserCardProps
        └── index.ts
```

```ts
// models/usuario.model.ts
export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export type UsuarioStatus = 'ativo' | 'inativo' | 'pendente';
```

```ts
// services/usuario.service.ts
import type { Usuario } from '@/models/usuario.model';

export const usuarioService = {
  async getById(id: string): Promise<Usuario> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },
};
```

```ts
// components/UserCard/UserCard.model.ts
export interface UserCardProps {
  nome: string;
  email: string;
  onSelect?: (id: string) => void;
}
```

```tsx
// components/UserCard/UserCard.tsx
import type { UserCardProps } from './UserCard.model';

export function UserCard({ nome, email, onSelect }: UserCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="font-semibold">{nome}</p>
      <p className="text-sm text-gray-500">{email}</p>
    </div>
  );
}
```

**Regra de dependência entre camadas:** o arquivo `.model.ts` nunca importa de `.service.ts`, `.store.ts`, `.hook.ts` ou componente — isso evitaria dependência circular. A direção é sempre "de fora pra dentro":

```
componente → hook → service / store → model
```

Um `.model.ts` só pode importar de outro `.model.ts`.

---

## 6. Padrões de Componentes

- Sempre **componentes funcionais** com arrow function ou `function`, nunca classes.
- Um componente por arquivo. Um componente, uma responsabilidade (SRP — seção 2).
- Props sempre tipadas via `interface` com sufixo `Props`, definida em um arquivo `.model.ts` **separado**, ao lado do componente — nunca dentro do `.tsx` (ver seção 5).
- Desestruturar props diretamente na assinatura da função.

```ts
// UserCard.model.ts
export interface UserCardProps {
  name: string;
  email: string;
  onSelect?: (id: string) => void;
}
```

```tsx
// UserCard.tsx
import type { UserCardProps } from './UserCard.model';

export function UserCard({ name, email, onSelect }: UserCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">{email}</p>
    </div>
  );
}
```

**Limites de tamanho (regra dura, não sugestão):**

- **Máximo ~80 linhas por componente** (JSX + lógica local, sem contar imports). Passou disso: extraia subcomponente, hook ou função utilitária.
- **Máximo ~4-5 props diretas** numa interface. Mais que isso, agrupe em objetos (`info`, `actions`, `config`) — ver ISP na seção 2.
- **Máximo 1 responsabilidade visual por componente.** Se o JSX tem 2+ blocos claramente distintos (ex: um cabeçalho complexo + uma lista complexa), cada bloco vira seu próprio componente.
- Zero lógica de negócio dentro do JSX/render. Cálculo, formatação e regra de negócio vivem em `utils/`, hooks ou `services/` — o componente só orquestra e renderiza.
- Zero `fetch`/`axios` direto dentro de componente — sempre via `services/` (DIP).

Esses limites não são arbitrários: eles são a forma prática de forçar SRP no dia a dia. Se um componente "precisa" passar de 80 linhas, isso quase sempre significa que ele tem mais de uma responsabilidade escondida.

---

## 7. TypeScript

- `strict: true` obrigatório no `tsconfig.json`.
- **Proibido usar `any`.** Se o tipo é realmente desconhecido, usar `unknown` e fazer narrowing.
- Evitar `as` (type assertion) — preferir validação/guard de tipo. Exceção: tipagem de eventos do DOM.
- Sempre tipar o retorno de funções exportadas/reutilizáveis.
- Usar tipos utilitários do TS (`Partial`, `Pick`, `Omit`, `Record`) em vez de redefinir tipos manualmente.
- Interfaces pequenas e específicas por padrão (reflexo do ISP) — evite uma `interface` com mais de ~6-7 campos; se crescer além disso, provavelmente está descrevendo mais de um conceito.
- Todo tipo/interface/enum vive em um arquivo `.model.ts` próprio — nunca junto da função ou componente que o usa (seção 5).

```ts
// ❌ Evitar
function getUser(id: any): any { ... }

// ✅ Preferir
function getUser(id: string): Promise<Usuario> { ... }

// ✅ Reaproveitar tipos
type UsuarioPreview = Pick<Usuario, 'id' | 'nome' | 'email'>;
```

---

## 8. Gerenciamento de Estado (Zustand)

- Um store por domínio (ex: `useAuthStore`, `useCartStore`), nunca um store global "gigante" — SRP também vale para stores.
- A **interface do estado** vive em `.model.ts`; o arquivo `.store.ts` só contém a implementação (ver seção 5).
- Ações (funções que alteram o estado) ficam dentro do próprio store, não fora.
- Usar seletores para evitar re-renders desnecessários (não desestruturar o store inteiro em componentes grandes).
- Se um store cresce muito (muitas ações, muitos campos não relacionados), é sinal de SRP violado: divida em stores menores por sub-domínio.

```ts
// models/cart.model.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}
```

```ts
// stores/cart.store.ts
import { create } from 'zustand';
import type { CartState } from '@/models/cart.model';

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
}));
```

```tsx
// ❌ Evitar: re-renderiza sempre que qualquer campo do store muda
const { items, addItem, removeItem } = useCartStore();

// ✅ Preferir: seletor específico
const items = useCartStore((state) => state.items);
const addItem = useCartStore((state) => state.addItem);
```

- Estado que é **local a um único componente** (ex: campo de formulário, toggle de modal) continua com `useState` — Zustand é para estado global/compartilhado, não substitui estado local.

---

## 9. Estilização (Tailwind)

- Classes Tailwind direto no JSX. Evitar CSS customizado, exceto casos que o Tailwind realmente não cobre.
- Para condicional de classes, usar `clsx` (ou `cn`, um helper que combina `clsx` + `tailwind-merge`):

```tsx
import { cn } from '@/utils/cn.util';

<button
  className={cn(
    'rounded-md px-4 py-2 font-medium',
    variant === 'primary' && 'bg-blue-600 text-white',
    variant === 'secondary' && 'bg-gray-100 text-gray-900',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
/>
```

- **Ordem recomendada das classes** (facilita leitura e evita divergência entre devs): layout → posicionamento → box model → tipografia → cores/fundo → efeitos → estados (`hover:`, `focus:`, `disabled:`) → responsivo (`sm:`, `md:`, `lg:`).
- Recomenda-se instalar o plugin `prettier-plugin-tailwindcss`, que ordena as classes automaticamente ao salvar — remove essa discussão da equipe.
- Extrair para um componente (ex: `Button`) quando o mesmo conjunto de classes se repete em 3+ lugares, em vez de copiar/colar classes.
- Não usar `style={{ ... }}` inline a menos que o valor seja dinâmico e não expressável via classe (ex: `width` calculado em JS).

---

## 10. Hooks Personalizados

- Todo hook começa com `use` no nome da função exportada.
- Arquivo do hook segue o sufixo `.hook.ts` (ex: `useDebounce.hook.ts`) — ver seção 5.
- Um hook = uma responsabilidade clara (SRP). Evitar hooks "canivete suíço" que buscam dados, validam formulário e controlam UI ao mesmo tempo.
- **Máximo ~40-50 linhas por hook.** Passou disso, quase sempre há uma segunda responsabilidade escondida — extraia outro hook.
- Se o hook precisa de um tipo próprio para o retorno (ex: `UseAuthResult`), esse tipo vai para um `.model.ts` ao lado, nunca dentro do `.hook.ts`.
- Hooks reutilizáveis em mais de uma feature vão para `src/hooks/`; hooks específicos de uma página/feature podem ficar dentro da própria pasta da feature.
- Sempre retornar objeto nomeado quando houver mais de 2 valores (facilita leitura no consumo):

```ts
// ❌ Evitar com muitos valores
return [data, loading, error, refetch];

// ✅ Preferir
return { data, loading, error, refetch };
```

---

## 11. Importações

Ordem padronizada, com linha em branco entre grupos:

```ts
// 1. Bibliotecas externas
import { useState } from 'react';
import { create } from 'zustand';

// 2. Imports internos absolutos (alias @/)
import { Button } from '@/components/Button';
import { useAuthStore } from '@/stores/auth.store';

// 3. Imports relativos (mesma feature/pasta)
import { UserAvatar } from './UserAvatar';

// 4. Tipos (sempre de arquivos .model.ts)
import type { Usuario } from '@/models/usuario.model';

// 5. Estilos/assets (se houver)
import logo from '@/assets/logo.svg';
```

- Configurar alias `@/` apontando para `src/` no `tsconfig.json` e no bundler (Vite/Webpack) — evita `../../../../components/Button`.
- Usar `import type` para imports que são só de tipo (fica explícito e ajuda o bundler a otimizar).

---

## 12. Tratamento de Erros

- Chamadas assíncronas (API) sempre em `try/catch`, nunca deixando promise rejeitada sem tratamento.
- Erros de UI (ex: componente que falha ao renderizar) cobertos por `ErrorBoundary` nos pontos de entrada principais (ex: por página).
- Mensagens de erro para o usuário devem ser amigáveis; detalhes técnicos vão para `console.error` ou serviço de logging, não para a tela.

```ts
// services/usuario.service.ts
import type { Usuario } from '@/models/usuario.model';

export async function getUsuario(id: string): Promise<Usuario> {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('[usuarioService] falha ao buscar usuário', error);
    throw new Error('Não foi possível carregar os dados do usuário.');
  }
}
```

---

## 13. Performance

Regra geral: **não otimizar prematuramente**. `useMemo`, `useCallback` e `React.memo` têm custo próprio — só usar quando houver um problema real (renders visivelmente lentos, listas grandes, referência de função quebrando memoização de filho).

Usar quando:

- `useMemo`: cálculo pesado (ex: filtro/ordenação de lista grande) que não precisa rodar em todo render.
- `useCallback`: função passada como prop para um componente memoizado (`React.memo`), evitando quebrar a memoização.
- `React.memo`: componente que recebe as mesmas props com frequência e tem render custoso (ex: item de lista grande).

Não usar apenas "por padrão" em todo componente/função — isso poluí o código sem ganho real. Componentes pequenos e bem separados (seção 6) já reduzem boa parte da necessidade de memoização manual, porque cada peça re-renderiza de forma mais previsível.

---

## 14. ESLint + Prettier

Configuração recomendada para o projeto (a implementar):

**Prettier** (`.prettierrc`):
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**ESLint** — base recomendada:
- `eslint:recommended`
- `@typescript-eslint/recommended`
- `eslint-plugin-react-hooks` (obrigatório — pega erros de dependências de `useEffect`/`useCallback`)
- `eslint-plugin-react` (regras de JSX)
- Integração com Prettier via `eslint-config-prettier` (desativa regras de estilo do ESLint que conflitam com o Prettier)

Regras adicionais sugeridas:
- `no-unused-vars`: erro
- `@typescript-eslint/no-explicit-any`: erro
- `react-hooks/exhaustive-deps`: erro (não ignorar o warning de dependências de hooks)
- `import/order`: erro, com os grupos definidos na seção 11
- `import/no-cycle`: erro — evita dependência circular entre `model`/`service`/`store`/`hook`/componente (ver seção 5)
- `max-lines-per-function`: warning configurado em ~80 linhas — reforça no lint o limite de tamanho da seção 6
- `complexity` (complexidade ciclomática): warning configurado em ~10 — ajuda a pegar funções que, mesmo curtas, fazem muitas coisas ao mesmo tempo

A separação por sufixo de arquivo (seção 5) não tem uma regra de ESLint pronta que garanta 100% automaticamente — é reforçada principalmente via code review (seção 16).

Rodar lint e format automaticamente antes de cada commit via `husky` + `lint-staged`, para nunca depender de "lembrar de rodar manualmente".

---

## 15. Testes

O projeto ainda não tem testes — recomendação para quando começar:

- **Vitest + React Testing Library** (mais leve e já integrado ao Vite, se for o bundler do projeto; troque por Jest se o projeto usar outro bundler sem suporte nativo ao Vitest).
- Nome do arquivo de teste: `Componente.test.tsx` ou `nome.service.test.ts`, ao lado do arquivo testado (mesmo sufixo do arquivo original + `.test`).
- Testar **comportamento**, não implementação: preferir `getByRole`/`getByText` a `getByTestId` sempre que possível.
- Componentes/hooks/services pequenos e com responsabilidade única (seção 6) são, por construção, muito mais fáceis de testar — se um teste está difícil de escrever, geralmente é sinal de que o arquivo faz mais de uma coisa. Arquivos `.model.ts` (só tipos) normalmente não precisam de teste próprio.
- Prioridade de cobertura ao começar: `.service.ts` e `.store.ts` primeiro (mais fácil, maior retorno, sem precisar montar componente), depois componentes de UI críticos, depois fluxos de página.

```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('chama onClick ao clicar', () => {
  const onClick = vi.fn();
  render(<Button label="Enviar" onClick={onClick} />);

  fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));

  expect(onClick).toHaveBeenCalledTimes(1);
});
```

---

## 16. Checklist de Code Review

Antes de abrir/aprovar um PR, verificar:

- [ ] Sem `any` no código novo
- [ ] Sem `console.log` esquecido
- [ ] Nomes seguem a convenção da seção 4
- [ ] **Nenhum arquivo mistura interface/type com função, hook, store ou componente** (seção 5)
- [ ] Nome do arquivo usa o sufixo correto (`.model.ts`, `.service.ts`, `.store.ts`, `.hook.ts`, `.util.ts`, `.constants.ts`)
- [ ] Nenhum componente passa de ~80 linhas / nenhum hook passa de ~40-50 linhas
- [ ] Nenhuma interface de props com mais de ~4-5 campos sem agrupamento
- [ ] Componente/hook/service tem uma única responsabilidade clara (SRP)
- [ ] Novas variações foram feitas via composição/props, não via novo `if`/flag interno (OCP)
- [ ] Sem `fetch`/`axios` direto em componente ou hook de UI — sempre via `services/` (DIP)
- [ ] Sem lógica de negócio pesada dentro do JSX
- [ ] Classes Tailwind organizadas (rodou o Prettier?)
- [ ] Seletores do Zustand usados corretamente (sem desestruturar o store inteiro sem necessidade)
- [ ] Erros de chamadas assíncronas tratados
- [ ] `useEffect`/`useCallback` com array de dependências correto (sem warning do ESLint)
- [ ] Nenhum código comentado/morto deixado no PR