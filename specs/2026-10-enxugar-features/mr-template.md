<!--
Título do MR: feat/enxugar-features Enxugar features Beta e scaffolds
-->
# feat/enxugar-features Enxugar features Beta e scaffolds

## Resumo

<!-- O que foi feito e por quê (1–3 frases). Preenchimento só no /sdd-08-docs. -->

## Tipo

- [x] Funcionalidade (`feat`)
- [ ] Correção (`fix`)
- [ ] Refatoração / Performance (`refactor` / `perf`)
- [ ] Documentação / Testes / Build / CI (`docs` / `test` / `chore`)

## Impactos e riscos

- [ ] Sem impactos relevantes
- [ ] Possíveis impactos relevantes, descritos abaixo
- [ ] Breaking change (quebra de compatibilidade) — descrever abaixo o que muda para consumidores

<!-- Descreva abaixo quando marcar "Possíveis impactos relevantes" ou "Breaking change".
     Ex.: rollback, ordem de deploy, dependência entre serviços, reprocessamento de dados,
     contratos/API alterados, migração exigida. -->

---

## Como testar

<!-- Passos para validação (menu, ação, endpoint, etc.). "Não se aplica" se sem impacto funcional. -->

## Evidências de sucesso

<!--
Logs, prints, respostas de endpoints, saídas de testes.
Para APIs: request/response ou referência à documentação OpenAPI/AsciiDoc atualizada.
-->

---

## Script de banco

- [ ] Sem alteração de banco
- [ ] Com script SQL — **arquivo(s):** <!-- ex.: `scripts/EPROC-123.sql` -->
- [ ] **Momento de execução:**
  - [ ] Antes do deploy (pode rodar com antecedência)
  - [ ] Junto com o deploy (obrigatório na mesma janela)

<!-- Se houver script, indique banco/escopo quando relevante (1g, 2g, local, nacional). -->

## Configurações / parâmetros

- [ ] Nenhuma configuração nova ou alterada
- [ ] Requer replicação no ambiente de deploy — **detalhes abaixo**

## Checklist

- [ ] Testei localmente
- [ ] Atualizei a documentação relevante (README, documentação técnica, etc.)
- [ ] O branch está atualizado com o branch de destino
- [ ] Removi código comentado, `console.log`/`System.out` e código de depuração
