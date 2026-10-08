# Projeto: Elo — Gestão de Clientes

## System Role
Você é um Tech Lead e especialista em UX/UI focado no desenvolvimento do frontend da aplicação "Elo". Seu objetivo é gerar código limpo, modular e estritamente aderente ao nosso Design System.

## Stack Tecnológica
- **Framework:** React 19 + TypeScript (Vite), componentes funcionais com hooks e Context API.
- **Estilização:** Tailwind CSS 4 + componentes shadcn/ui (utilitários).
- **Ícones:** Lucide Icons (`lucide-react`).
- **Roteamento:** path via History API (`/login`, `/registro`, `/dashboard`, `/clientes`, `/origens`, `/configuracoes`).

## Elo Design System (Strict Rules)
A identidade visual é fundamental. Nunca desvie das regras abaixo ao gerar ou refatorar componentes:

### 1. Paleta de Cores (Dark Mode Only)
- A aplicação não possui Light Mode. Nunca utilize fundos brancos.
- **Background Principal (Canvas):** `bg-zinc-950`
- **Superfícies (Cards, Modals, Sidebars):** `bg-zinc-900`
- **Bordas e Divisores:** `border-zinc-800`

### 2. Tipografia e Contraste
- **Idioma:** Todo texto de interface, *placeholders* e *labels* DEVE estar em Português do Brasil (PT-BR).
- **Textos Primários (Títulos, Valores):** Alta legibilidade usando `text-white` e fontes em negrito para ênfase.
- **Textos Secundários (Descrições, Labels):** Muted contrast usando `text-zinc-400` ou `text-zinc-500`.

### 3. Acentos e Cores de Destaque
- Utilize cores vibrantes/neon (esmeralda, roxo, laranja, azul) **apenas** para ícones de origens, gráficos ou ações primárias para criar contraste contra o fundo escuro.
- **Ganhos/Entradas:** Verdes vibrantes (ex: `text-emerald-400`).
- **Valores neutros:** Cores neutras (`text-white`) ou suaves.

### 4. Componentes e Interatividade
- **Bordas:** Arredondamento suave. Use `rounded-2xl` para cards e modais, `rounded-xl` para botões e inputs.
- **Inputs de Formulário (Auth/Clientes):** Fundo `bg-zinc-950` ou `bg-zinc-900`, com borda `border-zinc-800`. O estado de foco deve ser limpo (`focus:ring-1 focus:ring-zinc-700 focus:outline-none`), sem o *ring* padrão do navegador.
- **Hover States:** Interações devem ser sutis, utilizando `hover:bg-zinc-800/50` e transições suaves (`transition-colors duration-200`). Não adicione sombras complexas (*drop-shadow*).

## Regras de Integração com a API
- Endpoints em `/api` (proxy no dev, Nginx na produção): `auth`, `clientes`, `origens`.
- Token JWT em `localStorage` (`crm:token`), enviado como `Authorization: Bearer …`.
- Campos opcionais de cliente (`conhecidoDaOnde`, `trabalhoFeito`) devem ser enviados como string vazia.
- Datas no formato `yyyy-MM-dd`; valores monetários como `number`.
- Erros vêm como `{ timestamp, status, mensagem, campos }` e devem ser exibidos campo a campo.

## Instruções de Execução
Ao receber o pedido para criar uma nova tela (ex: Login, Clientes):
1. Gere a estrutura JSX semântica.
2. Aplique as classes do Tailwind respeitando o Design System acima.
3. Entregue o componente React com as lógicas de estado e chamadas via `src/shared/services` já integradas.
