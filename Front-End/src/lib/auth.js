/**
 * O back-end atual expoe apenas /api/clientes (ver ClienteController): nao existe
 * endpoint de autenticacao nem tabela de usuarios, igual ao ProjetoJavaOrganizarClientes,
 * onde as telas de login e registro so eram renderizadas.
 *
 * Com AUTENTICACAO_IMPLEMENTADA em false as telas validam o formulario e avisam
 * que o acesso e provisorio. Para ligar de verdade: criar /api/auth/login e
 * /api/auth/registro no Spring, trocar o flag para true e guardar o token aqui.
 */
export const AUTENTICACAO_IMPLEMENTADA = false

export const AVISO_LOGIN =
  'Login ainda nao conectado ao back-end (nao existe /api/auth/login). Entrando sem autenticacao.'

export const AVISO_REGISTRO =
  'Cadastro ainda nao conectado ao back-end (nao existe /api/auth/registro). A conta nao foi criada.'