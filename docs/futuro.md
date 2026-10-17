# Futuro — roadmap de features do Elo

Fonte de verdade do escopo: [`specs/`](../specs/README.md). Aqui vai o resumo
por feature: telas, endpoints, fases, dependências e estado.

## 1. Contas a pagar — `futura`

Escopo completo em [`specs/2026-10-cobrancas/spec.md`](../specs/2026-10-cobrancas/spec.md).
Sidebar mostra `Contas a pagar` apagado no grupo `Em breve`.

- **Telas (front):** `/cobrancas` com lista ordenada por vencimento
  (`Faltam 3 dias`, `Vence hoje`, `Atrasada há 2 dias`), cadastro com
  antecipações `[5,3,1,0]` por conta, botão pagar/desmarcar.
- **Endpoints (back):** `GET/POST /api/cobrancas`, `GET/PUT/DELETE
  /api/cobrancas/{id}`, `PATCH /api/cobrancas/{id}/pagar` e `/desmarcar-paga`.
- **Tabelas:** `cobrancas` + `notificacoes` (ver SQL na spec).
- **Job:** diário 08:00 America/Sao_Paulo; idempotente por
  `(cobranca, dias_restantes, canal)`.
- **Fases:** 1 = CRUD + dias restantes; 2 = job + e-mail + sino.
- **Depende de:** SMTP genérico via env (`MAIL_HOST/PORT/USER/PASS/FROM`).

## 2. Notificações (sino + e-mail) — `futura`

Parte das specs de cobranças e verificação; placeholder `Notificações` no
`Em breve`.

- **Telas (front):** sino no header com não lidas primeiro, lista de avisos,
  preferências em `/configuracoes/notificacoes` (hoje só localStorage).
- **E-mail:** mesmo SMTP das cobranças; falha marca `FALHOU` e tenta no ciclo
  seguinte sem bloquear o aviso no app.
- **Depende de:** contas a pagar e/ou verificação (quem gera os avisos).

## 3. Verificação de e-mail, Fase 2 (back) — `futura`

Fase 1 (front) entregue em 2026-10-10. Falta o back, detalhado em
[`specs/2026-10-verificacao-email/spec.md`](../specs/2026-10-verificacao-email/spec.md).

- **Endpoints:** `POST /api/auth/verificacao/solicitar` (202),
  `POST /api/auth/verificacao/confirmar` (`{trocaToken}`, 10 min),
  `POST /api/auth/redefinir/senha`, `POST /api/auth/redefinir/email`.
- **Tabela:** `verificacoes_email` (código só como hash, 15 min, 5 tentativas,
  reenvio 60s).
- **Regras:** erros de troca sempre `400` (nunca `401`); `trocaToken` no corpo.
- **Depende de:** SMTP genérico via env.

## Ordem sugerida

1. Verificação Fase 2 (destrava e-mail para tudo).
2. Contas a pagar Fase 1 (CRUD + dias).
3. Job + sino + e-mail (fecha o loop de cobrança).
4. Backlog pequeno conforme demanda.
