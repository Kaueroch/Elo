# Elo

Caderno de ganhos para quem trabalha por conta própria.

Você atende, cobra e, no fim do mês, não sabe quanto entrou. O Elo anota
cada atendimento e mostra o total no painel.

![Java](https://img.shields.io/badge/Java-17-10b981?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-10b981?style=flat-square&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-10b981?style=flat-square&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19-10b981?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-10b981?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/licen%C3%A7a-MIT-10b981?style=flat-square)

## Para quem é

Cabeleireiro, manicure, diarista, técnico, freelancer. Quem cobra por
serviço e não tem tempo para planilha.

## O que faz

- Anota o atendimento: nome, data, valor cobrado, trabalho feito e origem.
- Mostra o faturamento do mês no painel, com comparação ao mês anterior.
- Calcula ticket médio e mostra de onde vieram os clientes.
- Filtra o painel por mês ou mostra o histórico todo.
- Exporta os atendimentos em CSV.
- Login com e-mail e senha (JWT). Cada usuário só vê os próprios dados.

<!--
## Telas

| Painel | Clientes | Origens |
|--------|----------|---------|
| ![Painel](docs/screenshots/painel.png) | ![Clientes](docs/screenshots/clientes.png) | ![Origens](docs/screenshots/origens.png) |
-->

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Back-end | Java 17, Spring Boot 4.1, Spring Security, Spring Data JPA, Bean Validation |
| Auth | JWT + BCrypt, stateless |
| Banco | PostgreSQL |
| Front-end | React 19, TypeScript, Vite 6, Tailwind CSS 4, shadcn/ui, Recharts |
| Testes | JUnit 5, Mockito, MockMvc |

## Estrutura

```
.
├── Back-end/clientes/        # API REST (Spring Boot)
│   └── src/main/java/com/CRM/clientes/
│       ├── controllers/      # Endpoints REST
│       ├── services/         # Regras de negócio
│       ├── repository/       # Spring Data JPA
│       ├── domain/           # Entidades
│       ├── dtos/             # Request / Response
│       └── infra/            # Segurança, CORS, tratamento de erros
├── Front-End/                # SPA React (ver Front-End/README.md)
└── docs/                     # Roadmap e prints
```

## Como rodar

**Pré-requisitos:** Java 17, Node.js 20+ e PostgreSQL rodando na porta 5432.

### 1. Banco

```sql
CREATE DATABASE crm_kauezao;
```

As tabelas são criadas pelo Hibernate na primeira subida. O schema de
referência está em `Back-end/clientes/src/main/resources/db/schema_clientes.sql`.

### 2. Back-end

Crie o arquivo de config local com o usuário e a senha do seu Postgres
(ele fica fora do git):

```bash
cd Back-end/clientes/src/main/resources
cp application-local.yml.example application-local.yml
# edite username e password
```

Suba a API (ou rode `ClientesApplication` direto pela IDE):

```bash
cd Back-end/clientes
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`. Teste com `GET /api/health`.

### 3. Front-end

```bash
cd Front-End
cp .env.example .env
npm install
npm run dev
```

Abra `http://localhost:3000`. Em dev, o Vite repassa `/api` para a porta 8080.

### Testes

```bash
cd Back-end/clientes && ./mvnw test
cd Front-End && npm run lint && npm run build
```

## API

Todas as rotas, exceto `/api/auth/registro`, `/api/auth/login` e
`/api/health`, exigem `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Status da API |
| POST | `/api/auth/registro` | Criar conta |
| POST | `/api/auth/login` | Entrar (retorna o token) |
| GET, PUT | `/api/auth/perfil` | Ver ou atualizar perfil |
| GET, POST | `/api/clientes` | Listar ou criar atendimentos |
| GET, PUT, DELETE | `/api/clientes/{id}` | Ver, editar ou apagar um atendimento |
| GET, POST | `/api/origens` | Listar ou criar origens |
| DELETE | `/api/origens/{id}` | Apagar origem |

Os erros seguem o mesmo formato:

```json
{ "timestamp": "...", "status": 400, "mensagem": "...", "campos": { "email": "..." } }
```

`campos` diz qual input falhou, para o front marcar o campo certo.

## Produção

O `application.yml` lê variáveis de ambiente com padrões só para dev.
Em produção defina pelo menos `DB_URL`, `DB_USER`, `DB_PASSWORD`,
`TOKEN_SECRET` (forte), `CORS_ORIGINS` com seu domínio e, depois de criar
sua conta, `REGISTRATION_ENABLED=false`. A lista completa está em
[`.env.example`](.env.example). Cada módulo tem um `Dockerfile` próprio.

## Próximos passos

Veja o [roadmap](docs/futuro.md): contas a pagar com lembrete de vencimento,
notificações e verificação de e-mail por código.

## Licença

[MIT](LICENSE)
