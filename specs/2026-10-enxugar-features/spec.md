---
issue: N/A
tipo: feat
titulo: Enxugar features Beta e scaffolds
branch: feat/enxugar-features
tdd: false
tdd_integracao: fora
feature_flag: nao
status: specified
criado: 2026-10-16
autor: @kauezao
---

# Spec: Enxugar features Beta e scaffolds

## Metadados

| Campo | Valor |
|-------|-------|
| Issue | `N/A` |
| Tipo | feat |
| Branch | `feat/enxugar-features` (ver [sdd-branch.md](../templates/sdd-branch.md)) |
| TDD | `false` · integrações: `fora` (ver [sdd-tdd.md](../templates/sdd-tdd.md) e [AGENTS.md](../../AGENTS.md)) |
| Feature flag | `nao` (ver [AGENTS.md](../../AGENTS.md)) |
| Pasta | `specs/2026-10-enxugar-features/` |
| Status | specified |

**Tipos:** `feat` (feature/comportamento novo), `fix` (bug), `refactor`, `perf`, `chore`, `docs`.

## Por quê?

O Elo tem um núcleo funcional pequeno (clientes, origens, dashboard, auth) cercado de periferia sem backend: Agenda e Serviços em Beta com dados só em `localStorage`, Aparência e Notificações como scaffolds, e o grupo `Em breve` prometendo Cobranças/Notificações que ainda não existem. Essa superfície aumenta a manutenção e confunde a navegação. Enxugar (ocultar ou remover o que não tem uso real) antes de voltar a expandir.

## 1. As Is (Research)

### Contexto

O Elo tem núcleo funcional com backend real (clientes, origens, dashboard, auth) e periferia sem backend: Agenda e Serviços vivem em `localStorage` com badge `Beta`, Aparência e Notificações são scaffolds locais, e a sidebar promete Cobranças/Notificações no grupo `Em breve`. Nota de árvore: há mudanças de front não commitadas nesta branch (dashboard reestruturado, Clientes em lista com `Dialog`, Hero com ficha demo, `DashboardMockup.tsx` removido) — o As Is abaixo descreve os arquivos como estão no disco agora.

### Comportamento atual

- Navegação por path sem router (`Front-End/src/App.tsx`: `TAB_PATHS`, `Tab`): `/dashboard`, `/clientes`, `/origens`, `/agenda` (Beta), `/servicos` (Beta), `/configuracoes/*`.
- Sidebar (`Front-End/src/layout/AppSidebar.tsx`): `mainItems` (Painel, Clientes, Origens, Agenda+Beta), `negocioItems` (Serviços+Beta), `emBreveItems` desabilitados (Contas a pagar, Notificações) com texto de promessa, `configItems` (Perfil, Aparência, Notificações, Conta).
- Agenda (`Front-End/src/agenda/AgendaPage.tsx:18-20`): `TODO` de migração para `/api/agenda`; compromissos em `localStorage (crm:agenda)`; exclusão com `window.confirm`.
- Serviços (`Front-End/src/servicos/ServicosPage.tsx:19-20`): mesmo padrão, `localStorage (crm:servicos)` + `SEED` fixo de 2 itens; exclusão com `window.confirm`.
- Aparência (`Front-End/src/profile/ProfilePage.tsx:195-295`): `TODO` de aplicar o accent no CSS — a escolha salva só `crm:accent` + toast; tema claro desabilitado (`Em breve`).
- Notificações (`Front-End/src/profile/ProfilePage.tsx:348-418`): toggles em `localStorage (crm:notifs)`; 2 de 3 itens (`resumoSemanal`, `novidades`) marcados `Em breve`; `TODO` de sincronizar com backend/push.
- Conta (`Front-End/src/profile/ProfilePage.tsx:424-541`): atalhos para Origens/Agenda, exportar CSV, `limparLocais` com `window.confirm` apagando `crm:agenda` + `crm:servicos`, sair.
- Clientes × Origens duplicam o agrupamento por origem: `ClientesPage` (lista por origem, `Dialog` de exclusão + `Toast`) vs `OrigensPage` (cards por origem com `window.confirm`/`alert`, backend real via `useCrm`).
- Roadmap futuro (`docs/futuro.md`, `specs/2026-10-cobrancas/spec.md`, `specs/2026-10-verificacao-email/spec.md`): Cobranças Fase 1/2 e Verificação Fase 2 pendentes, ambas dependendo de SMTP.

