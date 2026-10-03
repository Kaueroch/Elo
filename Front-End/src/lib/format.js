const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatarMoeda(valor) {
  return moeda.format(Number(valor) || 0)
}

/** Espera o padrao ISO do <input type="date"> (yyyy-MM-dd) e devolve dd/mm/aaaa. */
export function formatarData(valor) {
  const texto = (valor || '').trim()
  const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto)
  if (!partes) return texto || '-'
  return `${partes[3]}/${partes[2]}/${partes[1]}`
}

export function hojeIso() {
  const hoje = new Date()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${hoje.getFullYear()}-${mes}-${dia}`
}

/** Remove acentos e caixa para a busca casar "atendimento" com "Atendimento". */
export function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function iniciais(nome) {
  return (nome || '?').trim().charAt(0).toUpperCase()
}

/** Cinco tons de avatar, iguais aos do design original. */
export function corDoAvatar(indice) {
  return indice % 5
}