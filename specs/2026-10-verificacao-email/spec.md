---
issue: N/A
tipo: feat
titulo: Configurações em telas individuais + troca de senha e e-mail com código
branch: feat/verificacao-email
tdd: false
tdd_integracao: fora
feature_flag: nao
status: executing
criado: 2026-10-10
autor: @kauezao
---

# Spec: Configurações em telas individuais + troca com código no e-mail

## Metadados

| Campo | Valor |
|-------|-------|
| Issue | `N/A` |
| Tipo | feat |
| Branch | `feat/verificacao-email` |
| TDD | `false` · integrações: `fora` |
| Feature flag | `nao` |
| Pasta | `specs/2026-10-verificacao-email/` |
| Status | draft |

## Por quê?

Hoje as 4 seções (Perfil, Aparência, Notificações, Conta) vivem em abas de uma página só, e senha/e-mail trocam com a senha atual digitada na hora. O pedido: cada seção vira tela própria, e trocar dado sensível exige prova de posse do e-mail — back envia código de 6 dígitos, usuário confere numa página e só então cai na página de redefinir.

## 1. As Is (Research)

### Contexto

`ProfilePage` usa `Tabs` controlado (`section` em `App.tsx`); sidebar tem submenu que troca a seção sem mudar a URL (rota única `/configuracoes`). `PerfilService.atualizaPerfil` já troca nome, e-mail (com `senhaAtual`) e senha. Não existe envio de e-mail (`pom.xml` sem `spring-boot-starter-mail`), nem código de verificação, nem rotas por seção.

### Comportamento atual

- PUT `/api/auth/perfil` troca nome livremente; e-mail/senha exigem `senhaAtual` correta (erro `400` para não derrubar a sessão).
- Front: `PerfilForm` edita nome + senha na mesma tela; sem tela de código nem de redefinição separada.

### Arquivos e componentes relevantes

| Área | Caminho / componente | Papel |
|------|----------------------|-------|
| Back auth | `Back-end/.../controllers/AuthController.java` | Onde entram os endpoints de verificação |
| Back auth | `Back-end/.../services/autenticacao/PerfilService.java` | Regra atual de troca de nome/e-mail/senha |
| Back auth | `Back-end/.../services/autenticacao/TokenServices.java` | Base para o token curto de troca |
| Back sec | `Back-end/.../infra/security/WebSecurityConfig.java` | Novos endpoints continuam autenticados |
| Back deps | `Back-end/clientes/pom.xml` | Falta `spring-boot-starter-mail` |
| Front | `Front-End/src/profile/ProfilePage.tsx` | Abas que viram telas |
| Front rotas | `Front-End/src/App.tsx` (`TAB_PATHS`, `getTabFromPath`) | Roteamento manual a estender |
| Front sidebar | `Front-End/src/layout/AppSidebar.tsx` | Submenu passa a navegar por rota |
| Front api | `Front-End/src/shared/services/authApi.ts` | Chamadas `PUT /api/auth/perfil` |

### Lacunas do research

- [ ] Trocar só o nome exige código ou é livre? (perguntado ao dev)
- [ ] SMTP é o mesmo genérico via env da spec de cobranças? (assumido sim)

---

## 2. To Be (Specify)

### Resumo

Cada aba vira rota própria (`/configuracoes/perfil`, `/aparencia`, `/notificacoes`, `/conta`); trocar senha ou e-mail passa por código de 6 dígitos no e-mail atual e termina em página de redefinição.

### Goals

- [ ] Navegar por URL entre as 4 telas; sidebar reflete a rota; voltar do navegador funciona
- [ ] Solicitar código → receber no e-mail atual → conferir → redefinir senha ou e-mail
- [ ] Sem código válido, nenhuma troca sensível acontece (nem chamando a API direto)
- [ ] E-mail de código via SMTP genérico (mesma decisão da spec de cobranças)

### Critérios de sucesso

- [ ] Abrir `/configuracoes/aparencia` direto cai na tela certa com o submenu marcado
- [ ] `POST /api/auth/verificacao/solicitar` retorna `202` e o e-mail chega com código de 6 dígitos
- [ ] Código errado/expirado → `400` com mensagem no input; 5 erros bloqueiam o código
- [ ] `POST /api/auth/verificacao/confirmar` com código certo devolve token de troca (10 min)
- [ ] Redefinir senha/e-mail só com token de troca válido; após troca, header mostra dado novo
- [ ] `mvn test` e `npm run lint && npm run build` passam

