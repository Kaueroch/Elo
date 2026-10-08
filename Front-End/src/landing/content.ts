export const nav = {
  links: [
    { label: 'Recursos', href: '#recursos' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Preços', href: '#precos' },
    { label: 'FAQ', href: '#faq' },
  ],
  loginLabel: 'Entrar',
  loginHref: '#/login',
  ctaLabel: 'Criar conta grátis',
  ctaHref: '#/registro',
}

export const hero = {
  badge: 'Gestão de clientes simples e direta',
  titleTop: 'Seus clientes, organizados.',
  titleAccent: 'Seu faturamento, em dia.',
  subtitle:
    'O Elo junta clientes, origens de indicação e valores cobrados em um painel escuro, rápido e direto ao ponto — sem planilhas soltas e sem burocracia.',
  primaryCta: 'Criar conta grátis',
  secondaryCta: 'Ver como funciona',
  trustLine: 'Grátis durante o MVP · Open source · Rode no Docker · Proteção de ponta a ponta',
  loginHref: '#/login',
  ctaHref: '#/registro',
}

export const statStrip = [
  { label: 'Módulos integrados', value: '3' },
  { label: 'Registrar um atendimento', value: '5 s' },
  { label: 'Modo claro', value: 'Nunca' },
  { label: 'Custos escondidos', value: 'Zero' },
]

export const features = {
  eyebrow: 'Recursos',
  kicker: 'Feito para quem atende e quer acompanhar cada cliente',
  headline: 'Tudo o que uma planilha não te dá, sem a dor de cabeça dela.',
  subtitle:
    'Em vez de uma grade de atalhos genérica, o Elo entrega três módulos que respondem à pergunta que importa: quem são meus clientes e de onde eles vêm?',
  items: [
    {
      id: 'ganhos',
      icon: 'chart',
      title: 'Veja quanto você já faturou',
      description:
        'Cada atendimento é registrado com valor, data e origem. O painel transforma tudo em um donut de ganhos por origem e uma tabela de atividade recente — você vê o padrão em segundos, não em horas de reconciliação.',
      highlight: 'Ganhos por origem',
    },
    {
      id: 'origens',
      icon: 'tags',
      title: 'Origens com a sua cara',
      description:
        'Cadastre de onde vêm seus clientes: indicação de amigos, redes sociais, anúncios. Cada origem aparece com a sua cor no painel e serve de sugestão no cadastro.',
      highlight: 'Origens em cores próprias',
    },
    {
      id: 'registro',
      icon: 'plus',
      title: 'Registre em segundos',
      description:
        'Nome, valor cobrado, data e origem. O painel atualiza o total ganho, o donut e a atividade recente na hora.',
      highlight: 'Atendimento rápido',
    },
  ],
}

export const howItWorks = {
  eyebrow: 'Como funciona',
  kicker: 'Da primeira conta ao painel completo em minutos',
  steps: [
    {
      title: 'Crie sua conta gratuita',
      description:
        'Cadastro com nome, e-mail e senha. Leva menos de um minuto e não pede cartão de crédito.',
    },
    {
      title: 'Registre seus atendimentos',
      description:
        'Cada cliente tem nome, valor cobrado, data e origem. Organizado por padrão, sem esforço extra.',
    },
    {
      title: 'Acompanhe tudo no painel',
      description:
        'Total ganho, clientes atendidos, ticket médio e ganhos por origem aparecem já no primeiro acesso.',
    },
  ],
}

export const pricing = {
  eyebrow: 'Preços',
  kicker: 'Sem tabela de preços escondida. Sem letras miúdas.',
  free: {
    name: 'Elo',
    tagline: 'Tudo liberado durante o MVP',
    price: 'R$ 0',
    priceSuffix: 'para sempre, por enquanto',
    features: [
      'Painel com total ganho, clientes e ticket médio',
      'Clientes ilimitados com busca, filtros e edição',
      'Origens de indicação com cores próprias',
    ],
    cta: 'Criar conta grátis',
    href: '#/registro',
  },
  note: 'O Elo está em desenvolvimento ativo. Se algo quebrar, contamos com você para nos avisar — e o acesso continua grátis.',
}

export const faq = {
  eyebrow: 'FAQ',
  kicker: 'Perguntas de quem cuida da própria carteira de clientes costuma fazer',
  items: [
    {
      question: 'Os dados dos meus clientes ficam seguros?',
      answer:
        'Sim. Os dados ficam protegidos de ponta a ponta: a comunicação entre o seu dispositivo e o Elo é segura, e tudo o que você registra fica associado exclusivamente à sua conta, sem compartilhamento com terceiros.',
    },
    {
      question: 'Preciso usar cartão de crédito para começar?',
      answer:
        'Não. O Elo é um projeto open source: o código é aberto e basta subir o Docker para usar o sistema na sua própria máquina. Pela plataforma, a conta é gratuita durante o MVP e não pedimos cartão em nenhum momento.',
    },
    {
      question: 'E se eu errar o valor de um atendimento?',
      answer:
        'Você pode corrigir ou excluir qualquer cliente a qualquer momento. Nada aqui é permanente: as origens também podem ser criadas e excluídas quando você quiser.',
    },
    {
      question: 'Preciso conectar ao meu sistema financeiro?',
      answer:
        'Não. O Elo não se conecta a bancos nem a outros sistemas. Você registra seus atendimentos manualmente — o que significa controle total sobre o que entra e de onde vem cada cliente.',
    },
    {
      question: 'Consigo usar no celular?',
      answer:
        'Sim. O painel é construído mobile-first e escala para telas grandes. O essencial — cadastrar clientes e checar o total ganho — funciona bem no celular.',
    },
  ],
}

export const finalCta = {
  kicker: 'Comece hoje',
  headline: 'Pronto para organizar seus clientes?',
  subtitle:
    'Crie sua conta gratuita e cadastre seu primeiro cliente em menos de dez minutos.',
  cta: 'Criar conta grátis',
  href: '#/registro',
}

export const footer = {
  description:
    'Gestão de clientes em modo escuro. Organize atendimentos, origens de indicação e faturamento em um só lugar.',
  columns: [
    {
      title: 'Produto',
      links: [
        { label: 'Recursos', href: '#recursos' },
        { label: 'Como funciona', href: '#como-funciona' },
        { label: 'Preços', href: '#precos' },
        { label: 'FAQ', href: '#faq' },
      ],
    },
    {
      title: 'Conta',
      links: [
        { label: 'Criar conta grátis', href: '#/registro' },
        { label: 'Entrar', href: '#/login' },
      ],
    },
  ],
  rights: 'Elo © 2026. Todos os direitos reservados.',
}