### Arquivos e componentes relevantes

| Área | Caminho / componente | Papel |
|------|----------------------|-------|
| Front rotas | `Front-End/src/App.tsx` (`TAB_PATHS`, `Tab`, `getTabFromPath`) | Onde telas entram/saem da navegação |
| Front nav | `Front-End/src/layout/AppSidebar.tsx` (`mainItems`, `negocioItems`, `emBreveItems`, `configItems`) | Badges Beta, itens desabilitados, submenu de configurações |
| Front header | `Front-End/src/layout/SiteHeader.tsx` | Breadcrumb + atalhos (sino futuro entraria aqui) |
| Beta local | `Front-End/src/agenda/AgendaPage.tsx` (`crm:agenda`) | Compromissos sem backend |
| Beta local | `Front-End/src/servicos/ServicosPage.tsx` (`crm:servicos`, `SEED`) | Catálogo sem backend |
| Scaffold | `Front-End/src/profile/ProfilePage.tsx` (`AparenciaSection`, `NotificacoesSection`, `ContaSection`) | Accent local, toggles locais, atalhos/perigo |
| Núcleo real | `Front-End/src/dashboard/HomePage.tsx`, `src/clientes/ClientesPage.tsx`, `src/origens/OrigensPage.tsx` | Painel, CRUD de clientes e origens (backend real) |
| Núcleo shared | `Front-End/src/crm/`, `src/shared/services/`, `src/shared/constants/` | Contexto, chamadas API, cores de origem |
| Roadmap | `docs/futuro.md`, `specs/README.md` | Fases futuras e backlog pequeno |

### Lacunas do research

- [ ] Agenda e Serviços têm uso real (ocultar da nav vs remover código + chaves `crm:agenda`/`crm:servicos`)?
- [ ] Origens vira só filtro dentro de Clientes ou continua página própria?
- [ ] Aparência (accent local) e Notificações (toggles locais) ficam, somem, ou viram uma seção só?
- [ ] Grupo `Em breve` continua prometendo Cobranças/Notificações ou some até o backend existir?
- [ ] `ContaSection`: mantém atalho para Agenda e botão de apagar dados locais se as Betas saírem?
- [ ] Escopo único confirmado pelo dev em 2026-10-16 apesar de ≥2 subsistemas independentes (Agenda, Serviços, Aparência, Notificações, `Em breve`, Clientes×Origens) — rever em `/sdd-03-specify` se o To Be estourar

### Restrições observadas (rascunho para `/sdd-03-specify`)

- Não quebrar rotas do núcleo (`/dashboard`, `/clientes`, `/origens`, `/configuracoes/*`) nem o auth (JWT, 401 derruba sessão)
- Erro da API segue `{ timestamp, status, mensagem, campos }`; segredos só via env
- Front dark-only em PT-BR (`Front-End/RULES_IA.md`); remover telas exige remover/ajustar rotas em `App.tsx` + itens da sidebar + links que apontam para elas (`ContaSection`, `SiteHeader`)

---

## 2. To Be (Specify)

### Resumo

Remover do front as telas sem backend (Agenda, Serviços), as seções-scaffold (Aparência, Notificações) e o grupo `Em breve`: somem rotas, sidebar, código e chaves locais; Configurações fica só com Perfil + Conta.

### Goals

- [ ] Sidebar mostra só o núcleo com backend real (Painel, Clientes, Origens, Configurações com Perfil + Conta)
- [ ] Rotas `/agenda`, `/servicos`, `/configuracoes/aparencia` e `/configuracoes/notificacoes` deixam de existir (URL direta cai na home, sem quebrar)
- [ ] Nenhum código morto: páginas, chaves `localStorage`, atalhos e textos que apontavam para o removido somem junto
- [ ] Docs refletem a superfície real (README + `docs/futuro.md` sem os itens removidos)

### Critérios de sucesso

- [ ] Abrir `/agenda`, `/servicos`, `/configuracoes/aparencia` ou `/configuracoes/notificacoes` cai na home (`/dashboard`) sem tela em branco nem erro
- [ ] Sidebar sem badges `Beta`, sem grupo `Negócio`, sem grupo `Em breve` e sem submenu Aparência/Notificações
- [ ] `grep` por `agenda`, `servicos`, `aparencia`, `notificacoes`, `crm:accent` e `crm:notifs` em `Front-End/src` retorna zero ocorrência em código (só histórico de docs se citado)
- [ ] Gate completo verde: `cd Back-end/clientes && mvn test` e `cd Front-End && npm run lint && npm run build`