### Non-goals

- 2FA no login; OAuth/Google; upload de avatar
- Tema claro (já mapeado como Em breve); WhatsApp/SMS/push
- Reenvio automático; mudar e-mail sem acesso ao atual (sem fluxo de recuperação)

### Restrições

- Stack e padrões atuais: Spring Boot 4.1 + JPA, PostgreSQL, React sem Router, JWT, erro `{ timestamp, status, mensagem, campos }`
- Código nunca em claro no banco (só hash BCrypt); nunca no log
- SMTP só via env (`MAIL_HOST/PORT/USER/PASS/FROM`); segredo nunca no repo
- Token de troca: curta duração (10 min), propósito único (`redefinicao`), um uso por motivo
- Postgres: `BIGINT GENERATED ALWAYS AS IDENTITY`, `TEXT` + `CHECK`, `TIMESTAMPTZ`, índice em FK

### Abordagens consideradas

| Opção | Prós | Contras | Escolha |
|-------|------|---------|---------|
| A — Rotas por seção + páginas verificar/redefinir | Deep-link, F5 mantém o passo, sidebar reflete URL | Mais arquivos | Escolhida |
| B — Tudo em estado local numa página | Menos código | F5 perde o fluxo; quebra o pedido de "telas" e "outra página" | Não |
| C — Código em modal | Rápido | Quebra o pedido explícito de outra página | Não |

**Recomendação do agente:** A — é o que o dev descreveu literalmente.

### Escopo da entrega

- **Decisão:** Uma spec em 2 fases
- **Justificativa:** Fase 1 é só front (telas/rotas, sem backend). Fase 2 é back + e-mail + páginas do fluxo. Entregáveis desacoplados.

### Requisitos funcionais

1. Rotas (aba `configuracoes`, seção pela URL): `/configuracoes/perfil`, `/aparencia`, `/notificacoes`, `/conta`; raiz `/configuracoes` redireciona para `/perfil`.
2. Tela Perfil mostra nome + e-mail atuais: nome troca direto na tela (sem código, decisão do dev em 2026-10-10); e-mail e senha usam os botões `Trocar e-mail` e `Trocar senha` com verificação.
3. `POST /api/auth/verificacao/solicitar {motivo: SENHA|EMAIL}` (autenticado) → cria código de 6 dígitos (hash + expira em 15 min + zera tentativas anteriores do motivo) e envia e-mail `Seu código Elo: 123456`. Resposta `202` sem expor o código. Reenvio com intervalo mínimo de 60s.
4. Página Verificar (`/configuracoes/verificar?motivo=...`): input de 6 dígitos, `Reenviar código`, erros por tentativa. `POST /api/auth/verificacao/confirmar {motivo, codigo}` → código certo e válido devolve `{ trocaToken }` (10 min); 5 erros ou expirado invalidam o código (`400` + pedir novo).
5. Página Redefinir (`/configuracoes/redefinir?motivo=...`): usa `trocaToken` (fora do JWT de sessão, guardado só em memória da página, enviado no corpo da requisição).
   - SENHA: nova senha + confirmação (8–15, iguais) → `POST /api/auth/redefinir/senha`.
   - EMAIL: novo e-mail (formato válido, `409` se já cadastrado) → `POST /api/auth/redefinir/email`; sessão mantida, header atualizado.
6. Token de troca de outro usuário, expirado ou reutilizado → `400` (nunca `401`, para não derrubar a sessão) sem aplicar nada.
7. Após sucesso: toast (`Você trocou a senha.` / `Você trocou o e-mail.`) e volta para `/configuracoes/perfil`.

### Edge cases

| Cenário | Comportamento esperado |
|---------|------------------------|
| Código expirado (15 min) | `400` `Código vencido. Peça um novo.` |
| 5 tentativas erradas | Código invalidado; pedir novo |
| Reenvio antes de 60s | `429` `Aguarde antes de pedir outro.` |
| E-mail novo igual ao atual / já cadastrado | `400` / `409` com `campos.email` |
| Senhas diferentes / fora de 8–15 | `400` com `campos` no input exato |
| F5 na página Redefinir | Token em memória se perde → volta para Verificar (sem quebrar) |
| Sessão expira no meio do fluxo | 401 derruba para `/login` (regra atual) |
| SMTP fora do ar | `502` `Não deu para enviar agora. Tente de novo.`; nada é invalidado |

### Modelo de dados (PostgreSQL)

