# Elo

Monorepo do Elo — gestão de clientes atendidos: **back-end Spring Boot** (API REST + PostgreSQL) e
**front-end React** (SPA com layout estilo SaaS/Prisma). Tudo sobe com `docker compose up -d`.

```
CRM_kauezao/
├── Back-end/clientes/     Spring Boot 4.1 - API REST e JPA
├── Front-End/             React 19 + Vite 6 (interface)
├── docker-compose.yml     postgres + backend + frontend
├── .env                   configuracao local (nao versionada)
└── .env.example           modelo das variaveis
```

## Como subir

```bash
cp .env.example .env      # ajuste a senha do banco
docker compose up -d --build
docker compose ps         # os 3 servicos devem ficar "healthy"
```

| Servico   | URL                    | Observacao                          |
| --------- | ---------------------- | ----------------------------------- |
| Front-end | http://localhost:3000  | SPA servida pelo nginx              |
| API       | http://localhost:8080  | `GET/POST/PUT/DELETE /api/clientes` |
| Banco     | localhost:5433         | `crm_kauezao`                       |

As portas sao definidas no `.env` (`FRONTEND_PORT`, `BACKEND_PORT`, `DB_PORT_EXTERNAL`).
Os valores padrao estao em 3000/8080/5433 (5433 porque o Postgres local ja ocupa a 5432).
Atencao: a 8080 e a mesma porta usada pelo backend do Prisma — nao rode os dois ao mesmo tempo.

Para derrubar: `docker compose down`. Para apagar **também** os dados:
`docker compose down -v`.

## Banco de dados

O schema das tabelas `clientes`, `usuarios` e `origens` esta em
`Back-end/clientes/src/main/resources/db/schema_clientes.sql` (usado quando o volume do
PostgreSQL ainda nao existe). O Spring roda com `ddl-auto: update` por padrao, entao ele
cria/ajusta tabelas sozinho caso o volume ja tenha sido criado sem elas.

> O container cria um PostgreSQL novo a partir desse schema, com as mesmas credenciais.
> Ele **não** importa automaticamente os dados de uma instalação local que você já tenha.

Variáveis usadas pela API: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`,
`SERVER_PORT`, `JPA_DDL_AUTO`, `CORS_ORIGINS`, `TOKEN_SECRET`, `TOKEN_EXPIRATION_SECONDS`.

## API

| Metodo | Rota                | Resposta                          |
| ------ | ------------------- | --------------------------------- |
| GET    | `/api/clientes`     | `200` lista                       |
| GET    | `/api/clientes/{id}`| `200` cliente / `404`             |
| POST   | `/api/clientes`     | `201` + `Location` / `400`        |
| PUT    | `/api/clientes/{id}`| `200` / `400` / `404`             |
| DELETE | `/api/clientes/{id}`| `204` / `404`                     |

## Autenticação

Conta e sessão com JWT (BCrypt + Spring Security). Fora de `/api/auth/*` e `/api/health`,
todo endpoint exige o cabeçalho `Authorization: Bearer <token>`.

| Metodo | Rota                  | Resposta                                             |
| ------ | --------------------- | ---------------------------------------------------- |
| POST   | `/api/auth/registro`  | `201` `{ "mensagem": ... }` / `400` / `409` (e-mail) |
| POST   | `/api/auth/login`     | `200` `{ token, nome, email }` / `400` / `401`       |
| GET    | `/api/auth/perfil`    | `200` `{ id, nome, email }`                          |
| PUT    | `/api/auth/perfil`    | `200` — corpo `{ nome }` e/ou `{ senhaAtual, senhaNova }` |
| GET    | `/api/origens`        | `200` lista de origens                               |
| POST   | `/api/origens`        | `201` / `400` / `409`                                |
| DELETE | `/api/origens/{id}`   | `204` / `404`                                        |

As origens são as categorias usadas como sugestão no campo "conhecido de onde" do cliente.
A senha deve ter entre 8 e 15 caracteres. Erros seguem o formato abaixo, e o `campos` é
consumido pelo front para apontar o erro no input exato:

```json
{
  "timestamp": "2026-10-02T18:32:18Z",
  "status": 400,
  "mensagem": "Por favor preencha o campo com valores positivos.",
  "campos": { "valorCobrado": "Por favor preencha o campo com valores positivos." }
}
```

## Rodando sem Docker

**Back-end** (precisa de um PostgreSQL com o schema criado):

```bash
cd Back-end/clientes
DB_HOST=localhost DB_PORT=5433 DB_NAME=crm_kauezao \
DB_USER=kauezao DB_PASSWORD='Kaue2904*' mvn spring-boot:run
```

**Front-end** (Vite com proxy/HMR para a API):

```bash
cd Front-End
cp .env.example .env       # VITE_API_URL
npm install
npm run dev
```

## Testes

```bash
cd Back-end/clientes && mvn test     # 24 testes (services + controllers)
cd Front-End        && npm run lint && npm run build
```

## Painel do Elo

Rotas da SPA (roteamento por hash, sem React Router):

| Rota               | Acesso          | Descricao                                      |
| ------------------ | --------------- | ---------------------------------------------- |
| `/`                | publico         | Landing page de vendas do Elo                   |
| `/#/login` / `/#/registro` | publico | Entrar / criar conta                          |
| `/#/dashboard`     | autenticado     | Painel: total ganho (soma de `valorCobrado`)   |
| `/#/clientes`      | autenticado     | CRUD de clientes atendidos                     |
| `/#/origens`       | autenticado     | Categorias de "conhecido de onde"              |
| `/#/configuracoes` | autenticado     | Perfil: nome e troca de senha                  |

A sessão fica no `localStorage` (`crm:token`, `crm:usuario`); um JWT vencido (401) encerra
a sessão e devolve a tela de login automaticamente.