---
issue: N/A
tipo: feat
titulo: Cobranças — contas a pagar com alerta por e-mail e no app
branch: feat/cobrancas
tdd: false
tdd_integracao: fora
feature_flag: nao
status: draft
criado: 2026-10-10
autor: @kauezao
---

# Spec: Cobranças — contas a pagar com alerta por e-mail e no app

## Metadados

| Campo | Valor |
|-------|-------|
| Issue | `N/A` |
| Tipo | feat |
| Branch | `feat/cobrancas` |
| TDD | `false` · integrações: `fora` |
| Feature flag | `nao` |
| Pasta | `specs/2026-10-cobrancas/` |
| Status | draft |

## Por quê?

O usuário perde contas que precisa pagar porque não há lugar no Elo para registrar vencimentos nem aviso antecipado. Cobranças resolve isso: cadastra a conta com data de vencimento, configura com quantos dias de antecedência quer ser lembrado e recebe alerta no app e por e-mail.

## 1. As Is (Research)

### Contexto

Hoje o Elo gerencia clientes atendidos, sem módulo financeiro. Não existe conta a pagar, vencimento, notificação ou envio de e-mail.

### Comportamento atual

- Back-end Spring Boot 4.1 + JPA + PostgreSQL. Entidades: `Cliente`, `Usuario`, `Origem`. Sem entidade de conta, sem scheduler, sem mail sender (`pom.xml` sem `spring-boot-starter-mail`).
- Front-end React 19: rotas `/dashboard`, `/clientes`, `/origens`, `/configuracoes` (+ `agenda`, `servicos` em Beta). Sidebar tem grupo `Em breve` com item `Cobranças` desabilitado (`Front-End/src/layout/AppSidebar.tsx`).
- Auth JWT em `localStorage` (`crm:token`); 401 derruba sessão.

### Arquivos e componentes relevantes

| Área | Caminho / componente | Papel |
|------|----------------------|-------|
| Back conta | `Back-end/clientes/src/main/java/com/CRM/clientes/domain/Cliente.java` | Padrão atual de entidade JPA a seguir |
| Back conta | `Back-end/clientes/src/main/java/com/CRM/clientes/services/clientes/ClienteService.java` | Padrão de service/validação a seguir |
| Back auth | `Back-end/clientes/src/main/java/com/CRM/clientes/domain/Usuario.java` | Dono da conta (tem `email` para alerta) |
| Back deps | `Back-end/clientes/pom.xml` | Sem mail/scheduler hoje |
| Front nav | `Front-End/src/layout/AppSidebar.tsx` | Item `Cobranças` hoje desabilitado |
| Front rotas | `Front-End/src/App.tsx` (`TAB_PATHS`, `Tab`) | Onde entra a rota `/cobrancas` |
| Shared | `Front-End/src/shared/types/index.ts` (`Tab`) | Tipo de aba a estender |

### Lacunas do research

- [ ] Provedor de e-mail: SMTP próprio, Gmail, Resend/Ses? (define config e segredo)
- [ ] Conta é sempre saída (a pagar) ou também a receber de cliente?
- [ ] Antecipação é por conta ou padrão global do usuário?

---

## 2. To Be (Specify)

### Resumo

Cadastrar contas a pagar com vencimento e receber lembrete automático no app e por e-mail 5, 3, 1 e 0 dias antes.

Nome exibido na sidebar (grupo `Em breve`): `Contas a pagar` + `Notificações`.

### Goals

- [ ] Registrar conta a pagar com valor, vencimento e descrição
- [ ] Configurar antecipação do alerta por conta (5, 3, 1 dia antes e no dia)
- [ ] Ver lista com dias restantes e status (a vencer, vence hoje, atrasada, paga)
- [ ] Receber alerta no app e por e-mail sem precisar abrir a tela
- [ ] Marcar como paga para parar os alertas

### Critérios de sucesso

- [ ] Criar conta via `POST /api/cobrancas` retorna `201`; aparece na lista com dias restantes corretos
- [ ] Job diário dispara e-mail + notificação in-app nos dias configurados (5/3/1/0 antes); conta paga não dispara
- [ ] Marcar paga via `PATCH /api/cobrancas/{id}/pagar` muda status e silencia alertas futuros
- [ ] `mvn test` e `npm run lint && npm run build` passam

### Non-goals