### Non-goals

- Mexer em Painel, Clientes, Origens, Auth, Landing ou no fluxo de verificação (Fase 1 entregue)
- Migrar ou preservar dados locais de Agenda/Serviços (descarte aceito pelo dev)
- Cobranças, sino de notificações, SMTP ou qualquer backend novo
- Reintroduzir Origens como filtro em Clientes (Origens continua página própria por decisão do dev)

### Restrições

- Rotas do núcleo intactas: `/dashboard`, `/clientes`, `/origens`, `/configuracoes/perfil`, `/configuracoes/conta`, `/configuracoes/verificar`, `/configuracoes/redefinir`
- Nenhum endpoint do back muda; nenhum contrato de erro muda (`{ timestamp, status, mensagem, campos }`)
- Front continua dark-only em PT-BR (`Front-End/RULES_IA.md`); remoção não pode deixar link/rota quebrada (tsc + revisão cobrem)
- Dados locais de Agenda/Serviços são descartados sem migração nem aviso prévio (decisão do dev em 2026-10-16)

### Abordagens consideradas

<!-- feat/refactor com decisão de design: 2–3 opções. fix trivial: "N/A — abordagem única" + justificativa. -->

| Opção | Prós | Contras | Escolha |
|-------|------|---------|---------|
| A — Remoção completa (rotas, sidebar, páginas, chaves locais, atalhos, docs) | Zero código morto; sidebar honesta; um PR só | Dados locais de Agenda/Serviços se perdem | Escolhida |
| B — Só ocultar da navegação (rotas e código continuam) | Reversível; sem perda de dados | Mantém peso morto e `TODO`s; promessa continua no código | Não |

**Recomendação do agente:** A — o dev já optou por "remover tudo" nas Betas e remover Aparência/Notificações/`Em breve`; ocultar manteria exatamente o inchaço que motivou a spec.

### Escopo da entrega

- **Decisão:** Uma spec só (dev optou por não fatiar em 2026-10-16, mesmo com ≥2 subsistemas independentes: Agenda, Serviços, Aparência, Notificações, `Em breve`, duplicação Clientes×Origens)
- **Justificativa:** Remoção coesa só de front, sem backend nem fases desacopladas; fatiar geraria PRs de deleção sem valor incremental entre eles. Se o To Be estourar no Plan, reabrir o fatiamento.

### Requisitos funcionais

1. Rotas `/agenda` e `/servicos` deixam de existir: remover de `TAB_PATHS`, do tipo `Tab` e do render em `Front-End/src/App.tsx`.
2. Sidebar sem Betas: remover `agenda` de `mainItems`, remover `negocioItems` (Serviços) e o grupo `Negócio` vazio em `Front-End/src/layout/AppSidebar.tsx`.
3. Apagar `Front-End/src/agenda/AgendaPage.tsx` e `Front-End/src/servicos/ServicosPage.tsx`; remover as chaves `crm:agenda` e `crm:servicos` do código.
4. Seções Aparência e Notificações deixam de existir: remover do tipo `ConfigSection`, de `CONFIG_SECTION_PATHS`, de `ProfilePage` e do submenu da sidebar; Configurações fica só com Perfil + Conta.
5. Grupo `Em breve` removido da sidebar (itens + texto de promessa).
6. `ContaSection` sem atalho para Agenda e sem botão de apagar dados locais (não há mais dados locais).
7. Docs atualizados: `README.md` (tabela de rotas, sem `/configuracoes/aparencia` e `/configuracoes/notificacoes`) e `docs/futuro.md` §4 (sem Tema claro, Resumo semanal e Novidades do Elo).

### Edge cases

| Cenário | Comportamento esperado |
|---------|------------------------|
| Usuário com dados em `crm:agenda`/`crm:servicos` | Descartados sem migração nem aviso (decisão do dev); chaves órfãs no navegador são inertes |
| Bookmark/URL direta em rota removida | Cai na home (`/dashboard`) pelo tratamento atual de rota desconhecida, sem tela em branco |
| F5 em `/configuracoes/aparencia` ou `/notificacoes` | Mesma queda para a home; sidebar sem marcar seção removida |
| Exportar CSV na Conta | Continua funcionando (dados de clientes vêm do backend, não afetados) |
| Back-end | Nenhum endpoint, tabela ou auth muda nesta spec |