```sql
CREATE TABLE verificacoes_email (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  motivo TEXT NOT NULL CHECK (motivo IN ('SENHA','EMAIL')),
  codigo_hash TEXT NOT NULL,
  expira_em TIMESTAMPTZ NOT NULL,
  tentativas INTEGER NOT NULL DEFAULT 0,
  usada BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON verificacoes_email (usuario_id);
```

### Revisão da spec (Specify)

- [x] Sem TBD em §2 e §4 (exceto decisão de nome, perguntada abaixo)
- [x] Goals ↔ critérios ↔ RF ↔ US alinhados
- [x] Restrições e non-goals sem contradição
- [x] Abordagem escolhida refletida no To Be
- [x] Escopo em fases desacopladas
- Decisão do dev (2026-10-10): nome troca livre na tela; só e-mail e senha pedem código.

### Confirmação de entendimento

**Agente entendeu como:** 4 telas por rota; senha e e-mail só trocam com código de 6 dígitos (15 min, 5 tentativas, reenvio 60s) enviado ao e-mail atual + token de troca de 10 min; SMTP genérico via env.

**Dev confirmou:** [x] Sim (2026-10-10). Escopo confirmado: só front (Fase 1); backend intacto.

**Entrega Fase 1 (front, 2026-10-10):** rotas `/configuracoes/perfil|aparencia|notificacoes|conta|verificar|redefinir`, telas individuais sem barra de abas, páginas Verificar (código 6 dígitos, reenvio 60s) e Redefinir (senha/e-mail), token de troca só em memória, breadcrumb acompanha. `PUT /api/auth/perfil` segue para o nome. Botões de código chamam os endpoints novos e mostram o erro sem quebrar.

**Futura — Fase 2 (back, pendente):** `spring-boot-starter-mail` + SMTP via env, tabela `verificacoes_email`, endpoints `POST /api/auth/verificacao/solicitar`, `POST /api/auth/verificacao/confirmar`, `POST /api/auth/redefinir/senha`, `POST /api/auth/redefinir/email` (erros de troca sempre `400`, nunca `401`). Sem isso, os botões `Trocar senha/e-mail` exibem a falha e o fluxo não avança.

---

## 3. Design

| Decisão | Alternativas | Motivo |
|---------|--------------|--------|
| Código 6 dígitos + hash | Link mágico | Simples de digitar; sem rota pública nova |
| Token de troca separado da sessão | Reusar JWT | Escopo e vida curta limitam dano |
| Código sempre para o e-mail atual | Para o e-mail novo | Prova posse da conta antes de mudar |
| Fase 1 front / Fase 2 back+e-mail | Tudo junto | Front anda sem SMTP pronto |
| trocaToken no corpo JSON | Header `Authorization` | Não mexe no filtro JWT nem arrisca derrubar a sessão |

---

## 4. User stories

### US-01: Navegar nas telas de configurações

**Como** usuário **quero** abrir Perfil, Aparência, Notificações e Conta por link próprio **para** voltar onde parei e usar o botão voltar.

**Critérios de aceite:**

- [ ] Cada seção tem URL; F5 mantém a tela; sidebar marca a seção atual

### US-02: Pedir código no e-mail

**Como** usuário **quero** pedir o código ao clicar Trocar senha/e-mail **para** provar que o e-mail é meu.

**Critérios de aceite:**

- [ ] E-mail chega com código de 6 dígitos; reenvio respeita 60s

### US-03: Conferir o código

**Como** usuário **quero** digitar o código **para** liberar a redefinição.

**Critérios de aceite:**

- [ ] Código certo leva para Redefinir; errado/expirado mostra erro no input sem avançar

### US-04: Redefinir senha

**Como** usuário **quero** definir a nova senha após o código **para** continuar entrando com ela.

**Critérios de aceite:**

- [ ] Nova senha 8–15 + confirmação igual; login seguinte usa a nova

### US-05: Redefinir e-mail

**Como** usuário **quero** definir o novo e-mail após o código **para** receber ali os próximos avisos.

**Critérios de aceite:**

- [ ] E-mail válido e livre; header e sessão atualizam sem deslogar; `409` se ocupado

---

## 5. Tasks

Ver `/sdd-04-plan` após confirmação (fases 1 e 2 separadas).

---

## 6. Referências

- `Front-End/src/profile/ProfilePage.tsx`, `src/App.tsx`, `src/layout/AppSidebar.tsx`
- `Back-end/.../services/autenticacao/PerfilService.java`, `controllers/AuthController.java`