- Cobrança recorrente automática / parcelamento
- Anexar boleto / PDF / comprovante
- Cobrar cliente (a receber, Pix, link de pagamento)
- WhatsApp / SMS / push mobile nativo
- Multa, juros ou cálculo automático de atraso

### Restrições

- Stack existente: Spring Boot 4.1 + JPA, PostgreSQL, React 19 + Vite, JWT por usuário — sem quebrar auth atual
- Conta pertence a um usuário; nunca vazar conta de outro usuário (filtrar por dono em toda query)
- Valor em `NUMERIC`, data em `DATE`/`TIMESTAMPTZ` (nunca float, nunca `TIMESTAMP` sem TZ, nunca `VARCHAR(n)` — usar `TEXT` + `CHECK`)
- E-mail nunca expõe token; segredos SMTP só via env, nunca no repo
- E-mail via SMTP genérico (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`) — decisão do dev em 2026-10-10
- Seguir padrão de erro atual `{ timestamp, status, mensagem, campos }`

### Abordagens consideradas

| Opção | Prós | Contras | Escolha |
|-------|------|---------|---------|
| A — Job diário no back (Scheduler) + tabela `notificacoes` + e-mail SMTP | Um lugar só para regra de dias; funciona com app fechado; e-mail garantido | Precisa de mail + scheduler no back | Escolhida |
| B — Só front calcula dias restantes, sem e-mail | Entrega rápida, sem infra | Sem alerta com app fechado; quebra o pedido de e-mail | Não |
| C — Serviço externo de fila (Quartz/SQS/Resend workflows) | Escalável | Excesso para v1; nova dependência paga | Não |

**Recomendação do agente:** A — scheduler diário no Spring (`@Scheduled` 1x/dia, ex. 08:00 America/Sao_Paulo) lendo contas não pagas, gravando notificação in-app e enviando e-mail. Simples, atende "5/3/1/0 dias" e funciona com app fechado.

### Escopo da entrega

- **Decisão:** Uma spec em 2 fases
- **Justificativa:** Fase 1 entrega valor sem infra externa (CRUD + cálculo de dias + sino no app). Fase 2 liga o e-mail + job (precisa de SMTP). Fases desacopladas, mesma entidade.

### Requisitos funcionais

1. Conta tem: título, descrição opcional, valor positivo, vencimento (`yyyy-MM-dd`), antecipações `[5,3,1,0]` configuráveis por conta, status (`A_PAGAR`, `PAGA`), dono (usuário logado).
2. CRUD por dono: `GET/POST /api/cobrancas`, `GET/PUT/DELETE /api/cobrancas/{id}`, `PATCH /api/cobrancas/{id}/pagar` e `/desmarcar-paga`.
3. Lista ordenada por vencimento; cada item mostra dias restantes (`vencimento - hoje`): ex. `Faltam 3 dias`, `Vence hoje`, `Atrasada há 2 dias`.
4. Antecipação padrão ao criar: `[5,3,1,0]`; usuário pode marcar/desmarcar cada um (multiselect de 4 opções).
5. Job diário: para cada conta `A_PAGAR` onde `dias_restantes ∈ antecipações`, cria 1 notificação in-app e envia 1 e-mail (idempotente: não duplica no mesmo dia).
6. Sino no header + página `/cobrancas`: lista contas + lista notificações (não lidas primeiro); marcar notificação como lida.
7. Marcar paga registra `paga_em`; conta paga sai do job e da contagem de atrasadas.

### Edge cases

| Cenário | Comportamento esperado |
|---------|------------------------|
| Vencimento no passado ao criar | Permite, já nasce `Atrasada`; job só alerta a partir do dia seguinte (sem disparo retroativo em massa) |
| Valor zero/negativo | `400` com `campos.valor` apontando o input |
| Fuso / virada do dia | Cálculo em `America/Sao_Paulo`, job 1x/dia; dias restantes por data, não por hora |
| E-mail falha (SMTP fora) | Notificação in-app é criada mesmo assim; e-mail marcado como `FALHOU` e retentado no próximo ciclo |
| Conta paga no dia do alerta | Não envia; pagar silencia tudo |
| Excluir conta com notificações | Apaga notificações junto (ou oculta); sem órfãs |
| Outro usuário tenta ler/editar | `404` (não `403`, para não revelar existência) |

### Modelo de dados (PostgreSQL)

```sql
CREATE TABLE cobrancas (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL CHECK (LENGTH(titulo) BETWEEN 1 AND 120),
  descricao TEXT NOT NULL DEFAULT '',
  valor NUMERIC(10,2) NOT NULL CHECK (valor > 0),
  vencimento DATE NOT NULL,
  antecipacoes INTEGER[] NOT NULL DEFAULT '{5,3,1,0}',
  status TEXT NOT NULL DEFAULT 'A_PAGAR' CHECK (status IN ('A_PAGAR','PAGA')),
  paga_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON cobrancas (usuario_id);
CREATE INDEX ON cobrancas (vencimento) WHERE status = 'A_PAGAR';

CREATE TABLE notificacoes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  cobranca_id BIGINT NOT NULL REFERENCES cobrancas(id) ON DELETE CASCADE,
  dias_restantes INTEGER NOT NULL,
  canal TEXT NOT NULL CHECK (canal IN ('APP','EMAIL')),
  lida BOOLEAN NOT NULL DEFAULT false,
  enviada_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cobranca_id, dias_restantes, canal)
);
CREATE INDEX ON notificacoes (usuario_id) WHERE lida = false;
```

### Revisão da spec (Specify)

- [x] Sem TBD / placeholders vagos em §2 e §4
- [x] Goals ↔ critérios de sucesso ↔ RF ↔ US alinhados
- [x] Restrições e non-goals sem contradição
- [x] Abordagem escolhida refletida no To Be
- [x] Escopo da entrega adequado (2 fases)

### Confirmação de entendimento

**Agente entendeu como:** contas a pagar do próprio usuário, com alerta configurável 5/3/1/0 dias antes por conta, via sino no app + e-mail diário; pagar silencia.

**Dev confirmou:** [x] Sim — só conta a pagar (saída), confirmado em 2026-10-10. Sem conta a receber.

**Estado (futura, pendente):** sidebar exibe `Contas a pagar` + `Notificações` apagados no grupo `Em breve`. Falta implementar: tabela `cobrancas` + `notificacoes`, CRUD, job diário 08:00 America/Sao_Paulo, e-mail via SMTP genérico, sino e página `/cobrancas`.

---

## 3. Design

| Decisão | Alternativas | Motivo |
|---------|--------------|--------|
| Scheduler Spring `@Scheduled` | Fila externa | Sem nova infra na v1 |
| `notificacoes` com unique `(cobranca, dias, canal)` | Sem dedup | Idempotência do job |
| Antecipação por conta (`INTEGER[]`) | Config global | Pedido do dev: por conta |

---

## 4. User stories

### US-01: Cadastrar conta a pagar

**Como** usuário logado **quero** cadastrar título, valor e vencimento **para** não esquecer o que devo.

**Critérios de aceite:**

- [ ] Campos obrigatórios validados com mensagem no input exato
- [ ] Conta criada aparece na lista ordenada por vencimento com dias restantes

### US-02: Configurar antecipação

**Como** usuário **quero** marcar 5, 3, 1 dia antes e no dia **para** ser avisado do meu jeito.

**Critérios de aceite:**

- [ ] Padrão `[5,3,1,0]`; dá para desmarcar qualquer um
- [ ] Alteração salva e vale para os próximos ciclos

### US-03: Ser alertado no app e por e-mail

**Como** usuário **quero** ver sino + receber e-mail nos dias configurados **para** pagar no prazo com app fechado ou aberto.

**Critérios de aceite:**

- [ ] Nos dias 5/3/1/0: 1 notificação APP + 1 e-mail, sem duplicar no dia
- [ ] Textos: `Faltam 5 dias — Aluguel vence 15/10`, `Vence hoje`, `Atrasada há X dias`
- [ ] Conta paga não gera alerta

### US-04: Marcar como paga

**Como** usuário **quero** marcar/desmarcar paga **para** encerrar os alertas.

**Critérios de aceite:**

- [ ] Paga some da contagem de atrasadas e silencia job
- [ ] Desmarcar volta a alertar se ainda no prazo

---

## 5. Tasks

Ver `/sdd-04-plan` (não detalhado nesta fase de escopo).

---

## 6. Referências

- Sidebar atual: `Front-End/src/layout/AppSidebar.tsx`
- Rotas: `Front-End/src/App.tsx`
