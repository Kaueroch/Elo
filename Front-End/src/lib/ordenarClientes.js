/** Ordena a lista sem mutar a original (o filtro da busca reaproveita o array). */
export function ordenarClientes(lista, coluna, crescente) {
  return [...lista].sort((a, b) => {
    const va = valorOrdenavel(a, coluna)
    const vb = valorOrdenavel(b, coluna)
    const resultado = va < vb ? -1 : va > vb ? 1 : 0
    return crescente ? resultado : -resultado
  })
}

function valorOrdenavel(cliente, chave) {
  switch (chave) {
    case 'valorCobrado':
      return Number(cliente.valorCobrado) || 0
    case 'data':
      return cliente.data || ''
    case 'nome':
      return (cliente.nome || '').toLowerCase()
    case 'conhecidoDaOnde':
      return (cliente.conhecidoDaOnde || '').toLowerCase()
    default:
      return (cliente.trabalhoFeito || '').toLowerCase()
  }
}