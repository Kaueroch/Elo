# CRM Kauezao

Monorepo do CRM de clientes atendidos: **back-end Spring Boot** (API REST + PostgreSQL) e
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
| API       | http://localhost:8081  | `GET/POST/PUT/DELETE /api/clientes` |
| Banco     | localhost:5433         | `crm_kauezao`                       |

As portas sao definidas no `.env` (`FRONTEND_PORT`, `BACKEND_PORT`, `DB_PORT_EXTERNAL`).
Os valores padrao ja estao em 3000/8081/5433 porque as portas 8080 e 5432 da maquina
costumam estar ocupadas; volte para 8080/5432 no `.env` se quiser.

Para derrubar: `docker compose down`. Para apagar **também** os dados:
`docker compose down -v`.

## Banco de dados

O schema da tabela `clientes` foi preservado do projeto Java original
(`Back-end/clientes/src/main/resources/db/schema_clientes.sql`), e o Spring roda com
`ddl-auto: validate` — ou seja, ele confere o schema, mas nunca altera a tabela.

> O container cria um PostgreSQL novo a partir desse schema, com as mesmas credenciais.
> Ele **não** importa automaticamente os dados de uma instalação local que você já tenha.

Variáveis usadas pela API: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`,
`SERVER_PORT`, `JPA_DDL_AUTO`, `CORS_ORIGINS`.

## API

| Metodo | Rota                | Resposta                          |
| ------ | ------------------- | --------------------------------- |
| GET    | `/api/clientes`     | `200` lista                       |
| GET    | `/api/clientes/{id}`| `200` cliente / `404`             |
| POST   | `/api/clientes`     | `201` + `Location` / `400`        |
| PUT    | `/api/clientes/{id}`| `200` / `400` / `404`             |
| DELETE | `/api/clientes/{id}`| `204` / `404`                     |

Erros saem no formato:

```json
{
  "timestamp": "2026-10-02T18:32:18Z",
  "status": 400,
  "mensagem": "Por favor preencha o campo com valores positivos.",
  "campos": { "valorCobrado": "Por favor preencha o campo com valores positivos." }
}
```

O `campos` e consumido pelo front para apontar o erro no input exato.

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
cd Back-end/clientes && mvn test     # 19 testes (10 service + 9 controller)
cd Front-End        && npm run lint && npm run build
```

## Autenticação (pendente)

As telas de Login e Registro são apenas interface: **não existe** `/api/auth/login`,
`/api/auth/registro` nem tabela de usuários no backend, porque o escopo era reaproveitar
apenas o banco de clientes existente. A flag `AUTENTICACAO_IMPLEMENTADA` em
`Front-End/src/lib/auth.js` centraliza esse aviso e é o ponto de partida quando a
autenticação for implementada.