# Elo — Front-End

SPA do Elo: login e painel em tema escuro (preto e verde). Consome a API Spring Boot do monorepo.

## Interface

### Autenticação
Você cria conta ou entra. A raiz `/` abre o login.

### Dashboard
Você vê total ganho, clientes do mês, ticket médio e ganhos por origem.

### Clientes
Você busca e filtra por origem e mês. Você adiciona, edita e apaga.

### Origens
Você cadastra e apaga origens como Indicação e Instagram.

### Configurações
Você troca nome e senha, gerencia origens, exporta CSV e sai.

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **UI** | React 19 + TypeScript |
| **Build** | Vite 6 |
| **Estilização** | Tailwind CSS 4 + shadcn/ui |
| **Ícones** | Lucide React |
| **Gráficos** | Recharts |
| **Animações** | Motion (Framer Motion) |
| **Fonte** | Geist Variable |

## Executando Localmente

**Pré-requisitos:** Node.js 20+ e a API rodando (ver o README da raiz).

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o arquivo `.env` (utilize o `.env.example` como base):
   ```bash
   cp .env.example .env
   ```
   Em dev, `VITE_PROXY_TARGET` aponta para o backend (padrão `http://localhost:8080`).
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` (login em `/login`, registro em `/registro`).

### Build de produção

```bash
npm run build       # gera a pasta dist/ (usa VITE_API_URL)
npm run preview     # serve o build localmente
```

### Lint

```bash
npm run lint        # tsc --noEmit
```

### Docker

```bash
docker build -t elo-front .
docker run -p 3000:80 elo-front
# O nginx do container repassa /api para backend:8080
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server na porta 3000 (proxy `/api`) |
| `npm run build` | Build de produção (Vite) |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Type check (`tsc --noEmit`) |

## Estrutura de pastas

```
src/
├── auth/             # Login, registro e AuthContext
├── crm/              # CrmContext (clientes/origens) + ClienteFormContext
├── dashboard/        # Home do painel
├── clientes/         # Lista e formulário de clientes
├── origens/          # CRUD de origens
├── profile/          # Configurações do perfil
├── layout/           # Sidebar e header do painel
└── shared/           # Componentes, tipos, serviços e constantes
```

## Rotas

| Rota | Acesso | Tela |
|------|--------|------|
| `/` | público | Redireciona para `/login` |
| `/login` | público | Login |
| `/registro` | público | Registro |
| `/dashboard` | autenticado | Dashboard |
| `/clientes` | autenticado | Clientes |
| `/origens` | autenticado | Origens |
| `/configuracoes` | autenticado | Configurações |

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | Base URL da API (build de produção) | `/api` (proxy do Nginx) |
| `VITE_PROXY_TARGET` | Alvo do proxy em dev | `http://localhost:8080` |