### Revisão da spec (Specify)

- [x] Sem TBD / placeholders vagos em §2 e §4
- [x] Goals ↔ critérios de sucesso ↔ RF ↔ US alinhados
- [x] Restrições e non-goals sem contradição
- [x] Abordagem escolhida refletida no To Be
- [x] Escopo da entrega adequado (remoção só-front, coesa; reabrir fatiamento se estourar no Plan)

### Confirmação de entendimento

**Agente entendeu como:** remover por completo Agenda, Serviços (páginas, rotas, `localStorage`), seções Aparência e Notificações (Config fica Perfil + Conta) e o grupo `Em breve`; Origens continua página própria; dados locais descartados sem migração; back intacto; docs atualizados.

**Dev confirmou:** [x] Sim (2026-10-16)

---

## 3. Design

<!-- Se complexo: criar design.md (aprovação por blocos — ver design-template.md) e linkar aqui -->
<!-- Se simples: seção curta abaixo -->

### Decisões

| Decisão | Alternativas | Motivo |
|---------|--------------|--------|
| Remoção direta por arquivo/rota, sem camada de compatibilidade | Redirects ou aliases das rotas antigas | Rotas Beta/scaffold sem usuários garantidos; redirect manteria peso morto |
| Sem `design.md` separado | Fluxo incremental de design | Baixa complexidade: só deleção + ajuste de tipos/rotas/docs |

---

## 4. User stories

### US-01: Navegar sem as Betas

**Como** usuário **quero** ver na sidebar só Painel, Clientes, Origens e Configurações **para** não clicar em tela provisória.

**Critérios de aceite:**

- [ ] Sem itens Agenda/Serviços, sem badges `Beta`, sem grupo `Negócio`
- [ ] Abrir `/agenda` ou `/servicos` cai na home sem erro

### US-02: Configurações só com Perfil e Conta

**Como** usuário **quero** abrir só Perfil e Conta **para** não ajustar preferência que não faz efeito.

**Critérios de aceite:**

- [ ] Submenu da sidebar só com Perfil e Conta; rotas `/aparencia` e `/notificacoes` caem na home
- [ ] Conta sem atalho para Agenda e sem botão de apagar dados locais

### US-03: Sidebar sem promessas

**Como** usuário **quero** não ver o grupo `Em breve` **para** não esperar função que não existe.

**Critérios de aceite:**

- [ ] Sem `Contas a pagar`/`Notificações` desabilitados e sem texto de promessa na sidebar

### US-04: Docs honestos

**Como** dev **quero** README e `docs/futuro.md` sem os itens removidos **para** a doc refletir o app real.

**Critérios de aceite:**

- [ ] Tabela de rotas do README sem `/configuracoes/aparencia` e `/configuracoes/notificacoes`; §4 do futuro sem Tema claro, Resumo semanal e Novidades

---

## 5. Tasks

<!-- Se < 5 tarefas, listar aqui (mesmo rigor zero-context quando o tipo exigir). Se ≥ 5, usar tasks.md -->

> Quando o formato completo for obrigatório (`feat`/`refactor`/`perf`/`fix` multi-arquivo): incluir **Global Constraints**, **Mapa de arquivos**, **`plan_depth`**, e por task **Context pack** + **Interfaces** + **Steps** (ver `specs/templates/tasks-template.md` e `/sdd-04-plan` §4.0).

### Global Constraints

- ...

### Mapa de arquivos

| Path | Ação | Responsabilidade | Task |
|------|------|------------------|------|
| | | | |

### Profundidade (`plan_depth`)

| Campo | Valor |
|-------|-------|
| **plan_depth** | `snippets` \| `contracts` |
| **Critério** | ... |

### Task 01: Título

- **Entregável:** ...
- **Onde:** ...
- **Depende de:** —
- **Interfaces:** Consumes: … · Produces: …
- **DoD:** ...
- **Context pack / Steps:** (obrigatório conforme `/sdd-04-plan` §4.1)

---

## 6. Referências

- Issue: N/A
- Issue summary: `specs/2026-10-enxugar-features/issue-summary.md`
- Anexos versionados: apenas `.md` (demais formatos apenas referenciados no `issue-summary.md`)
- Docs: ver mapa em `AGENTS.md`
