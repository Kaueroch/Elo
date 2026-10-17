# Elo

Caderno de ganhos e trabalhos para quem trabalha por conta própria.

Você atende, cobra e, no fim do mês, não sabe quanto entrou. O Elo anota
cada atendimento e mostra o total no painel.

## Para quem é

Cabeleireiro, manicure, diarista, técnico, freelancer. Quem cobra por
serviço e não tem tempo para planilha.

O problema não é falta de talento. É falta de registro.

## O que o Elo faz

- Anota o atendimento: nome, data, valor cobrado, trabalho feito, origem.
- Mostra o faturamento do mês no painel, com comparação ao mês anterior.
- Calcula ticket médio e melhor marca.
- Mostra de onde vieram os clientes.
- Exporta tudo em CSV com um clique.
- Login com e-mail e senha. Troca de nome, e-mail e senha com código.

## Telas

| Painel | Clientes | Origens |
|--------|----------|---------|
| ![Painel](docs/screenshots/painel.png) | ![Clientes](docs/screenshots/clientes.png) | ![Origens](docs/screenshots/origens.png) |

Coloque os prints em `docs/screenshots/`.

## Como subir

Com Docker:

```bash
cp .env.example .env
docker compose up -d --build
```

| Serviço | URL |
|---------|-----|
| Front-end | http://localhost:3000 |
| API | http://localhost:8080 |
| Banco | localhost:5433 |

Sem Docker:

```bash
cd Back-end/clientes && mvn spring-boot:run
cd Front-End && npm install && npm run dev
```

## Rotas

| Rota | O que faz |
|------|-----------|
| `/` | Apresentação do Elo |
| `/login`, `/registro` | Entrar ou criar conta |
| `/dashboard` | Painel de ganhos |
| `/clientes` | Atendimentos |
| `/origens` | De onde vêm os clientes |
| `/configuracoes/perfil` | Nome, e-mail, senha |
| `/configuracoes/conta` | Origens, exportar CSV, sair |

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/registro` | Criar conta |
| POST | `/api/auth/login` | Entrar |
| GET, PUT | `/api/auth/perfil` | Ver ou atualizar perfil |
| GET, POST, DELETE | `/api/clientes` | Atendimentos |
| GET, POST, DELETE | `/api/origens` | Origens |

Erros seguem `{ timestamp, status, mensagem, campos }`. O campo `campos`
indica qual input falhou.

## Segurança

Uso pessoal. Seus dados ficam no seu banco.

Em produção, defina `TOKEN_SECRET` forte, `DB_PASSWORD` forte,
`CORS_ORIGINS` com seu domínio e `REGISTRATION_ENABLED=false`.

## Em breve

Contas a pagar com lembrete de vencimento.

## Licença

MIT.
