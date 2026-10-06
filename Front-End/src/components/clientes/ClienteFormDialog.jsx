import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Dialog } from '../ui/Dialog'
import { origensApi } from '../../lib/api'
import { hojeIso } from '../../lib/format'

const VAZIO = { nome: '', conhecidoDaOnde: '', valorCobrado: '', data: '', trabalhoFeito: '' }

function paraValores(cliente) {
  if (!cliente) return { ...VAZIO, data: hojeIso() }
  return {
    nome: cliente.nome || '',
    conhecidoDaOnde: cliente.conhecidoDaOnde || '',
    valorCobrado: String(cliente.valorCobrado ?? ''),
    data: cliente.data || hojeIso(),
    trabalhoFeito: cliente.trabalhoFeito || '',
  }
}

/** Valida no navegador com as mesmas regras do ClienteRequest do Spring. */
function validar(valores) {
  const erros = {}

  if (!valores.nome.trim()) {
    erros.nome = 'Por favor preencha o nome corretamente.'
  } else if (valores.nome.trim().length > 100) {
    erros.nome = 'O nome deve ter no maximo 100 caracteres.'
  }

  if (valores.conhecidoDaOnde.length > 100) {
    erros.conhecidoDaOnde = 'Use no maximo 100 caracteres.'
  }

  if (valores.valorCobrado.trim() === '') {
    erros.valorCobrado = 'Por favor preencha o valor cobrado.'
  } else if (Number(valores.valorCobrado) < 0) {
    erros.valorCobrado = 'O valor nao pode ser negativo.'
  }

  if (!valores.data.trim()) {
    erros.data = 'Por favor preencha a data corretamente.'
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(valores.data.trim())) {
    erros.data = 'A data deve estar no formato yyyy-MM-dd.'
  }

  return erros
}

function Campo({ id, rotulo, obrigatorio, erro, dica, children }) {
  return (
    <div className={`campo${erro ? ' campo--erro' : ''}`}>
      <label className="campo__rotulo" htmlFor={id}>
        {rotulo}
        {obrigatorio && (
          <span className="campo__obrigatorio" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {dica && !erro && <span className="campo__dica">{dica}</span>}
      <span className="campo__erro">{erro}</span>
    </div>
  )
}

/**
 * O formulario fica num componente proprio porque ele e remontado a cada
 * abertura do dialog: assim os campos nascem limpos sem preciso de efeito.
 */
function FormularioCliente({ cliente, origens, onFechar, onSalvar }) {
  const [valores, setValores] = useState(() => paraValores(cliente))
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [salvando, setSalvando] = useState(false)

  function atualiza(campo) {
    return (evento) => {
      setValores((atual) => ({ ...atual, [campo]: evento.target.value }))
      setErros((atual) => (atual[campo] ? { ...atual, [campo]: undefined } : atual))
    }
  }

  async function enviar(evento) {
    evento.preventDefault()

    const encontrados = validar(valores)
    setErros(encontrados)
    if (Object.keys(encontrados).length) return

    setSalvando(true)
    setErroGeral('')
    try {
      await onSalvar({
        nome: valores.nome.trim(),
        conhecidoDaOnde: valores.conhecidoDaOnde.trim(),
        valorCobrado: Number(valores.valorCobrado),
        data: valores.data.trim(),
        trabalhoFeito: valores.trabalhoFeito.trim(),
      })
    } catch (erro) {
      // Erros de campo vindos do Spring apontam o campo exato.
      if (erro.campos && Object.keys(erro.campos).length) {
        setErros(erro.campos)
      } else {
        setErroGeral(erro.message || 'Erro ao salvar o cliente.')
      }
      setSalvando(false)
    }
  }

  return (
    <>
      {erroGeral && (
        <p className="dialog__aviso" role="alert">
          <AlertCircle aria-hidden="true" />
          <span>{erroGeral}</span>
        </p>
      )}

      <form onSubmit={enviar} noValidate>
        <Campo id="cliente-nome" rotulo="Nome" obrigatorio erro={erros.nome}>
          <input
            id="cliente-nome"
            className="input"
            type="text"
            value={valores.nome}
            onChange={atualiza('nome')}
            placeholder="Nome completo"
            autoComplete="off"
          />
        </Campo>

        <div style={{ marginTop: 14 }}>
          <Campo
            id="cliente-origem"
            rotulo="Conhecido de onde"
            erro={erros.conhecidoDaOnde}
            dica="Indicacao, rede social, etc."
          >
            <input
              id="cliente-origem"
              className="input"
              type="text"
              value={valores.conhecidoDaOnde}
              onChange={atualiza('conhecidoDaOnde')}
              placeholder="Indicacao, rede social, etc."
              autoComplete="off"
              list="origens-sugestao"
            />
            <datalist id="origens-sugestao">
              {origens.map((origem) => (
                <option value={origem.nome} key={origem.id} />
              ))}
            </datalist>
          </Campo>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
          <Campo id="cliente-valor" rotulo="Valor cobrado" obrigatorio erro={erros.valorCobrado}>
            <input
              id="cliente-valor"
              className="input"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              value={valores.valorCobrado}
              onChange={atualiza('valorCobrado')}
              placeholder="0,00"
            />
          </Campo>

          <Campo id="cliente-data" rotulo="Data" obrigatorio erro={erros.data}>
            <input
              id="cliente-data"
              className="input"
              type="date"
              value={valores.data}
              onChange={atualiza('data')}
            />
          </Campo>
        </div>

        <div style={{ marginTop: 14 }}>
          <Campo id="cliente-trabalho" rotulo="Trabalho feito" erro={erros.trabalhoFeito}>
            <textarea
              id="cliente-trabalho"
              className="textarea"
              value={valores.trabalhoFeito}
              onChange={atualiza('trabalhoFeito')}
              placeholder="Descreva o servico prestado..."
            />
          </Campo>
        </div>

        <div className="dialog__acoes">
          <button type="button" className="btn btn--outline" onClick={onFechar} disabled={salvando}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary" disabled={salvando}>
            {salvando && <span className="spinner" aria-hidden="true" />}
            {salvando ? 'Salvando...' : cliente ? 'Salvar alteracoes' : 'Salvar cliente'}
          </button>
        </div>
      </form>
    </>
  )
}

export function ClienteFormDialog({ aberto, cliente, onFechar, onSalvar }) {
  const [origens, setOrigens] = useState([])

  // Sugestoes do datalist: se a API falhar o formulario segue funcionando sem elas.
  useEffect(() => {
    if (!aberto) return undefined
    let vivo = true
    origensApi
      .listar()
      .then((lista) => {
        if (vivo) setOrigens(lista)
      })
      .catch(() => {})
    return () => {
      vivo = false
    }
  }, [aberto])

  if (!aberto) return null

  return (
    <Dialog
      aberto
      onFechar={onFechar}
      titulo={cliente ? 'Editar cliente' : 'Novo cliente'}
      subtitulo={cliente ? cliente.nome : 'Preencha os dados para registrar um atendimento.'}
    >
      <FormularioCliente
        cliente={cliente}
        origens={origens}
        onFechar={onFechar}
        onSalvar={onSalvar}
      />
    </Dialog>
  )
}