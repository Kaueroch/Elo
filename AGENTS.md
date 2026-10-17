# Elo

> Contrato do projeto para o fluxo SDD. Gerado/atualizado por `/sdd-init`.
> Referência do contrato: `skills/using-sdd/references/agents-md-contract.md` (no plugin).

## Stack

- **Linguagem:** Java 17 (back) + TypeScript ~5.8 (front)
- **Framework:** Spring Boot 4.1 + JPA/Security (back) · React 19 + Vite 6 + Tailwind 4 + shadcn/ui (front)
- **Build/package:** Maven (back) + npm (front)
- **Banco:** PostgreSQL 16 via Docker Compose (`crm_kauezao`, schema em `Back-end/clientes/src/main/resources/db/schema_clientes.sql`)

## Gate de qualidade

### Gate iterativo (por task)

- lint/compile: `cd Front-End && npm run lint` (`tsc --noEmit`)
- testes: `cd Back-end/clientes && mvn test`
- build: `cd Front-End && npm run build` (`vite build`)

### Gate completo (antes de merge)

- `cd Back-end/clientes && mvn test` + `cd Front-End && npm run lint && npm run build`

### Teste único (debug)

- `cd Back-end/clientes && mvn test -Dtest=NomeDaClasse` <!-- padrão Maven; confirmar classe ao usar -->

## Issue tracker

- **Plataforma:** GitHub Issues
- **URL base:** https://github.com/Kaueroch/CRM-kauezao
- **Como ler:** `gh issue view <numero>` <!-- confirmar disponibilidade do gh neste ambiente; specs atuais usam `issue: N/A` -->

## Branches Git

- **Branch base:** `main`
- **Convenção:** `{tipo}/{slug}` (ex.: `feat/cobrancas`); sem issue key formal — specs usam `issue: N/A`
- **Plataforma de MR/PR:** GitHub
- **Título MR/PR:** `{tipo}/{slug}` (ex.: `feat/cobrancas`)

## Integrações externas

| Integração | TDD por padrão? | Notas |
|------------|-----------------|-------|
| PostgreSQL 16 (Docker, `crm_kauezao`) | fora | Contrato SQL/JPA; testar via `mvn test` existente |
| Auth JWT + BCrypt (`TOKEN_SECRET`, `TOKEN_EXPIRATION_SECONDS`) | fora | `Authorization: Bearer …`, `localStorage (crm:token)`; 401 derruba sessão |
| SMTP genérico via env (futuro: `MAIL_HOST/PORT/USER/PASS/FROM`) | fora | Ainda sem `spring-boot-starter-mail`; specs de cobranças/verificação dependem dele |
| Docker Compose (postgres + backend + frontend) | fora | `docker compose up -d --build`; portas via `.env` |

## Restrições padrão

- Erro da API sempre no formato `{ timestamp, status, mensagem, campos }`; `campos` aponta o input exato no front
- Postgres: `BIGINT GENERATED ALWAYS AS IDENTITY`, texto com `TEXT` + `CHECK` (nunca `VARCHAR(n)`), datas com `DATE`/`TIMESTAMPTZ` (nunca `TIMESTAMP` sem TZ), valores em `NUMERIC` (nunca float)
- Segredos só via env (`.env`, nunca no repo); e-mail nunca expõe token/código em claro
- Não quebrar auth atual: rotas fora de `/api/auth/*` e `/api/health` exigem JWT; conta pertence ao usuário (filtrar por dono)
- Front dark-only (`bg-zinc-950`/`bg-zinc-900`/`border-zinc-800`); todo texto PT-BR — ver `Front-End/RULES_IA.md`

## Convenção de pastas (specs)

```
specs/
├── templates/                 # scaffoldado pelo /sdd-01-new
├── implementation-log.md      # log global
└── YYYY-MM-{ISSUE-KEY}-slug/
    ├── spec.md
    ├── design.md              # opcional
    ├── tasks.md               # opcional (≥ 5 tasks)
    ├── executions.md
    ├── mr-template.md         # preenchido em /sdd-08-docs
    └── issue-summary.md
```

## Mapa de research (As Is)

| Área | Caminhos |
|------|----------|
| Back clientes/origens | `Back-end/clientes/src/main/java/com/CRM/clientes/domain/`, `services/clientes/`, `controllers/` |
| Back auth/usuários | `Back-end/clientes/src/main/java/com/CRM/clientes/.../autenticacao/`, `domain/Usuario.java`, `infra/security/` |
| Back deps/schema | `Back-end/clientes/pom.xml`, `Back-end/clientes/src/main/resources/db/` |
| Front rotas/shell | `Front-End/src/App.tsx` (`TAB_PATHS`, `Tab`), `Front-End/src/layout/` |
| Front telas | `Front-End/src/dashboard/`, `src/clientes/`, `src/origens/`, `src/agenda/`, `src/servicos/`, `src/profile/`, `src/landing/`, `src/auth/` |
| Front shared | `Front-End/src/shared/types/`, `src/shared/services/`, `src/shared/utils/formatters.ts`, `src/shared/constants/`, `src/crm/` |
| Front design system | `Front-End/RULES_IA.md`, `Front-End/src/index.css` |
| Specs/roadmap | `specs/README.md`, `specs/*/spec.md`, `docs/futuro.md` |

## Mapa de documentação

- `README.md` (subir stack, API, rotas da SPA)
- `docs/futuro.md` (resumo por feature; fonte de verdade do escopo: `specs/`)
- `specs/README.md` (índice das specs)
- `Front-End/RULES_IA.md` (design system do front)

## Feature flags

| Campo | Valor |
|-------|-------|
| **Mecanismo** | N/A (projeto não usa; specs marcam `feature_flag: nao`; futuro provável: env var) |
| **Convenção de nome** | N/A |
| **Default seguro** | N/A |
| **Path / registro no código** | N/A |

## ADR (opcional)

- **Path:** N/A
