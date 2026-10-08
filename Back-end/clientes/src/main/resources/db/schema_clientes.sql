-- Schema da tabela de clientes, identico ao que ja existe no banco crm_kauezao.
-- O banco em si e criado pelo POSTGRES_DB do docker-compose, entao aqui nao
-- ha CREATE DATABASE. IF NOT EXISTS torna o script seguro para reexecucao.

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    conhecido_da_onde VARCHAR(100) NOT NULL,
    valor_cobrado NUMERIC(10, 2) NOT NULL,
    data VARCHAR(30) NOT NULL,
    trabalho_feito TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes (LOWER(nome));
CREATE INDEX IF NOT EXISTS idx_clientes_data ON clientes (data DESC);

-- Autenticacao: conta unica do dono do Elo. A senha e guardada com hash BCrypt.
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL
);

-- Categorias de "conhecido de onde" usadas como sugestao no formulario.
CREATE TABLE IF NOT EXISTS origens (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);