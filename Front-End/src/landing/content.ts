export const nav = {
  links: [
    { label: 'Recursos', href: '#recursos' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Preços', href: '#precos' },
    { label: 'FAQ', href: '#faq' },
  ],
  loginLabel: 'Entrar',
  loginHref: '/login',
  ctaLabel: 'Criar conta grátis',
  ctaHref: '/registro',
}

export const hero = {
  badge: 'Seu livro-caixa de atendimentos',
  titleTop: 'Quem indicou, quanto pagou,',
  titleAccent: 'quando foi.',
  subtitle:
    'Você atende, anota nome, valor, data e quem indicou. No fim do mês você vê de onde veio cada real.',
  primaryCta: 'Criar conta grátis',
  secondaryCta: 'Ver como funciona',
  trustLine: 'Grátis no MVP, sem cartão · Só você acessa seus atendimentos',
  loginHref: '/login',
  ctaHref: '/registro',
}

export const statStrip = [
  { label: 'você leva para registrar um atendimento', value: '5 s' },
  { label: 'você cadastra clientes sem limite', value: '∞' },
  { label: 'você usa modo claro', value: 'nunca' },
  { label: 'você paga para começar', value: 'R$ 0' },
]

export const features = {
  eyebrow: 'Veja o caderno por dentro',
  kicker: 'Você fecha o mês com três anotações',
  subtitle:
    'Você abre e vê quem atendeu e quanto entrou. Você filtra por quem indicou.',
  items: [
    {
      id: 'ganhos',
      icon: 'chart',
      title: 'Você vê quanto entrou por quem indicou',
      description:
        'Você anota valor, data e origem em cada atendimento. Depois você filtra por indicação e soma o mês.',
      highlight: 'Extrato por indicação',
    },
    {
      id: 'origens',
      icon: 'tags',
      title: 'Você sabe de onde veio cada cliente',
      description:
        'Você marca Indicação, Instagram, Google. Você pinta cada origem e reutiliza no próximo cadastro.',
      highlight: 'Origens com cor própria',
    },
    {
      id: 'registro',
      icon: 'plus',
      title: 'Você anota no balcão em segundos',
      description:
        'Você digita nome, valor, data e origem. Você confere o total na hora, até no celular.',
      highlight: 'Cadastro de balcão',
    },
  ],
}

export const howItWorks = {
  eyebrow: 'Como você usa',
  kicker: 'Você cria a conta e fecha o mês',
  steps: [
    {
      title: 'Crie sua conta',
      description:
        'Você informa nome, e-mail e senha. Você leva menos de um minuto e não usa cartão.',
    },
    {
      title: 'Anote cada atendimento',
      description:
        'Você anota nome, valor, data e quem indicou. Você escreve como já escreve no caderno.',
    },
    {
      title: 'Feche o mês',
      description:
        'Você abre o painel e vê total, ticket médio e a origem que mais rendeu.',
    },
  ],
}

export const pricing = {
  eyebrow: 'Preço',
  kicker: 'Grátis enquanto é MVP',
  free: {
    name: 'Elo',
    tagline: 'Você registra clientes à vontade no caderno completo',
    price: 'R$ 0',
    priceSuffix: 'você entra sem cartão',
    features: [
      'Total do mês e ticket médio por indicação',
      'Clientes à vontade, com busca e edição',
      'Origens com cor própria',
    ],
    cta: 'Criar conta grátis',
    href: '/registro',
  },
  note: 'O Elo está em obra. Se uma página falhar, nos avise. Você mantém acesso grátis enquanto consertamos.',
}

export const faq = {
  eyebrow: 'Dúvidas de balcão',
  kicker: 'Leia antes de trocar o caderno',
  items: [
    {
      question: 'Quem vê os dados dos meus clientes?',
      answer:
        'Só você vê seus clientes. Você entra com e-mail e senha e seu token guarda a sessão. Nada sai da sua conta.',
    },
    {
      question: 'Preciso usar cartão de crédito para começar?',
      answer:
        'Você começa sem cartão. Sua conta segue grátis no MVP. Você roda o código aberto com Docker na sua máquina.',
    },
    {
      question: 'E se eu errar o valor de um atendimento?',
      answer:
        'Você corrige ou apaga qualquer atendimento. Você cria e apaga origens quando quiser.',
    },
    {
      question: 'Preciso conectar ao meu sistema financeiro?',
      answer:
        'Você anota cada atendimento à mão. Você decide o que entra e de onde veio cada cliente. Você não conecta banco nenhum.',
    },
    {
      question: 'Consigo usar no celular?',
      answer:
        'Você abre no celular e no computador. Você cadastra clientes e confere o total ganho no celular.',
    },
  ],
}

export const finalCta = {
  kicker: 'Troque o caderno hoje',
  headline: 'Anote o atendimento de hoje no Elo',
  subtitle:
    'Crie a conta e cadastre quem você atendeu hoje. Você vê o total do mês na hora.',
  cta: 'Criar conta grátis',
  href: '/registro',
}

export const footer = {
  description:
    'Você organiza atendimentos e faturamento por origem no Elo escuro.',
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
        { label: 'Criar conta grátis', href: '/registro' },
        { label: 'Entrar', href: '/login' },
      ],
    },
  ],
  rights: 'Elo © 2026. Todos os direitos reservados.',
}
